import { k8sCreate, K8sModel, k8sUpdate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK, clusterTemplateQuotaGVK } from '../../constants';
import { ClusterTemplate, ClusterTemplateQuota } from '../../types';
import { WizardFormikValues, AccessFormikValues } from './formikTypes';
import { useAccessContext } from './Steps/ManageAccessStep/AccessContextProvider';

export const getClusterTemplate = (values: WizardFormikValues): ClusterTemplate => {
  return {
    apiVersion: 'clustertemplate.openshift.io/v1alpha1',
    kind: 'ClusterTemplate',
    metadata: {
      name: values.name,
    },
    spec: {
      cost: values.cost,
      clusterDefinition: {
        source: {
          repoURL: values.helmRepo,
          chart: values.helmChart,
        },
      },
    },
  };
};

const getUpdatedQuotas = (
  clusterTemplateName: string,
  accessFormikValues: AccessFormikValues[],
  allQuotas: ClusterTemplateQuota[],
): ClusterTemplateQuota[] => {
  const ret = [];
  for (const access of accessFormikValues) {
    const quota = allQuotas.find((quota) => quota.metadata?.name === access.name);
    if (!quota) {
      throw new Error(`Failed to find quota ${access.name}`);
    }
    const allowedTemplates = quota.spec?.allowedTemplates || [];
    allowedTemplates.push({
      name: clusterTemplateName,
      count: access.limitAllowed ? access.numAllowed : undefined,
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
  allQuotas: ClusterTemplateQuota[],
  quotaModel: K8sModel,
) => {
  const updatedQuotas = getUpdatedQuotas(values.name || 'test', values.quotas, allQuotas);
  const promises = updatedQuotas.map((quota) => k8sUpdate({ model: quotaModel, data: quota }));
  await Promise.all(promises);
};

export const useCreateClusterTemplate = () => {
  const allQuotas = useAccessContext();
  const [model] = useK8sModel(clusterTemplateGVK);
  const [quotasModel] = useK8sModel(clusterTemplateQuotaGVK);
  return {
    createClusterTemplate: async (values: WizardFormikValues) => {
      await k8sCreate({ model, data: getClusterTemplate(values) });
      await updateQuotas(values, allQuotas, quotasModel);
    },
  };
};
