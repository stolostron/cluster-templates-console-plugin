import { SelectOptionObject } from '@patternfly/react-core';

export enum StepId {
  DETAILS = 'details',
  INSTALLATION = 'installation',
  POST_INSTALLATION = 'postInstallation',
  QUOTAS = 'quotas',
  REVIEW = 'review',
}

export type HelmSourceFormikValues = {
  url: string;
  chart: string;
  version: string;
};

export type GitRepoSourceFormikValues = {
  url: string;
  commit: string;
  directory: string;
};

export interface QuotaOptionObject extends SelectOptionObject {
  name: string;
  namespace: string;
}

export type QuotaFormikValues = {
  quota: QuotaOptionObject;
  limitAllowed: boolean;
  numAllowed?: number;
};

export type DetailsFormikValues = {
  name: string;
  cost: number;
  description?: string;
};

export type InstallationFormikValues = {
  useInstanceNamespace: boolean;
  source: HelmSourceFormikValues;
  destinationNamespace?: string;
};

export type PostInstallationFormikValues = {
  autoSync: boolean;
  pruneResources: boolean;
  destinationNamespace?: string;
  source: GitRepoSourceFormikValues | HelmSourceFormikValues;
};

export const isHelmSource = (
  source: GitRepoSourceFormikValues | HelmSourceFormikValues,
): source is HelmSourceFormikValues => (source as HelmSourceFormikValues).chart !== undefined;

export type WizardFormikValues = {
  details: DetailsFormikValues;
  quotas: QuotaFormikValues[];
  installation: InstallationFormikValues;
  postInstallation: PostInstallationFormikValues[];
  isCreateFlow: boolean;
};
