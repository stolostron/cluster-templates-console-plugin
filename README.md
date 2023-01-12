# OpenShift Console Plugin Template

This project is a minimal template for writing a new OpenShift Console dynamic
plugin. It requires OpenShift 4.11.

[Dynamic plugins](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk)
allow you to extend the
[OpenShift UI](https://github.com/openshift/console)
at runtime, adding custom pages and other extensions. They are based on
[webpack module federation](https://webpack.js.org/concepts/module-federation/).
Plugins are registered with console using the `ConsolePlugin` custom resource
and enabled in the console operator config by a cluster administrator.

[Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com) are required
to build and run the example. To run OpenShift console in a container, either
[Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io) and
[oc](https://console.redhat.com/openshift/downloads) are required.

## Getting started

After cloning this repo, you should update the plugin metadata such as the
plugin name in the `consolePlugin` declaration of [package.json](package.json).

```json
"consolePlugin": {
  "name": "my-plugin",
  "version": "0.0.1",
  "displayName": "My Plugin",
  "description": "Enjoy this shiny, new console plugin!",
  "exposedModules": {
    "ExamplePage": "./components/ExamplePage"
  },
  "dependencies": {
    "@console/pluginAPI": "*"
  }
}
```

The template adds a single example page in the Home navigation section. The
extension is declared in the [console-extensions.json](console-extensions.json)
file and the React component is declared in
[src/components/ExamplePage.tsx](src/components/ExamplePage.tsx).

You can run the plugin using a local development environment or build an image
to deploy it to a cluster.

## Development

### Option 1: Local

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/example> to see the running plugin.

#### Running start-console with Apple silicon and podman

If you are using podman on a Mac with Apple silicon, `yarn run start-console`
might fail since it runs an amd64 image. You can workaround the problem with
[qemu-user-static](https://github.com/multiarch/qemu-user-static) by running
these commands:

```bash
podman machine ssh
sudo -i
rpm-ostree install qemu-user-static
systemctl reboot
```

### Option 2: Docker + VSCode Remote Container

Make sure the
[Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension is installed. This method uses Docker Compose where one container is
the OpenShift console and the second container is the plugin. It requires that
you have access to an existing OpenShift cluster. After the initial build, the
cached containers will help you start developing in seconds.

1. Create a `dev.env` file inside the `.devcontainer` folder with the correct values for your cluster:

```bash
OC_PLUGIN_NAME=my-plugin
OC_URL=https://api.example.com:6443
OC_USER=kubeadmin
OC_PASS=<password>
```

2. `(Ctrl+Shift+P) => Remote Containers: Open Folder in Container...`
3. `yarn run start`
4. Navigate to <http://localhost:9000/example>

### Running and updating the cluster as a service operator

#### Install/update the operator

0. Remove original operator `operator-sdk cleanup cluster-aas-operator`
1. Install `operator-sdk` (<https://sdk.operatorframework.io/docs/installation/>)
2. `oc login` to the development cluster
3. `oc project cluster-aas-operator`
4. `operator-sdk run bundle quay.io/stolostron/cluster-templates-bundle:latest --timeout 5m` (Or use desired version from <https://quay.io/repository/stolostron/cluster-templates-bundle?tab=tags>)
5. Once the operator bundle is installed, there is a service called `cluster-aas-operator-repo-bridge-service` in the `cluster-aas-operator` namespace

#### Setup proxy to the bridge service

To allow the development UI connecting to the bridge service via proxy, the service needs to be exposed via a route:

```
oc process -p DOMAIN=$(oc get ingresses.config/cluster -o jsonpath={.spec.domain}) -f scripts/start-ocp-console/ocp-bridge-service-route-template.yaml | oc apply -f -
```

Available endpoints are defined here: <https://github.com/stolostron/cluster-templates-operator/blob/main/bridge/server.go#L175-L176>

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:

   ```sh
   docker build -t quay.io/my-repositroy/my-plugin:latest .
   ```

2. Run the image:

   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/my-repository/my-plugin:latest
   ```

3. Push the image:

   ```sh
   docker push quay.io/my-repository/my-plugin:latest
   ```

NOTE: If you have a Mac with Apple silicon, you will need to add the flag
`--platform=linux/amd64` when building the image to target the correct platform
to run in-cluster.

## Deployment on cluster

A [Helm](https://helm.sh) chart is available to deploy the plugin to an OpenShift environment.

The following Helm parameters are required:

`plugin.image`: The location of the image containing the plugin that was previously pushed

Additional parameters can be specified if desired. Consult the chart [values](charts/openshift-console-plugin/values.yaml) file for the full set of supported parameters.

### Installing the Helm Chart

Install the chart using the name of the plugin as the Helm release name into a new namespace or an existing namespace as specified by the `my-plugin-namespace` parameter and providing the location of the image within the `plugin.image` parameter by using the following command:

```shell
helm upgrade -i  my-plugin charts/openshift-console-plugin -n my-plugin-namespace --create-namespace --set plugin.image=my-plugin-image-location
```

NOTE: When deploying on OpenShift 4.10, it is recommended to add the parameter `--set plugin.securityContext.enabled=false` which will omit configurations related to Pod Security.

## Linting

This project adds prettier, eslint, and stylelint. Linting can be run with
`yarn run lint`.

The stylelint config disallows hex colors since these cause problems with dark
mode (starting in OpenShift console 4.11). You should use the
[PatternFly global CSS variables](https://patternfly-react-main.surge.sh/developer-resources/global-css-variables#global-css-variables)
for colors instead.

The stylelint config also disallows naked element selectors like `table` and
`.pf-` or `.co-` prefixed classes. This prevents plugins from accidentally
overwriting default console styles, breaking the layout of existing pages. The
best practice is to prefix your CSS classnames with your plugin name to avoid
conflicts. Please don't disable these rules without understanding how they can
break console styles!

## References

- [Console Plugin SDK README](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk)
- [Customization Plugin Example](https://github.com/spadgett/console-customization-plugin)
- [Dynamic Plugin Enhancement Proposal](https://github.com/openshift/enhancements/blob/master/enhancements/console/dynamic-plugins.md)
