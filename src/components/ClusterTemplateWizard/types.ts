import { SelectOptionObject } from '@patternfly/react-core';

export enum StepId {
  DETAILS = 'details',
  INSTALLATION = 'installation',
  POST_INSTALLATION = 'postInstallation',
  QUOTAS = 'quotas',
  REVIEW = 'review',
}

export type HelmFormikValues = {
  url: string;
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
  spec: HelmFormikValues;
};

export type WizardFormikValues = {
  details: DetailsFormikValues;
  quotas: QuotaFormikValues[];
  installation: InstallationFormikValues;
  postInstallation: HelmFormikValues[];
  isCreateFlow: boolean;
};
