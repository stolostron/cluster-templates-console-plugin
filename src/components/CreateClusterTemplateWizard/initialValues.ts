import { WizardFormikValues, QuotaFormikValues } from './types';

export const getQuotaFormikInitialValues = (): QuotaFormikValues => ({
  numAllowed: 0,
  limitAllowed: false,
  quota: {
    name: '',
    namespace: '',
    toString: () => '',
  },
});

export const getFormikInitialValues = (): WizardFormikValues => {
  return {
    details: {
      name: '',
      helmRepo: '',
      helmChart: '',
      cost: 200,
    },
    quotas: [getQuotaFormikInitialValues()],
  };
};
