import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

export const TEMPLATES_HELM_REPO_LABEL = 'clustertemplates.openshift.io/helm-repo';

export const CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX = 'clustertemplateinstance.openshift.io';

export const clusterTemplateVersion = 'v1alpha1';
export const clusterTemplateGroup = 'clustertemplate.openshift.io';
export const INSTANCE_NAMESPACE_VAR = '{{ instance_ns }}';
export const ARGOCD_SECRET_LABELS = {
  'argocd.argoproj.io/secret-type': 'repository',
};

export const helmRepoGVK: K8sGroupVersionKind = {
  kind: 'HelmChartRepository',
  version: 'v1beta1',
  group: 'helm.openshift.io',
};

export const clusterTemplateGVK: K8sGroupVersionKind = {
  kind: 'ClusterTemplate',
  version: clusterTemplateVersion,
  group: 'clustertemplate.openshift.io',
};

export const clusterTemplateQuotaGVK: K8sGroupVersionKind = {
  kind: 'ClusterTemplateQuota',
  version: clusterTemplateVersion,
  group: clusterTemplateGroup,
};

export const clusterTemplateInstanceGVK: K8sGroupVersionKind = {
  kind: 'ClusterTemplateInstance',
  version: clusterTemplateVersion,
  group: 'clustertemplate.openshift.io',
};

export const pipelineGVK: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'Pipeline',
};

export const roleBindingGVK: K8sGroupVersionKind = {
  group: 'rbac.authorization.k8s.io',
  kind: 'RoleBinding',
  version: 'v1',
};
export const clusterRoleBindingGVK: K8sGroupVersionKind = {
  group: 'rbac.authorization.k8s.io',
  kind: 'ClusterRoleBinding',
  version: 'v1',
};

export const namespaceGVK: K8sGroupVersionKind = {
  kind: 'Namespace',
  version: 'v1',
};

export const secretGVK: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'Secret',
};

export const configMapGVK: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'ConfigMap',
};

export const configGVK: K8sGroupVersionKind = {
  version: 'v1alpha1',
  group: 'clustertemplate.openshift.io',
  kind: 'Config',
};

export const groupGVK: K8sGroupVersionKind = {
  kind: 'Group',
  version: 'v1',
  group: 'user.openshift.io',
};

export const userGVK: K8sGroupVersionKind = {
  kind: 'User',
  version: 'v1',
  group: 'user.openshift.io',
};

export const CLUSTER_TEMPLATES_ROLE = 'cluster-templates-user';
export const CLUSTER_TEMPLATES_CLUSTER_ROLE = 'cluster-templates-user-ct';

export const RBAC_API_GROUP = 'rbac.authorization.k8s.io';

export const clusterRoleGVK: K8sGroupVersionKind = {
  group: RBAC_API_GROUP,
  kind: 'ClusterRole',
  version: 'v1',
};

export const applicationSetGVK: K8sGroupVersionKind = {
  group: 'argoproj.io',
  kind: 'ApplicationSet',
  version: 'v1alpha1',
};

export const quickStartGVK: K8sGroupVersionKind = {
  group: 'console.openshift.io',
  version: 'v1',
  kind: 'ConsoleQuickStart',
};

export const managedClusterGVK: K8sGroupVersionKind = {
  group: 'cluster.open-cluster-management.io',
  version: 'v1',
  kind: 'ManagedCluster',
};

export const applicationGVK: K8sGroupVersionKind = {
  group: 'argoproj.io',
  kind: 'Application',
  version: 'v1alpha1',
};

export const CREATE_NAMESPACE_SYNC_OPTION = 'CreateNamespace=true';

export const REPOSITORIES_URL = '/api/proxy/plugin/clustertemplates-plugin/repositories/api';
