import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { DeserializedClusterTemplate, ClusterTemplateVendor } from '../types/resourceTypes';

const TEMPLATES_LABEL_PREFIX = 'clustertemplates.openshift.io';

export const TEMPLATE_LABELS = {
  description: `${TEMPLATES_LABEL_PREFIX}/description`,
  vendor: `${TEMPLATES_LABEL_PREFIX}/vendor`,
};

const getLabelValue = (resource: K8sResourceCommon, labelName: string) =>
  resource.metadata?.labels?.[labelName];

export const getClusterTemplateVendor = (
  clusterTemplate: DeserializedClusterTemplate,
): ClusterTemplateVendor | undefined => {
  const labelValue = getLabelValue(clusterTemplate, TEMPLATE_LABELS.vendor);
  if (!labelValue) {
    return ClusterTemplateVendor.CUSTOM;
  }
  return labelValue === ClusterTemplateVendor.REDHAT
    ? ClusterTemplateVendor.REDHAT
    : ClusterTemplateVendor.CUSTOM;
};

export const isRedHatTemplate = (clusterTemplate: DeserializedClusterTemplate) =>
  getClusterTemplateVendor(clusterTemplate) === ClusterTemplateVendor.REDHAT;

export const getClusterTemplateDescription = (clusterTemplate?: DeserializedClusterTemplate) =>
  clusterTemplate?.metadata?.annotations?.[TEMPLATE_LABELS.description];
