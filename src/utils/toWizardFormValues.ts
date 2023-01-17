import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { clusterTemplateQuotaGVK, INSTANCE_NAMESPACE_VAR } from '../constants';
import { ArgoCDSecretData, ArgoCDSpec, ClusterTemplate, DecodedSecret, Quota } from '../types';
import {
  WizardFormikValues,
  QuotaFormikValues,
  RepoOptionObject,
  InstallationFormikValues,
  ArgoCDSpecFormikValues,
} from '../components/ClusterTemplateWizard/types';
import { sortByResourceName } from './utils';
import { useAlerts } from '../alerts/AlertsContext';
import { useTranslation } from '../hooks/useTranslation';
import { useArgoCDSecrets } from '../hooks/useArgoCDSecrets';

export const getRepoOptionObject = (
  argoCDSecret: DecodedSecret<ArgoCDSecretData>,
): RepoOptionObject => ({
  resourceName: argoCDSecret.metadata?.name,
  url: argoCDSecret.data?.url,
  toString: () => argoCDSecret.metadata?.name,
});

export const getEmptyRepoOptionObject = (): RepoOptionObject => ({
  resourceName: '',
  url: '',
  toString: () => '',
});

export const getNewArgoCDSpecFormValues = (): ArgoCDSpecFormikValues => ({
  chart: '',
  version: '',
  destinationNamespace: '',
  repo: getEmptyRepoOptionObject(),
});

export const getNewQuotaFormValues = (): QuotaFormikValues => ({
  numAllowed: 0,
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
      argocdNamespace: '',
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
  const [quotaFormValues, quotasLoaded, quotasError] = useQuotasStepFormValues(
    clusterTemplate?.metadata?.name,
  );
  const [argoCDSecrets, reposLoaded, reposError] = useArgoCDSecrets();
  const [formValues, setFormValues] = React.useState<WizardFormikValues>();
  const { t } = useTranslation();
  const { addAlert } = useAlerts();

  const getArgoCDSpecFormValues = (
    source: ArgoCDSpec['source'],
    destinationNamespace?: string,
  ): ArgoCDSpecFormikValues => {
    const argoCDSecret = argoCDSecrets.find((secret) => secret.data?.url === source.repoURL);
    if (!argoCDSecret) {
      addAlert({
        title: t(`Failed to find HelmChartRepository with url {{url}}`, {
          url: source.repoURL,
        }),
      });
    }
    return {
      repo: argoCDSecret ? getRepoOptionObject(argoCDSecret) : getEmptyRepoOptionObject(),
      chart: argoCDSecret ? source.chart : '',
      version: argoCDSecret ? source.targetRevision : '',
      destinationNamespace: destinationNamespace,
    };
  };

  const getPostInstallationFormValues = (
    clusterTemplate: ClusterTemplate,
  ): ArgoCDSpecFormikValues[] => {
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
        argocdNamespace: clusterTemplate.spec.argocdNamespace,
        cost: clusterTemplate.spec.cost,
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
    } else if (quotasLoaded && reposLoaded) {
      setFormValues(getFormValues());
    }
  }, [clusterTemplate, reposLoaded, quotasLoaded]);
  return [formValues, !!formValues || quotasError || reposError, quotasError || reposError];
};
