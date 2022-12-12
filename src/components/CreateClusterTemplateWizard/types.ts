import { SelectOptionObject } from '@patternfly/react-core';

export enum StepId {
  DETAILS = 'details',
  INSTALLATION = 'installation',
  POST_INSTALLATION = 'postInstallation',
  QUOTAS = 'quotas',
  REVIEW = 'review',
}

export type ArgoCDSpecFormikValues = {
  repoURL: string;
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

export type WizardFormikValues = {
  details: DetailsFormikValues;
  quotas: QuotaFormikValues[];
  installation: ArgoCDSpecFormikValues;
  postInstallation: ArgoCDSpecFormikValues[];
};
