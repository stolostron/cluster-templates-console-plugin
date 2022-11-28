import { WizardFormikValues, AccessFormikValues } from './formikTypes';

export const getAccessFormikInitialValues = (): AccessFormikValues => ({
  name: '',
  numAllowed: 0,
  limitAllowed: false,
});

export const getFormikInitialValues = (): WizardFormikValues => {
  return {
    name: '',
    helmRepo: '',
    helmChart: '',
    cost: 1,
    quotas: [getAccessFormikInitialValues()],
    pipelines: [],
  };
};
