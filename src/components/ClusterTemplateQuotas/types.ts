export type NewQuotaFormikValues = {
  name: string;
  namespace: string;
  users: string[];
  groups: string[];
  hasBudget: boolean;
  budget?: number;
};
