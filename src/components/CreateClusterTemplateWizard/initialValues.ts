import { WizardFormikValues, QuotaFormikValues, ArgoCDSpecFormikValues } from './types';

export const getArgoCDSpecFormikInitialValues = (): ArgoCDSpecFormikValues => ({
  repoURL: '',
  chart: '',
  version: '',
  destinationNamespace: '',
});

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
      cost: 200,
      name: '',
      argocdNamespace: '',
    },
    quotas: [getQuotaFormikInitialValues()],
    installation: getArgoCDSpecFormikInitialValues(),
    postInstallation: [getArgoCDSpecFormikInitialValues()],
  };
};
