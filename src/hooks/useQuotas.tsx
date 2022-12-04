import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { clusterTemplateQuotaGVK, CLUSTER_TEMPLATES_ROLE, roleBindingGVK } from '../constants';

import { Quota, QuotaDetails, RoleBinding } from '../types';

const useClusterTemplateRoleBindings = () => {
  const [rbs, loaded, error] = useK8sWatchResource<RoleBinding[]>({
    groupVersionKind: roleBindingGVK,
    namespaced: true,
    isList: true,
  });
  const clusterTemplateRbs = rbs.filter((rb) => rb.roleRef.name === CLUSTER_TEMPLATES_ROLE);
  return [clusterTemplateRbs, loaded, error];
};

const getQuotaTemplateNames = (quota: Quota) => {
  return quota.spec?.allowedTemplates?.map((templateData) => templateData.name) || [];
};

export type QuotasData = {
  getAllQuotasDetails(): QuotaDetails[];
  getQuota(quotaName, quotaNamespace): Quota;
  getClusterTemplateQuotasDetails: (clusterTemplateName: string) => QuotaDetails[];
  namespaceHasQuota: (namespace: string) => boolean;
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
    numGroups,
    numUsers,
  };
};

export const useQuotas = (): [QuotasData, boolean, unknown] => {
  const [allQuotas, quotasLoaded, quotasError] = useK8sWatchResource<Quota[]>({
    groupVersionKind: clusterTemplateQuotaGVK,
    isList: true,
    namespaced: true,
  });
  const [rbs, roleBindingsLoaded, roleBindingsError] = useClusterTemplateRoleBindings();
  const loaded = quotasLoaded && roleBindingsLoaded;
  const error = quotasError || roleBindingsError;

  const data: QuotasData = React.useMemo(() => {
    return {
      getAllQuotasDetails: () => allQuotas.map((quota) => getDetails(quota, rbs)),
      getQuota: (quotaName: string, quotaNamespace: string) => {
        return allQuotas.find(
          (quota) =>
            quota.metadata?.name === quotaName && quota.metadata?.namespace === quotaNamespace,
        );
      },
      getClusterTemplateQuotasDetails: (clusterTemplateName: string) => {
        return allQuotas
          .filter((quota) => getQuotaTemplateNames(quota).includes(clusterTemplateName))
          .map((quota) => getDetails(quota, rbs));
      },
      namespaceHasQuota: (namespace: string): boolean =>
        !!allQuotas.find((quota) => quota.metadata?.namespace === namespace),
      getQuotaDetails: (name: string, namespace: string) => {
        const quota = data.getQuota(name, namespace);
        return quota ? getDetails(quota, rbs) : null;
      },
    };
  }, [allQuotas, rbs]);
  return [data, loaded, error];
};
