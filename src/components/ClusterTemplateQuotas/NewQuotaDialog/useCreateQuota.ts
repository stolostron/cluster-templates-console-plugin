import { k8sCreate, K8sResourceCommon, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  clusterTemplateQuotaGVK,
  clusterTemplatesRoleRef,
  namespaceGVK,
  RBAC_API_GROUP,
  roleBindingGVK,
} from '../../../constants';
import { useNamespaces } from '../../../hooks/useNamespaces';
import { Quota, RoleBinding, Subject } from '../../../types';
import { getApiVersion } from '../../../utils/k8s';
import { NewQuotaFormikValues } from '../types';

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

const getNamespace = (name: string): K8sResourceCommon => {
  return {
    apiVersion: namespaceGVK.version,
    kind: namespaceGVK.kind,
    metadata: {
      name,
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

const useCreateQuota = (): [(values: NewQuotaFormikValues) => Promise<Quota>, boolean, unknown] => {
  const [roleBindingModel, roleBindingModelLoading] = useK8sModel(roleBindingGVK);
  const [nsModel, nsModelLoading] = useK8sModel(namespaceGVK);
  const [quotaModel, quotaModelLoading] = useK8sModel(clusterTemplateQuotaGVK);
  const [namespaces, namespacesLoaded, namespacesError] = useNamespaces();
  const createQuota = async (values: NewQuotaFormikValues): Promise<Quota> => {
    if (!namespaces.includes(values.namespace)) {
      await k8sCreate({
        data: getNamespace(values.namespace),
        model: nsModel,
      });
    }
    if (values.users.length || values.groups.length) {
      await k8sCreate({
        data: getRoleBinding(values.namespace, values.users, values.groups),
        model: roleBindingModel,
      });
    }
    return await k8sCreate({ data: getQuota(values), model: quotaModel });
  };
  return [
    createQuota,
    !roleBindingModelLoading && !quotaModelLoading && !nsModelLoading && namespacesLoaded,
    namespacesError,
  ];
};

export default useCreateQuota;
