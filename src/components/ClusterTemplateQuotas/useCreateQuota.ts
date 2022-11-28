import { useK8sModel, k8sCreate, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK, namespaceGVK } from '../../constants';
import { ClusterTemplateQuota } from '../../types';
import { getApiVersion } from '../../utils/k8s';
import { useNamespaceContext } from '../CreateClusterTemplateWizard/Steps/ManageAccessStep/NamespaceContextProvider';

export type NewQuotaFormikValues = {
  name: string;
  namespace: string;
  access: string[];
  hasBudget: boolean;
  budget: number;
};

const getQuota = (values: NewQuotaFormikValues): ClusterTemplateQuota => {
  return {
    apiVersion: getApiVersion(clusterTemplateQuotaGVK),
    kind: clusterTemplateQuotaGVK.kind,
    metadata: {
      name: values.name,
      namespace: values.namespace,
    },
    spec: values.hasBudget ? { budget: values.budget } : undefined,
  };
};

const getNamespace = (name: string): K8sResourceCommon => {
  return {
    metadata: {
      name,
    },
  };
};

const useCreateQuota = (): {
  create: (values: NewQuotaFormikValues) => Promise<void>;
} => {
  const [quotaModel] = useK8sModel(clusterTemplateQuotaGVK);
  const [namespaceModel] = useK8sModel(namespaceGVK);
  const namespaces = useNamespaceContext();
  return {
    create: async (values: NewQuotaFormikValues) => {
      if (!namespaces.includes(values.namespace)) {
        await k8sCreate({
          data: getNamespace(values.namespace),
          model: namespaceModel,
        });
      }
      await k8sCreate({ data: getQuota(values), model: quotaModel });
    },
  };
};

export default useCreateQuota;
