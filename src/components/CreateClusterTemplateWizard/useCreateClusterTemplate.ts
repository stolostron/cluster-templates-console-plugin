import {
  k8sCreate,
  k8sGet,
  K8sModel,
  k8sUpdate,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { ClusterTemplate, Quota } from '../../types';
import { WizardFormikValues, QuotaFormikValues } from './types';
import { QuotasData, useQuotas } from '../../hooks/useQuotas';
import { clusterTemplateGVK, clusterTemplateQuotaGVK } from '../../constants';

export const getClusterTemplate = (values: WizardFormikValues): ClusterTemplate => {
  return {
    apiVersion: 'clustertemplate.openshift.io/v1alpha1',
    kind: 'ClusterTemplate',
    metadata: {
      name: values.details.name,
    },
    spec: {
      cost: values.details.cost,
      clusterDefinition: {
        source: {
          repoURL: values.details.helmRepo,
          chart: values.details.helmChart,
        },
      },
    },
  };
};

const getUpdatedQuotas = async (
  clusterTemplateName: string,
  quotaFormikValues: QuotaFormikValues[],
  quotasContext: QuotasData,
  quotasModel: K8sModel,
): Promise<Quota[]> => {
  const ret = [];
  for (const quotaFormValues of quotaFormikValues) {
    if (!quotaFormValues.quota) {
      throw 'No selected quota';
    }
    let quota = quotasContext.getQuota(quotaFormValues.quota.name, quotaFormValues.quota.namespace);
    if (!quota) {
      quota = await k8sGet({
        model: quotasModel,
        name: quotaFormValues.quota.name,
        ns: quotaFormValues.quota.namespace,
      });
    }
    const allowedTemplates = quota.spec?.allowedTemplates || [];
    allowedTemplates.push({
      name: clusterTemplateName,
      count: quotaFormValues.limitAllowed ? quotaFormValues.numAllowed : undefined,
    });
    const newQuota = {
      ...quota,
      spec: {
        ...quota.spec,
        allowedTemplates: allowedTemplates,
      },
    };
    ret.push(newQuota);
  }
  return ret;
};

export const updateQuotas = async (
  values: WizardFormikValues,
  quotasContext: QuotasData,
  quotaModel: K8sModel,
) => {
  const updatedQuotas = await getUpdatedQuotas(
    values.details.name || 'test',
    values.quotas,
    quotasContext,
    quotaModel,
  );
  const promises = updatedQuotas.map((quota) => k8sUpdate({ model: quotaModel, data: quota }));
  await Promise.all(promises);
};

export const useCreateClusterTemplate = (): [
  (values: WizardFormikValues) => Promise<void>,
  boolean,
] => {
  const [quotasData] = useQuotas();
  //Instead of handling loading and error, if a quota isn't found it'll be retreived using k8sGet
  const [clusterTemplateModel, clusterTemplateModelLoaded] = useK8sModel(clusterTemplateGVK);
  const [quotaModel, quotaModelLoaded] = useK8sModel(clusterTemplateQuotaGVK);

  const createClusterTemplate = async (values: WizardFormikValues) => {
    await k8sCreate({ model: clusterTemplateModel, data: getClusterTemplate(values) });
    await updateQuotas(values, quotasData, quotaModel);
  };
  return [createClusterTemplate, clusterTemplateModelLoaded && quotaModelLoaded];
};
