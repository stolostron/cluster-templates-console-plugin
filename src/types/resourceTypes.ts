import React from 'react';

//duplicate this type from sdk to enable creating a story of a component using this type without bundlign the SDK
export type ObjectMetadata = {
  annotations?: {
    [key: string]: string;
  };
  clusterName?: string;
  creationTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  deletionTimestamp?: string;
  finalizers?: string[];
  generateName?: string;
  generation?: number;
  labels?: {
    [key: string]: string;
  };
  managedFields?: unknown[];
  name?: string;
  namespace?: string;
  resourceVersion?: string;
  uid?: string;
};

export type K8sResourceCommon = {
  apiVersion?: string;
  kind?: string;
  metadata?: ObjectMetadata;
};

export enum ClusterTemplateVendor {
  CUSTOM = 'Custom',
  COMMUNITY = 'community',
}

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
  path?: string;
};

export type ArgoCDSpec = {
  source: ApplicationSource;
  destination: {
    namespace?: string;
    server: string;
  };
  project: string;
  syncPolicy?: {
    automated?: {
      prune?: boolean;
    };
    syncOptions?: string[];
  };
};

export type HelmChartProperty = {
  type: string;
};

export type HelmChartSchema = {
  required: string[];
  properties: {
    [propName: string]: HelmChartProperty;
  };
};

export type ClusterTemplateSetupStatus = {
  name: string;
  values?: string;
  schema?: string;
}[];

export type ClusterTemplateStatus = {
  clusterDefinition?: {
    values?: string;
    schema?: string;
  };
  clusterSetup?: ClusterTemplateSetupStatus;
  error?: string;
  errorInstructions?: string;
};

export type ClusterSetup = {
  spec: ArgoCDSpec;
  name: string;
}[];

export type DeserializedClusterTemplate = K8sResourceCommon & {
  spec: {
    cost?: number;
    clusterDefinitionName: string;
    clusterDefinition: ArgoCDSpec;
    clusterSetup?: ClusterSetup;
  };
  status?: ClusterTemplateStatus;
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

export type ClusterTemplateInstanceParameter = {
  clusterSetup?: string;
  name: string;
  value: unknown;
};

export type ClusterTemplateInstance = K8sResourceCommon & {
  spec: {
    clusterTemplateRef: string;
    parameters?: ClusterTemplateInstanceParameter[];
  };
  status?: {
    phase?: ClusterTemplateInstanceStatusPhase;
    message?: string;
    apiServerURL?: string;
    adminPassword?: {
      name: string;
    };
  };
};

export type HelmRepoIndexChartEntry = {
  annotations?: { [key in string]: string };
  created: string;
  apiVersion: string;
  appVersion?: string;
  description?: string;
  digest: string;
  type: string;
  urls: string[];
  version: string;
  name?: string;
};

export type HelmRepositoryChartEntries = { [key: string]: HelmRepoIndexChartEntry[] };

export type HelmRepoIndex = {
  apiVersion: string;
  entries: HelmRepositoryChartEntries;
  generated: string;
};

export type HelmRepository = {
  name: string;
  url: string;
  index?: HelmRepoIndex;
  error?: string;
};

export type GitRepositoryEntries = {
  blablabla: string[];
};

export type GitRepoIndex = {
  apiVersion: string;
  entries: HelmRepositoryChartEntries;
  generated: string;
};

export type GitRepository = {
  url: string;
  branches?: string[];
  tags?: string[];
  error?: string;
};

export const isHelmRepository = (
  repository: GitRepository | HelmRepository,
): repository is HelmRepository => !!(repository as HelmRepository).index;

export type QuotaAllowedTemplate = {
  name: string;
  count?: number;
};

export type Quota = K8sResourceCommon & {
  spec?: {
    budget?: number;
    allowedTemplates: QuotaAllowedTemplate[];
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
  data: DecodedDataType;
};

export type RepositoryType = 'helm' | 'git';

export type ArgoCDSecretData = {
  name?: string;
  url?: string;
  description?: string;
  username?: string;
  password?: string;
  project?: string;
  type?: RepositoryType;
  insecure?: string;
};

export type ConfigMap = {
  data?: { [key: string]: string };
} & K8sResourceCommon;

export type TableColumn = {
  title: React.ReactNode;
  id: string;
};

export type RowProps<D> = {
  obj: D;
};

export type MetadataLabels = ObjectMetadata['labels'];

export type ApplicationSet = K8sResourceCommon & {
  spec: {
    generators: [Record<string, unknown>];
    template: {
      metadata: ObjectMetadata;
      spec: ArgoCDSpec;
    };
  };
};

export type ClusterTemplate = K8sResourceCommon & {
  spec: {
    cost?: number;
    clusterDefinition: string;
    clusterSetup: string[];
  };
  status?: ClusterTemplateStatus;
};

export type ClaasConfig = K8sResourceCommon & {
  spec?: {
    argoCDNamespace: string;
  };
};
