import { SelectOptionObject } from '@patternfly/react-core';

export enum StepId {
  DETAILS = 'details',
  INSTALLATION = 'installation',
  POST_INSTALLATION = 'postInstallation',
  QUOTAS = 'quotas',
  REVIEW = 'review',
}

export interface RepoOptionObject extends SelectOptionObject {
  resourceName: string;
  url: string;
}

export type ArgoCDSpecFormikValues = {
  repo: RepoOptionObject;
  chart: string;
  version: string;
  destinationNamespace?: string;
};

export interface QuotaOptionObject extends SelectOptionObject {
  name: string;
  namespace: string;
}

export type QuotaFormikValues = {
  quota: QuotaOptionObject;
  numAllowed: number;
  limitAllowed: boolean;
};

export type DetailsFormikValues = {
  name: string;
  argocdNamespace: string;
  cost: number;
};

export type InstallationFormikValues = {
  useInstanceNamespace: boolean;
  spec: ArgoCDSpecFormikValues;
};

export type WizardFormikValues = {
  details: DetailsFormikValues;
  quotas: QuotaFormikValues[];
  installation: InstallationFormikValues;
  postInstallation: ArgoCDSpecFormikValues[];
  isCreateFlow: boolean;
};
