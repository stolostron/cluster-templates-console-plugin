import { SelectOptionObject } from '@patternfly/react-core';

export enum StepId {
  DETAILS = 'details',
  QUOTAS = 'quotas',
  REVIEW = 'review',
}
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
  helmRepo: string;
  helmChart: string;
  cost: number;
};

export type WizardFormikValues = {
  details: DetailsFormikValues;
  quotas: QuotaFormikValues[];
};
