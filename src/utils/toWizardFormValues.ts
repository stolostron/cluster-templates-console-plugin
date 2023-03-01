import React from 'react';
import { CREATE_NAMESPACE_SYNC_OPTION, INSTANCE_NAMESPACE_VAR } from '../constants';
import { ApplicationSource, ArgoCDSpec, ClusterTemplate } from '../types/resourceTypes';
import {
  WizardFormikValues,
  InstallationFormikValues,
  HelmSourceFormikValues,
  PostInstallationFormikValues,
  GitRepoSourceFormikValues,
} from '../types/wizardFormTypes';

import { getClusterTemplateDescription } from './clusterTemplateDataUtils';

export const getNewHelmSourceFormValues = (): HelmSourceFormikValues => ({
  url: '',
  chart: '',
  version: '',
});

export const getNewGitOpsFormValues = (type: 'helm' | 'git'): PostInstallationFormikValues => ({
  destinationNamespace: '',
  autoSync: true,
  pruneResources: false,
  createNamespace: false,
  source:
    type === 'helm'
      ? getNewHelmSourceFormValues()
      : {
          url: '',
          commit: '',
          directory: '',
        },
});

export const getNewClusterTemplateFormValues = (): WizardFormikValues => {
  return {
    details: {
      name: '',
      labels: {},
    },
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
  createNamespace: spec.syncPolicy?.syncOptions
    ? spec.syncPolicy?.syncOptions.includes(CREATE_NAMESPACE_SYNC_OPTION)
    : false,
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

const getFormValues = (clusterTemplate: ClusterTemplate): WizardFormikValues => {
  return {
    details: {
      name: clusterTemplate.metadata?.name || '',
      description: getClusterTemplateDescription(clusterTemplate),
    },
    installation: getInstallationFormValues(clusterTemplate),
    postInstallation: getPostInstallationFormValues(clusterTemplate),
    isCreateFlow: false,
  };
};

export const useFormValues = (
  clusterTemplate?: ClusterTemplate,
): [WizardFormikValues | undefined, boolean] => {
  const [formValues, setFormValues] = React.useState<WizardFormikValues>();

  React.useEffect(() => {
    if (formValues) {
      //Initialize form values only once
      return;
    }
    if (!clusterTemplate) {
      setFormValues(getNewClusterTemplateFormValues());
    } else {
      setFormValues(getFormValues(clusterTemplate));
    }
  }, [clusterTemplate, formValues]);
  return [formValues, !!formValues];
};
