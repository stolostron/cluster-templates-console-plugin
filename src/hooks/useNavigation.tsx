import { K8sGroupVersionKind, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { useHistory } from 'react-router';
import { clusterTemplateGVK, clusterTemplateQuotaGVK } from '../constants';
import { ClusterTemplate, Quota } from '../types/resourceTypes';
import { getResourceUrl } from '../utils/k8s';

export type ClusterTemplatePageTab = 'repositories' | 'quotas';

const getResourceEditPageUrl = (gvk: K8sGroupVersionKind, resource: K8sResourceCommon) =>
  `${getResourceUrl(gvk, resource.metadata?.name || '', resource.metadata?.namespace)}/edit`;

const getResourceCreatePageUrl = (gvk: K8sGroupVersionKind) => `${getResourceUrl(gvk)}/~new`;

export const getResourceDetailsPageUrl = (
  gvk: K8sGroupVersionKind,
  resource: K8sResourceCommon,
  tab?: string,
) => {
  let url = `${getResourceUrl(gvk, resource.metadata?.name || '', resource.metadata?.namespace)}`;
  if (tab) {
    url += `/${tab}`;
  }
  return url;
};
export const getClusterTemplatesPageUrl = (tab?: ClusterTemplatePageTab) => {
  let url = getResourceUrl(clusterTemplateGVK);
  if (tab) {
    url += `?tab=${tab}`;
  }
  return url;
};

export const getQuotasPageUrl = () => getClusterTemplatesPageUrl('quotas');

export const useNavigation = () => {
  const history = useHistory();
  return {
    goToClusterTemplatesPage: (tab?: ClusterTemplatePageTab) => {
      history.push(getClusterTemplatesPageUrl(tab));
    },
    goToClusterTemplateEditPage: (clusterTemplate: ClusterTemplate) =>
      history.push(getResourceEditPageUrl(clusterTemplateGVK, clusterTemplate)),
    goToClusterTemplateCreatePage: () => history.push(getResourceCreatePageUrl(clusterTemplateGVK)),
    goToQuotaEditPage: (quota: Quota) =>
      history.push(getResourceEditPageUrl(clusterTemplateQuotaGVK, quota)),
    goToQuotaCreatePage: () => history.push(getResourceCreatePageUrl(clusterTemplateQuotaGVK)),
    goToQuotaDetailsPage: (quota: Quota) =>
      history.push(getResourceDetailsPageUrl(clusterTemplateQuotaGVK, quota)),
    goToClusterTemplateDetailsPage: (clusterTemplate: ClusterTemplate, tab?: string) =>
      history.push(getResourceDetailsPageUrl(clusterTemplateGVK, clusterTemplate, tab)),
  };
};
