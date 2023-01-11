import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export enum ClusterTemplateVendor {
  CUSTOM = 'Custom',
  REDHAT = 'RedHat',
}

export type HelmChartRepository = K8sResourceCommon & {
  spec: {
    description?: string;
    disabled?: false;
    name?: string;
    connectionConfig: {
      url: string;
      tlsClientConfig?: { name: string };
      ca?: { name: string };
    };
  };
};

export type ClusterTemplateProperty = {
  description: string;
  name: string;
  overwritable: boolean;
  type?: string;
  defaultValue?: string;
  secretRef?: {
    name: string;
    namespace: string;
  };
};

export type ApplicationSource = {
  repoURL: string;
  chart?: string;
  targetRevision?: string;
};

export type ArgoCDSpec = {
  source: ApplicationSource;
  destination: {
    namespace?: string;
    server: 'https://kubernetes.default.svc';
  };
  project: 'default';
};

export type ClusterTemplate = K8sResourceCommon & {
  spec: {
    cost: number;
    clusterDefinition: ArgoCDSpec;
    clusterSetup?: {
      spec: ArgoCDSpec;
      name: string;
    }[];
    argocdNamespace: string;
  };
};

export enum ConditionType {
  InstallSucceeded = 'InstallSucceeded',
  SetupSucceeded = 'SetupSucceeded',
  Ready = 'Ready',
}

export enum ConditionStatus {
  True = 'True',
  False = 'False',
}

export enum ClusterTemplateInstanceStatusPhase {
  PendingPhase = 'PendingPhase',
  PendingMessage = 'PendingMessage',
  HelmChartInstallFailed = 'HelmChartInstallFailed',
  ClusterInstalling = 'ClusterInstalling',
  ClusterInstallFailed = 'ClusterInstallFailed',
  ClusterSetupCreating = 'ClusterSetupCreating',
  ClusterSetupCreateFailed = 'ClusterSetupCreateFailed',
  ClusterSetupRunning = 'ClusterSetupRunning',
  ClusterSetupFailed = 'ClusterSetupFailed',
  Ready = 'Ready',
  CredentialsFailed = 'CredentialsFailed',
  Failed = 'Failed',
}

export type ClusterTemplateInstancePropertyValue = {
  clusterSetup?: string;
  name: string;
  value: string;
};

export type ClusterTemplateInstance = K8sResourceCommon & {
  spec: {
    clusterTemplateRef: string;
    values?: ClusterTemplateInstancePropertyValue[];
  };
  status?: {
    phase?: ClusterTemplateInstanceStatusPhase;
    message?: string;
  };
};

export type HelmRepoIndexChartEntry = {
  annotations?: { [key in string]: string };
  name: string;
  created: string;
  apiVersion: string;
  appVersion: string;
  description?: string;
  digest: string;
  type: string;
  urls: string[];
  version: string;
};

export type HelmRepoIndex = {
  apiVersion: string;
  entries: {
    [key: string]: HelmRepoIndexChartEntry[];
  };
  generated: string;
};

export type Quota = K8sResourceCommon & {
  spec?: {
    budget?: number;
    allowedTemplates: {
      name: string;
      count: number;
    }[];
  };
  status?: {
    budgetSpent: number;
    templateInstances: {
      name: string;
      count?: number;
    }[];
  };
};

export type Secret = K8sResourceCommon & {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
};

export type DecodedSecret<DecodedDataType> = Omit<Secret, 'data'> & {
  data?: DecodedDataType;
};

export type ArgoCDSecretData = {
  name?: string;
  url?: string;
  description?: string;
  username?: string;
  password?: string;
  project?: string;
  tlsClientCertData?: string;
  tlsClientCertKey?: string;
  type?: 'helm' | 'git';
  insecure?: boolean;
};

export type ConfigMap = {
  data?: { [key: string]: string };
} & K8sResourceCommon;

export type TableColumn = {
  title: string;
  id: string;
};
export type RowProps<D> = {
  obj: D;
};

export type RoleRef = { apiGroup: string; kind: string; name: string };

export type Subject = {
  kind: 'User' | 'Group';
  apiGroup: 'rbac.authorization.k8s.io';
  name: string;
};

export type RoleBinding = K8sResourceCommon & {
  subjects?: Subject[];
  roleRef: RoleRef;
};

export type QuotaDetails = {
  name: string;
  namespace: string;
  budget?: number;
  budgetSpent?: number;
  numUsers: number;
  numGroups: number;
  uid: string;
};

export type Group = K8sResourceCommon & { users?: string[] };
export type User = K8sResourceCommon;

export type ApiError = {
  code: number;
  message: string;
  json: {
    reason: string;
  };
};

export const isApiError = (err: unknown): err is ApiError => {
  return typeof err === 'object' && typeof err['json'] === 'object';
};
