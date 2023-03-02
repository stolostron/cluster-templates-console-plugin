import React from 'react';
import { clusterTemplateQuotaGVK } from '../constants';

import { Quota } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';

export const useAllQuotas = (): [Quota[], boolean, unknown] =>
  useK8sWatchResource<Quota[]>({
    groupVersionKind: clusterTemplateQuotaGVK,
    isList: true,
    namespaced: true,
  });

export const getQuotaTemplateNames = (quota: Quota) => {
  return quota.spec?.allowedTemplates?.map((templateData) => templateData.name) || [];
};

export const getClusterTemplateQuotas = (allQuotas: Quota[], clusterTemplateName: string) =>
  allQuotas.filter((quota) => getQuotaTemplateNames(quota).includes(clusterTemplateName));

export const useClusterTemplateQuotas = (
  clusterTemplateName: string,
): [Quota[], boolean, unknown] => {
  const [allQuotas, loaded, error] = useAllQuotas();
  const clusterTemplateQuotas = React.useMemo<Quota[]>(
    () => getClusterTemplateQuotas(allQuotas, clusterTemplateName),
    [allQuotas, clusterTemplateName],
  );
  return [clusterTemplateQuotas, loaded, error];
};

export const useQuotasCount = (): number | undefined => {
  const [quotas, loaded, loadError] = useAllQuotas();
  return quotas && loaded && !loadError ? quotas.length : undefined;
};

export const useQuota = (name: string, namespace: string) =>
  useK8sWatchResource<Quota>({
    groupVersionKind: clusterTemplateQuotaGVK,
    namespaced: true,
    name,
    namespace,
  });
