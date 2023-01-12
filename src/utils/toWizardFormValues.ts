import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { clusterTemplateQuotaGVK, INSTANCE_NAMESPACE_VAR } from '../constants';
import { ArgoCDSpec, ClusterTemplate, Quota } from '../types';
import {
  WizardFormikValues,
  QuotaFormikValues,
  InstallationFormikValues,
  HelmFormikValues,
} from '../components/ClusterTemplateWizard/types';
import { sortByResourceName } from './utils';

import { getClusterTemplateDescription } from './clusterTemplateDataUtils';

export const getNewArgoCDSpecFormValues = (): HelmFormikValues => ({
  chart: '',
  version: '',
  destinationNamespace: '',
  url: '',
});

export const getNewQuotaFormValues = (): QuotaFormikValues => ({
  limitAllowed: false,
  quota: {
    name: '',
    namespace: '',
    toString: () => '',
  },
});

export const getNewClusterTemplateFormValues = (): WizardFormikValues => {
  return {
    details: {
      cost: 200,
      name: '',
    },
    quotas: [getNewQuotaFormValues()],
    installation: { spec: getNewArgoCDSpecFormValues(), useInstanceNamespace: false },
    postInstallation: [],
    isCreateFlow: true,
  };
};
const useQuotasStepFormValues = (
  clusterTemplateName?: string,
): [QuotaFormikValues[], boolean, unknown] => {
  const [allQuotas, quotasLoaded, quotasError] = useK8sWatchResource<Quota[]>({
    groupVersionKind: clusterTemplateQuotaGVK,
    isList: true,
    namespaced: true,
  });
  const [formValues, setFormValues] = React.useState<QuotaFormikValues[]>();

  const getQuotasFormValues = (): QuotaFormikValues[] => {
    const ret: QuotaFormikValues[] = [];
    for (const quota of sortByResourceName(allQuotas)) {
      if (!quota.spec?.allowedTemplates) {
        continue;
      }
      for (const { name, count } of quota.spec.allowedTemplates) {
        if (name === clusterTemplateName) {
          ret.push({
            quota: {
              name: quota.metadata?.name,
              namespace: quota.metadata?.namespace,
              toString: () => quota.metadata?.name,
            },
            limitAllowed: !!count,
            numAllowed: count,
          });
        }
      }
    }
    if (ret.length === 0) {
      return [getNewQuotaFormValues()];
    }
    return ret;
  };
  React.useEffect(() => {
    if (formValues || !quotasLoaded || quotasError) {
      return;
    }
    setFormValues(getQuotasFormValues());
  }, [allQuotas, quotasLoaded, quotasError]);

  return [formValues, quotasLoaded && !!formValues, quotasError];
};

export const useFormValues = (
  clusterTemplate?: ClusterTemplate,
): [WizardFormikValues, boolean, unknown] => {
  //TODO: enable localization of alerts with parameters
  const [quotaFormValues, quotasLoaded, quotasError] = useQuotasStepFormValues(
    clusterTemplate?.metadata?.name,
  );
  const [formValues, setFormValues] = React.useState<WizardFormikValues>();

  const getArgoCDSpecFormValues = (
    source: ArgoCDSpec['source'],
    destinationNamespace?: string,
  ): HelmFormikValues => {
    return {
      url: source.repoURL,
      chart: source.chart,
      version: source.targetRevision,
      destinationNamespace,
    };
  };

  const getPostInstallationFormValues = (clusterTemplate: ClusterTemplate): HelmFormikValues[] => {
    if (clusterTemplate.spec.clusterSetup) {
      return clusterTemplate.spec.clusterSetup.map((setup) =>
        getArgoCDSpecFormValues(setup.spec.source, setup.spec.destination.namespace),
      );
    }
    return [];
  };

  const getInstallationFormValues = (): InstallationFormikValues => {
    const installationSettings = clusterTemplate.spec.clusterDefinition;
    const useInstanceNamespace =
      installationSettings.destination.namespace === INSTANCE_NAMESPACE_VAR;
    const destinationNamespace = useInstanceNamespace
      ? undefined
      : installationSettings.destination.namespace;
    return {
      useInstanceNamespace,
      spec: getArgoCDSpecFormValues(installationSettings.source, destinationNamespace),
    };
  };

  const getFormValues = (): WizardFormikValues => {
    return {
      details: {
        name: clusterTemplate.metadata?.name,
        cost: clusterTemplate.spec.cost,
        description: getClusterTemplateDescription(clusterTemplate),
      },
      installation: getInstallationFormValues(),
      postInstallation: getPostInstallationFormValues(clusterTemplate),
      quotas: quotaFormValues,
      isCreateFlow: false,
    };
  };

  React.useEffect(() => {
    if (formValues) {
      //Initialize form values only once
      return;
    }
    if (!clusterTemplate) {
      setFormValues(getNewClusterTemplateFormValues());
    } else if (quotasLoaded) {
      setFormValues(getFormValues());
    }
  }, [clusterTemplate, quotasLoaded]);
  return [formValues, !!formValues || !!quotasError, quotasError];
};
