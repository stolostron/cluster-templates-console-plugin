#!/bin/bash

oc scale deployment.v1.apps/caas-ui -n caas-ui --replicas=0

sed 's/__USER__/'"$USER"'/g' ./scripts/deploy-ui.yaml > /tmp/out.yaml
oc apply -f /tmp/out.yaml
rm -f /tmp/out.yaml

oc scale deployment.v1.apps/caas-ui -n caas-ui --replicas=2
