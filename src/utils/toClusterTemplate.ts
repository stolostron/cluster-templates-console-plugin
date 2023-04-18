import { ObjectMetadata } from '@openshift-console/dynamic-plugin-sdk';
import {
  PostInstallationFormikValues,
  GitRepoSourceFormikValues,
  HelmSourceFormikValues,
  isHelmSource,
  WizardFormikValues,
} from '../types/wizardFormTypes';
import { CREATE_NAMESPACE_SYNC_OPTION, INSTANCE_NAMESPACE_VAR } from '../constants';
import {
  ApplicationSource,
  ArgoCDSpec,
  ClusterSetup,
  ClusterTemplate,
} from '../types/resourceTypes';
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
  syncPolicy: ArgoCDSpec['syncPolicy'],
): ArgoCDSpec => {
  return {
    source,
    destination: {
      namespace: destinationNamespace,
      server: destinationServer,
    },
    project: DEFAULT_PROJECT,
    syncPolicy,
  };
};

const getSyncPolicy = (values: PostInstallationFormikValues): ArgoCDSpec['syncPolicy'] => {
  return {
    automated: values.autoSync ? { prune: values.pruneResources } : undefined,
    syncOptions: values.createNamespace ? [CREATE_NAMESPACE_SYNC_OPTION] : undefined,
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
    spec: getArgoSpec(
      NEW_CLUSTER_SERVER,
      values.destinationNamespace,
      source,
      getSyncPolicy(values),
    ),
  };
};

export const getClusterSetup = (values: WizardFormikValues): ClusterSetup =>
  values.postInstallation.map((formValues) => getClusterSetupItem(formValues));

export const getClusterDefinition = (values: WizardFormikValues): ArgoCDSpec =>
  getArgoSpec(
    HUB_CLUSTER_SERVER,
    values.installation.useInstanceNamespace
      ? INSTANCE_NAMESPACE_VAR
      : values.installation.destinationNamespace,
    getArgoHelmSource(values.installation.source),
    { automated: {} },
  );

export const getAnnotations = (
  values: WizardFormikValues,
): ObjectMetadata['annotations'] | undefined => {
  if (values.details.description) {
    return { [TEMPLATE_LABELS.description]: values.details.description };
  }
  return undefined;
};

const toClusterTemplate = (
  values: WizardFormikValues,
  originalClusterTemplate?: ClusterTemplate,
): ClusterTemplate => {
  return {
    ...originalClusterTemplate,
    apiVersion: 'clustertemplate.openshift.io/v1alpha1',
    kind: 'ClusterTemplate',
    metadata: {
      ...originalClusterTemplate?.metadata,
      name: values.details.name,
      annotations: getAnnotations(values),
      labels: values.details.labels,
    },
    spec: {
      cost: originalClusterTemplate?.spec?.cost ? originalClusterTemplate.spec.cost : 0,
      clusterDefinition: getClusterDefinition(values),
      clusterSetup: getClusterSetup(values),
    },
  };
};

export default toClusterTemplate;
