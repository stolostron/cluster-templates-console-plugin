import { K8sResourceCommon, ObjectMetadata } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';

export enum ClusterTemplateVendor {
  CUSTOM = 'Custom',
  REDHAT = 'RedHat',
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

export type ClusterTemplateStatus = {
  clusterDefinition: {
    values: string;
  };
  clusterSetup?: {
    name: string;
    values: string;
  }[];
};

export type ClusterSetup = {
  spec: ArgoCDSpec;
  name: string;
}[];

export type ClusterTemplate = K8sResourceCommon & {
  spec: {
    cost?: number;
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

export type ClusterTemplateInstancePropertyValue = {
  clusterSetup?: string;
  name: string;
  value: unknown;
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
  created: string;
  apiVersion: string;
  appVersion: string;
  description?: string;
  digest: string;
  type: string;
  urls: string[];
  version: string;
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
  title: React.ReactNode;
  id: string;
};
export type RowProps<D> = {
  obj: D;
};

export type MetadataLabels = ObjectMetadata['labels'];
