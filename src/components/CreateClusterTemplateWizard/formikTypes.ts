export type AccessFormikValues = {
  name: string;
  numAllowed: number;
  limitAllowed: boolean;
};

export type WizardFormikValues = {
  name: string;
  helmRepo: string;
  helmChart: string;
  cost: number;
  quotas: AccessFormikValues[];
  pipelines: string[];
};
