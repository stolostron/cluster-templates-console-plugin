import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { ClusterTemplate, ClusterTemplateVendor, ApplicationSource } from '../types/resourceTypes';

const TEMPLATES_LABEL_PREFIX = 'clustertemplates.openshift.io';

export const TEMPLATE_LABELS = {
  description: `${TEMPLATES_LABEL_PREFIX}/description`,
  vendor: `${TEMPLATES_LABEL_PREFIX}/vendor`,
};

const getLabelValue = (resource: K8sResourceCommon, labelName: string) =>
  resource.metadata?.labels?.[labelName];

export const getClusterTemplateVendor = (
  clusterTemplate: ClusterTemplate,
): ClusterTemplateVendor | undefined => {
  const labelValue = getLabelValue(clusterTemplate, TEMPLATE_LABELS.vendor);
  if (!labelValue) {
    return ClusterTemplateVendor.CUSTOM;
  }
  return labelValue === ClusterTemplateVendor.REDHAT
    ? ClusterTemplateVendor.REDHAT
    : ClusterTemplateVendor.CUSTOM;
};

export const isRedHatTemplate = (clusterTemplate: ClusterTemplate) =>
  getClusterTemplateVendor(clusterTemplate) === ClusterTemplateVendor.REDHAT;

export const getClusterTemplateDescription = (clusterTemplate?: ClusterTemplate) =>
  clusterTemplate?.metadata?.annotations?.[TEMPLATE_LABELS.description];

export const isHelmAppSpec = (source: ApplicationSource) => !!source.chart;

export const getClusterDefinitionHelmChart = (clusterTemplate: ClusterTemplate) =>
  clusterTemplate.spec.clusterDefinition.source.chart;

export const isHelmClusterDefinition = (clusterTemplate: ClusterTemplate) =>
  isHelmAppSpec(clusterTemplate.spec.clusterDefinition.source);
