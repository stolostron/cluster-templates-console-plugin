import { k8sGet, useK8sModel, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { clusterTemplateQuotaGVK, CLUSTER_TEMPLATES_ROLE, roleBindingGVK } from '../constants';

import { Quota, QuotaDetails, RoleBinding } from '../types';

export const useAllQuotas = (): [Quota[], boolean, unknown] =>
  useK8sWatchResource<Quota[]>({
    groupVersionKind: clusterTemplateQuotaGVK,
    isList: true,
    namespaced: true,
  });

const useClusterTemplateRoleBindings = () => {
  const [rbs, loaded, error] = useK8sWatchResource<RoleBinding[]>({
    groupVersionKind: roleBindingGVK,
    namespaced: true,
    isList: true,
  });
  const clusterTemplateRbs = rbs.filter((rb) => rb.roleRef.name === CLUSTER_TEMPLATES_ROLE);
  return [clusterTemplateRbs, loaded, error];
};

export const getQuotaTemplateNames = (quota: Quota) => {
  return quota.spec?.allowedTemplates?.map((templateData) => templateData.name) || [];
};

export type QuotasData = {
  getAllQuotasDetails(): QuotaDetails[];
  getQuota(quotaName, quotaNamespace): Promise<Quota>;
  getClusterTemplateQuotasDetails: (clusterTemplateName: string) => QuotaDetails[];
  getQuotaDetails: (quotaName: string, quotaNamespace: string) => QuotaDetails;
};

const getDetails = (quota: Quota, rbs: RoleBinding[]): QuotaDetails => {
  const quotaRbs = rbs.filter((rb) => rb.metadata?.namespace === quota.metadata?.namespace);
  let numUsers = 0;
  let numGroups = 0;
  for (const rb of quotaRbs) {
    if (!rb.subjects) {
      continue;
    }
    for (const subject of rb.subjects) {
      if (subject.kind === 'Group') {
        numGroups++;
      } else if (subject.kind === 'User') {
        numUsers++;
      }
    }
  }
  return {
    name: quota.metadata?.name,
    namespace: quota.metadata?.namespace,
    budget: quota.spec?.budget,
    budgetSpent: quota.status?.budgetSpent,
    uid: quota.metadata?.uid,
    numGroups,
    numUsers,
  };
};

export const useQuotas = (): [QuotasData, boolean, unknown] => {
  const [allQuotas, quotasLoaded, quotasError] = useAllQuotas();
  const [rbs, roleBindingsLoaded, roleBindingsError] = useClusterTemplateRoleBindings();
  const [quotasModel, quotasModelLoading] = useK8sModel(clusterTemplateQuotaGVK);
  const loaded = quotasLoaded && roleBindingsLoaded;
  const error = quotasError || roleBindingsError;
  const data: QuotasData = React.useMemo(() => {
    return {
      getAllQuotasDetails: () => allQuotas.map((quota) => getDetails(quota, rbs)),
      getQuota: async (quotaName: string, quotaNamespace: string) => {
        const quota = allQuotas.find(
          (curQuota) =>
            curQuota.metadata?.name === quotaName &&
            curQuota.metadata?.namespace === quotaNamespace,
        );
        if (quota) {
          return quota;
        }
        return await k8sGet({
          model: quotasModel,
          name: quotaName,
          ns: quotaNamespace,
        });
      },
      getClusterTemplateQuotasDetails: (clusterTemplateName: string) => {
        return allQuotas
          .filter((quota) => getQuotaTemplateNames(quota).includes(clusterTemplateName))
          .map((quota) => getDetails(quota, rbs));
      },
      getQuotaDetails: (name: string, namespace: string) => {
        const quota = allQuotas.find(
          (curQuota) =>
            curQuota.metadata?.name === name && curQuota.metadata?.namespace === namespace,
        );
        return quota ? getDetails(quota, rbs) : undefined;
      },
    };
  }, [allQuotas, rbs]);
  return [data, loaded && !quotasModelLoading, error || quotasError];
};
