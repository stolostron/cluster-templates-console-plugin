import { useK8sModel, k8sUpdate, k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK, clusterTemplateQuotaGVK } from '../constants';
import { Quota } from '../types/resourceTypes';
import { AllowedTemplateFormValues, QuotaFormValues } from '../types/quotaFormTypes';
import { getApiVersion } from '../utils/k8s';
import { useClusterTemplates } from './useClusterTemplates';
import React from 'react';

const toQuotaSpec = (quotaFormValues: QuotaFormValues): Quota['spec'] => ({
  budget: quotaFormValues.budget,
  allowedTemplates: quotaFormValues.templates.map((template) => ({
    name: template.template,
    count: template.showCount ? template.count : undefined,
  })),
});

const toQuota = (quotaFormValues: QuotaFormValues): Quota => ({
  apiVersion: getApiVersion(clusterTemplateQuotaGVK),
  kind: clusterTemplateQuotaGVK.kind,
  metadata: {
    name: quotaFormValues.name,
    namespace: quotaFormValues.namespace,
  },
  spec: toQuotaSpec(quotaFormValues),
});

const useUpdateClusterTemplateCosts = (): [
  (allowedTemplates: AllowedTemplateFormValues[]) => Promise<void>,
  boolean,
  unknown,
] => {
  const [model, loading] = useK8sModel(clusterTemplateGVK);
  const [allClusterTemplates, loaded, error] = useClusterTemplates();
  const update = React.useCallback(
    async (formValues: AllowedTemplateFormValues[]) => {
      const promises = [];
      for (const allowedTemplate of formValues) {
        const clusterTemplate = allClusterTemplates.find(
          (template) => template.metadata?.name === allowedTemplate.template,
        );
        if (clusterTemplate === undefined) {
          promises.push(
            Promise.reject(
              new Error(`Failed to find cluster template ${allowedTemplate.template}`),
            ),
          );
        } else if (allowedTemplate.cost !== clusterTemplate.spec.cost && allowedTemplate.showCost) {
          const updatedClusterTemplate = {
            ...clusterTemplate,
            spec: { ...clusterTemplate.spec, cost: allowedTemplate.cost },
          };
          promises.push(k8sUpdate({ model: model, data: updatedClusterTemplate }));
        }
      }
      await Promise.all(promises);
    },
    [allClusterTemplates, model],
  );
  return [update, !loading && loaded, error];
};

const useSaveQuota = (
  originalQuota?: Quota,
): [(values: QuotaFormValues) => Promise<Quota>, boolean, unknown] => {
  const [quotasModel, loadingModel] = useK8sModel(clusterTemplateQuotaGVK);
  const [updateClusterTemplatesCosts, loaded, error] = useUpdateClusterTemplateCosts();
  const save = React.useCallback(
    async (values: QuotaFormValues) => {
      let quota: Quota;
      if (originalQuota) {
        const newQuota = { ...originalQuota, spec: toQuotaSpec(values) };
        quota = await k8sUpdate({ model: quotasModel, data: newQuota });
      } else {
        quota = await k8sCreate({ model: quotasModel, data: toQuota(values) });
      }
      await updateClusterTemplatesCosts(values.templates);
      return quota;
    },
    [originalQuota, quotasModel, updateClusterTemplatesCosts],
  );

  return [save, !loadingModel && loaded, error];
};

export default useSaveQuota;
