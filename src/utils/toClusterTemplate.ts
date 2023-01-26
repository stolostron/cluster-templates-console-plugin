import { ObjectMetadata } from '@openshift-console/dynamic-plugin-sdk';
import { HelmFormikValues, WizardFormikValues } from '../components/ClusterTemplateWizard/types';
import { INSTANCE_NAMESPACE_VAR } from '../constants';
import { ArgoCDSpec, ClusterTemplate } from '../types';
import { TEMPLATE_LABELS } from './clusterTemplateDataUtils';

const HUB_CLUSTER_SERVER = 'https://kubernetes.default.svc';
const NEW_CLUSTER_SERVER = '${new_cluster}';
const DEFAULT_PROJECT = 'default';

const getArgoCDSpec = (values: HelmFormikValues, destinationServer: string): ArgoCDSpec => {
  return {
    source: {
      repoURL: values.url,
      chart: values.chart,
      targetRevision: values.version,
    },
    destination: {
      namespace: values.destinationNamespace,
      server: destinationServer,
    },
    project: DEFAULT_PROJECT,
  };
};

export const toClusterTemplateSpec = (values: WizardFormikValues): ClusterTemplate['spec'] => {
  const postSettings = values.postInstallation.map((formValues) => ({
    name: `${formValues.url}/${formValues.chart}`,
    spec: getArgoCDSpec(formValues, NEW_CLUSTER_SERVER),
  }));
  const installationSpec = {
    ...values.installation.spec,
    destinationNamespace: values.installation.useInstanceNamespace
      ? INSTANCE_NAMESPACE_VAR
      : values.installation.spec.destinationNamespace,
  };
  return {
    cost: values.details.cost,
    clusterDefinition: getArgoCDSpec(installationSpec, HUB_CLUSTER_SERVER),
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
