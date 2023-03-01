export type AllowedTemplateFormValues = {
  template: string;
  cost?: number;
  count?: number;
  showCost: boolean;
  showCount: boolean;
};

export type QuotaFormValues = {
  name: string;
  namespace: string;
  limitByBudget: boolean;
  budget?: number;
  templates: AllowedTemplateFormValues[];
  isCreateFlow: boolean;
};
