import React from 'react';
import { clusterTemplateQuotaGVK, INSTANCE_NAMESPACE_VAR } from '../constants';
import { ApplicationSource, ArgoCDSpec, ClusterTemplate, Quota } from '../types';
import {
  WizardFormikValues,
  QuotaFormikValues,
  InstallationFormikValues,
  HelmSourceFormikValues,
  PostInstallationFormikValues,
  GitRepoSourceFormikValues,
} from '../components/ClusterTemplateWizard/types';
import { sortByResourceName } from './utils';

import { getClusterTemplateDescription } from './clusterTemplateDataUtils';
import { useK8sWatchResource } from '../hooks/k8s';

export const getNewHelmSourceFormValues = (): HelmSourceFormikValues => ({
  url: '',
  chart: '',
  version: '',
});

export const getNewGitOpsFormValues = (type: 'helm' | 'git'): PostInstallationFormikValues => ({
  destinationNamespace: '',
  autoSync: true,
  pruneResources: false,
  source:
    type === 'helm'
      ? getNewHelmSourceFormValues()
      : {
          url: '',
          commit: '',
          directory: '',
        },
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
    installation: {
      useInstanceNamespace: true,
      destinationNamespace: '',
      source: getNewHelmSourceFormValues(),
    },
    postInstallation: [],
    isCreateFlow: true,
  };
};

const getHelmRepoSourceFormValues = (source: ApplicationSource): HelmSourceFormikValues => ({
  url: source.repoURL,
  chart: source.chart || '',
  version: source.targetRevision || '',
});

const getGitRepoSourceFormValues = (source: ApplicationSource): GitRepoSourceFormikValues => ({
  url: source.repoURL,
  commit: source.targetRevision || '',
  directory: source.path || '',
});

const getPostInstallationFormValuesItem = (spec: ArgoCDSpec): PostInstallationFormikValues => ({
  source: spec.source.chart
    ? getHelmRepoSourceFormValues(spec.source)
    : getGitRepoSourceFormValues(spec.source),
  autoSync: !!spec.syncPolicy?.automated,
  pruneResources: spec.syncPolicy?.automated?.prune ?? false,
  destinationNamespace: spec.destination.namespace,
});

const getPostInstallationFormValues = (
  clusterTemplate: ClusterTemplate,
): PostInstallationFormikValues[] => {
  if (clusterTemplate.spec.clusterSetup) {
    return clusterTemplate.spec.clusterSetup.map((setup) =>
      getPostInstallationFormValuesItem(setup.spec),
    );
  } else {
    return [];
  }
};

const getInstallationFormValues = (clusterTemplate: ClusterTemplate): InstallationFormikValues => {
  const installationSettings = clusterTemplate.spec.clusterDefinition;
  const useInstanceNamespace =
    installationSettings.destination.namespace === INSTANCE_NAMESPACE_VAR;
  const destinationNamespace = useInstanceNamespace
    ? undefined
    : installationSettings.destination.namespace;
  return {
    useInstanceNamespace,
    source: getHelmRepoSourceFormValues(installationSettings.source),
    destinationNamespace,
  };
};

const getFormValues = (
  clusterTemplate: ClusterTemplate,
  quotaFormValues: QuotaFormikValues[],
): WizardFormikValues => {
  return {
    details: {
      name: clusterTemplate.metadata?.name || '',
      cost: clusterTemplate.spec.cost,
      description: getClusterTemplateDescription(clusterTemplate),
    },
    installation: getInstallationFormValues(clusterTemplate),
    postInstallation: getPostInstallationFormValues(clusterTemplate),
    quotas: quotaFormValues,
    isCreateFlow: false,
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

  React.useEffect(() => {
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
                name: quota.metadata?.name || '',
                namespace: quota.metadata?.namespace || '',
                toString: () => quota.metadata?.name || '',
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

    if (formValues || !quotasLoaded || quotasError) {
      return;
    }
    setFormValues(getQuotasFormValues());
  }, [allQuotas, quotasLoaded, quotasError, formValues, clusterTemplateName]);

  return [formValues || [], quotasLoaded && !!formValues, quotasError];
};
export const useFormValues = (
  clusterTemplate?: ClusterTemplate,
): [WizardFormikValues | undefined, boolean, unknown] => {
  //TODO: enable localization of alerts with parameters
  const [quotaFormValues, quotasLoaded, quotasError] = useQuotasStepFormValues(
    clusterTemplate?.metadata?.name,
  );
  const [formValues, setFormValues] = React.useState<WizardFormikValues>();

  React.useEffect(() => {
    if (formValues) {
      //Initialize form values only once
      return;
    }
    if (!clusterTemplate) {
      setFormValues(getNewClusterTemplateFormValues());
    } else if (quotasLoaded) {
      setFormValues(getFormValues(clusterTemplate, quotaFormValues));
    }
  }, [clusterTemplate, quotasLoaded]);
  return [formValues, !!formValues || !!quotasError, quotasError];
};
