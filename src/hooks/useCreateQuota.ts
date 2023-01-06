import { k8sCreate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  clusterTemplateQuotaGVK,
  clusterTemplatesRoleRef,
  RBAC_API_GROUP,
  roleBindingGVK,
} from '../constants';
import { Quota, RoleBinding, Subject } from '../types';
import { getApiVersion } from '../utils/k8s';
import { NewQuotaFormikValues } from '../components/ClusterTemplateQuotas/types';
import { useCreateNamespace } from './useCreateNamespace';

const getQuota = (values: NewQuotaFormikValues): Quota => {
  return {
    apiVersion: getApiVersion(clusterTemplateQuotaGVK),
    kind: clusterTemplateQuotaGVK.kind,
    metadata: {
      name: values.name,
      namespace: values.namespace,
    },
    spec: {
      budget: values.hasBudget ? values.budget : undefined,
      allowedTemplates: [],
    },
  };
};

const getSubjects = (names: string[], kind: Subject['kind']): Subject[] =>
  names.map((name) => {
    return {
      kind,
      apiGroup: RBAC_API_GROUP,
      name: name,
    };
  });

const getRoleBinding = (namespace: string, users: string[], groups: string[]): RoleBinding => ({
  metadata: {
    generateName: 'cluster-templates-rb-',
    namespace,
  },
  subjects: [...getSubjects(users, 'User'), ...getSubjects(groups, 'Group')],
  roleRef: clusterTemplatesRoleRef,
});

const useCreateQuota = (): [(values: NewQuotaFormikValues) => Promise<Quota>, boolean] => {
  const [roleBindingModel, roleBindingModelLoading] = useK8sModel(roleBindingGVK);
  const [quotaModel, quotaModelLoading] = useK8sModel(clusterTemplateQuotaGVK);
  const [createNamespace, createNamespaceLoading] = useCreateNamespace();
  const createQuota = async (values: NewQuotaFormikValues): Promise<Quota> => {
    await createNamespace(values.namespace);
    if (values.users.length || values.groups.length) {
      await k8sCreate({
        data: getRoleBinding(values.namespace, values.users, values.groups),
        model: roleBindingModel,
      });
    }
    return await k8sCreate({ data: getQuota(values), model: quotaModel });
  };
  return [createQuota, !roleBindingModelLoading && !quotaModelLoading && !createNamespaceLoading];
};

export default useCreateQuota;
