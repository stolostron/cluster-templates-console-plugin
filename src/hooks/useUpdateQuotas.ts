import { useK8sModel, K8sModel, Patch, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { differenceWith } from 'lodash';
import { WizardFormikValues, QuotaFormikValues } from '../components/ClusterTemplateWizard/types';
import { clusterTemplateQuotaGVK } from '../constants';
import { Quota } from '../types';
import { getErrorMessage } from '../utils/utils';
import { useQuotas } from './useQuotas';

const useUpdateQuotas = (
  initialValues: WizardFormikValues,
): [(values: WizardFormikValues) => Promise<void>, boolean] => {
  /*
  Quotas loading and error are not handled here:
  1. If a quota wasn't loaded, k8sGet will be used to fetch it.
     This must be done because there can be quotas that were created but not sent in the socket yet
  2. To avoid handling quotas loading state in the wizard */
  const [quotasData] = useQuotas();
  const [quotasModel, loading] = useK8sModel(clusterTemplateQuotaGVK);

  const getPatchValue = async (
    clusterTemplateName: string,
    quotaFormValues: QuotaFormikValues,
    isRemove: boolean,
  ): Promise<{ model: K8sModel; resource: Quota; data: Patch[] }> => {
    let quota;
    try {
      quota = await quotasData.getQuota(
        quotaFormValues.quota.name,
        quotaFormValues.quota.namespace,
      );
    } catch (err) {
      if (isRemove) {
        return undefined;
      } else {
        throw err;
      }
    }
    const countValue = quotaFormValues.limitAllowed ? quotaFormValues.numAllowed : undefined;
    const allowedTemplates = quota.spec?.allowedTemplates || [];
    const curTemplateIndex = allowedTemplates.findIndex(
      (templateData) => templateData.name === clusterTemplateName,
    );
    //handle three cases: remove template from quota, update template in quota and add template to quota
    if (isRemove && curTemplateIndex > -1) {
      allowedTemplates.splice(curTemplateIndex, 1);
    } else if (curTemplateIndex > -1 && allowedTemplates[curTemplateIndex].count !== countValue) {
      allowedTemplates[curTemplateIndex].count = countValue;
    } else if (!isRemove && curTemplateIndex === -1) {
      allowedTemplates.push({
        name: clusterTemplateName,
        count: countValue,
      });
    } else {
      return undefined;
    }
    const patchData: Patch = {
      op: 'replace',
      value: allowedTemplates,
      path: '/spec/allowedTemplates',
    };
    return { resource: quota, model: quotasModel, data: [patchData] };
  };

  const updateQuotas = async (values: WizardFormikValues) => {
    const promises = [];
    const toRemove = differenceWith(
      initialValues.quotas,
      values.quotas,
      (quota1, quota2) =>
        quota1.quota.name === quota2.quota.name &&
        quota1.quota.namespace === quota2.quota.namespace,
    );
    try {
      for (const quotaValues of toRemove) {
        promises.push(getPatchValue(values.details.name, quotaValues, true));
      }
      for (const quotaValues of values.quotas) {
        promises.push(getPatchValue(values.details.name, quotaValues, false));
      }
    } catch (err) {
      throw new Error(`Failed to update quotas: ${getErrorMessage(err)}`);
    }
    const patches = await Promise.all(promises);
    for (const patch of patches) {
      if (patch) {
        await k8sPatch(patch);
      }
    }
  };

  return [updateQuotas, loading];
};

export default useUpdateQuotas;
