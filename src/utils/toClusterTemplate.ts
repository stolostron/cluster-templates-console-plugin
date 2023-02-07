import { K8sResourceCommon, ObjectMetadata } from '@openshift-console/dynamic-plugin-sdk';
import {
  PostInstallationFormikValues,
  GitRepoSourceFormikValues,
  HelmSourceFormikValues,
  isHelmSource,
  WizardFormikValues,
} from '../components/ClusterTemplateWizard/types';
import { INSTANCE_NAMESPACE_VAR } from '../constants';
import { ApplicationSource, ArgoCDSpec, ClusterTemplate } from '../types';
import { TEMPLATE_LABELS } from './clusterTemplateDataUtils';

const HUB_CLUSTER_SERVER = 'https://kubernetes.default.svc';
const NEW_CLUSTER_SERVER = '${new_cluster}';
const DEFAULT_PROJECT = 'default';

const getArgoHelmSource = (values: HelmSourceFormikValues): ApplicationSource => ({
  repoURL: values.url,
  chart: values.chart,
  targetRevision: values.version,
});

const getArgoGitSource = (values: GitRepoSourceFormikValues): ApplicationSource => ({
  repoURL: values.url,
  targetRevision: values.commit,
  path: values.directory,
});

const getArgoSpec = (
  destinationServer: string,
  destinationNamespace: string | undefined,
  source: ApplicationSource,
  autoSync = false,
  pruneResources = false,
): ArgoCDSpec => {
  return {
    source,
    destination: {
      namespace: destinationNamespace,
      server: destinationServer,
    },
    project: DEFAULT_PROJECT,
    syncPolicy: autoSync
      ? {
          automated: { prune: pruneResources },
        }
      : undefined,
  };
};

const getClusterSetupItem = (
  values: PostInstallationFormikValues,
): { name: string; spec: ArgoCDSpec } => {
  const source: ApplicationSource = isHelmSource(values.source)
    ? getArgoHelmSource(values.source)
    : getArgoGitSource(values.source);
  return {
    name: isHelmSource(values.source)
      ? `${values.source.url}/${values.source.chart}`
      : `${values.source.url}/${values.source.commit}`,
    spec: getArgoSpec(NEW_CLUSTER_SERVER, values.destinationNamespace, source),
  };
};

export const toClusterTemplateSpec = (values: WizardFormikValues): ClusterTemplate['spec'] => {
  const postSettings = values.postInstallation.map((formValues) => getClusterSetupItem(formValues));
  const installationSpec = getArgoSpec(
    HUB_CLUSTER_SERVER,
    values.installation.useInstanceNamespace
      ? INSTANCE_NAMESPACE_VAR
      : values.installation.destinationNamespace,
    getArgoHelmSource(values.installation.source),
  );
  return {
    cost: values.details.cost,
    clusterDefinition: installationSpec,
    clusterSetup: postSettings,
  };
};

export const getAnnotations = (
  values: WizardFormikValues,
): ObjectMetadata['annotations'] | undefined => {
  if (values.details.description) {
    return { [TEMPLATE_LABELS.description]: values.details.description };
  }
  return undefined;
};

const toClusterTemplate = (values: WizardFormikValues): ClusterTemplate => {
  return {
    apiVersion: 'clustertemplate.openshift.io/v1alpha1',
    kind: 'ClusterTemplate',
    metadata: {
      name: values.details.name,
      annotations: getAnnotations(values),
    },
    spec: toClusterTemplateSpec(values),
  };
};

export default toClusterTemplate;
