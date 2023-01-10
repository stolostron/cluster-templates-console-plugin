#!/usr/bin/env bash

set -euo pipefail

mkdir -p ocp-console
oc process -f scripts/start-ocp-console/ocp-console-oauth-client.yaml | oc apply -f -
oc get oauthclient console-oauth-client -o jsonpath='{.secret}' > ocp-console/console-client-secret
oc get secrets -n default --field-selector type=kubernetes.io/service-account-token -o json | \
    jq '.items[0].data."ca.crt"' -r | python -m base64 -d > ocp-console/ca.crt

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9000}

echo "Starting local OpenShift console..."

BRIDGE_BASE_ADDRESS="http://localhost:9000"
BRIDGE_USER_AUTH="openshift"
BRIDGE_K8S_MODE="off-cluster"
BRIDGE_K8S_AUTH="openshift"
BRIDGE_CA_FILE="/tmp/ca.crt"
BRIDGE_USER_AUTH_OIDC_CLIENT_ID="console-oauth-client"
BRIDGE_USER_AUTH_OIDC_CLIENT_SECRET_FILE="/tmp/console-client-secret"
BRIDGE_USER_AUTH_OIDC_CA_FILE="/tmp/ca.crt"
BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true
BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$(oc whoami --show-server)
# The monitoring operator is not always installed (e.g. for local OpenShift). Tolerate missing config maps.
set +e
BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.thanosPublicURL}' 2>/dev/null)
BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.alertmanagerPublicURL}' 2>/dev/null)
set -e
BRIDGE_K8S_AUTH_BEARER_TOKEN=$(oc whoami --show-token 2>/dev/null)
BRIDGE_USER_SETTINGS_LOCATION="localstorage"

# Don't fail if the cluster doesn't have gitops.
set +e
GITOPS_HOSTNAME=$(oc -n openshift-gitops get route cluster -o jsonpath='{.spec.host}' 2>/dev/null)
set -e
if [ -n "$GITOPS_HOSTNAME" ]; then
    BRIDGE_K8S_MODE_OFF_CLUSTER_GITOPS="https://$GITOPS_HOSTNAME"
fi

echo "API Server: $BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT"
echo "Console Image: $CONSOLE_IMAGE"
echo "Console URL: http://localhost:${CONSOLE_PORT}"

# Prefer podman if installed. Otherwise, fall back to docker.
if [ -x "$(command -v podman)" ]; then
    if [ "$(uname -s)" = "Linux" ]; then
        # Use host networking on Linux since host.containers.internal is unreachable in some environments.
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://localhost:9001"
        podman run \
          --pull always --rm --network=host \
          -v $PWD/ocp-console/console-client-secret:/tmp/console-client-secret:Z \
          -v $PWD/ocp-console/ca.crt:/tmp/ca.crt:Z \
          --env BRIDGE_PLUGIN_PROXY='{"services":[{"consoleAPIPath":"/api/proxy/plugin/clustertemplates-plugin/repositories/","endpoint":"https://claas-helm-repo-cluster-aas-operator.apps.rawagner3.cyty.p1.openshiftapps.com","authorize": true}]}' \
          --env-file <(set | grep BRIDGE) \
          $CONSOLE_IMAGE
    else
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://host.containers.internal:9001"
        podman run \
          --pull always --rm -p "$CONSOLE_PORT":9000 \
          -v $PWD/ocp-console/console-client-secret:/tmp/console-client-secret \
          -v $PWD/ocp-console/ca.crt:/tmp/ca.crt \
          --env BRIDGE_PLUGIN_PROXY='{"services":[{"consoleAPIPath":"/api/proxy/plugin/clustertemplates-plugin/repositories/","endpoint":"https://claas-helm-repo-cluster-aas-operator.apps.rawagner3.cyty.p1.openshiftapps.com","authorize": true}]}' \
          --env-file <(set | grep BRIDGE) \
          $CONSOLE_IMAGE
    fi
else
    BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=http://host.docker.internal:9001"
    docker run \
      --pull always --rm -p "$CONSOLE_PORT":9000 \
      -v $PWD/ocp-console/console-client-secret:/tmp/console-client-secret \
      -v $PWD/ocp-console/ca.crt:/tmp/ca.crt \
      --env BRIDGE_PLUGIN_PROXY='{"services":[{"consoleAPIPath":"/api/proxy/plugin/clustertemplates-plugin/repositories/","endpoint":"https://claas-helm-repo-cluster-aas-operator.apps.rawagner3.cyty.p1.openshiftapps.com","authorize": true}]}' \
      --env-file <(set | grep BRIDGE) \
      $CONSOLE_IMAGE
fi
