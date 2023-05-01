import React from 'react';
import { CREATE_NAMESPACE_SYNC_OPTION, INSTANCE_NAMESPACE_VAR } from '../constants';
import {
  ApplicationSource,
  ArgoCDSpec,
  DeserializedClusterTemplate,
  RepositoryType,
} from '../types/resourceTypes';
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

export const getNewGitOpsFormValues = (type: RepositoryType): PostInstallationFormikValues => ({
  autoSync: true,
  pruneResources: false,
  createNamespace: false,
  source:
    type === 'helm'
      ? getNewHelmSourceFormValues()
      : {
          url: '',
        },
  appSetName: '',
  type,
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
      appSetName: '',
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
  commit: source.targetRevision,
  directory: source.path,
});

const getPostInstallationFormValuesItem = (
  appSetName: string,
  spec: ArgoCDSpec,
): PostInstallationFormikValues => ({
  source: spec.source.chart
    ? getHelmRepoSourceFormValues(spec.source)
    : getGitRepoSourceFormValues(spec.source),
  autoSync: !!spec.syncPolicy?.automated,
  pruneResources: spec.syncPolicy?.automated?.prune ?? false,
  destinationNamespace: spec.destination.namespace,
  createNamespace: spec.syncPolicy?.syncOptions
    ? spec.syncPolicy?.syncOptions.includes(CREATE_NAMESPACE_SYNC_OPTION)
    : false,
  appSetName,
  type: spec.source.chart ? 'helm' : 'git',
});

const getPostInstallationFormValues = (
  clusterTemplate: DeserializedClusterTemplate,
): PostInstallationFormikValues[] => {
  if (clusterTemplate.spec.clusterSetup) {
    return clusterTemplate.spec.clusterSetup.map((setup) =>
      getPostInstallationFormValuesItem(setup.name, setup.spec),
    );
  } else {
    return [];
  }
};

const getInstallationFormValues = (
  clusterTemplate: DeserializedClusterTemplate,
): InstallationFormikValues => {
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
    appSetName: clusterTemplate.spec.clusterDefinitionName,
  };
};

const getFormValues = (clusterTemplate: DeserializedClusterTemplate): WizardFormikValues => {
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
  clusterTemplate?: DeserializedClusterTemplate,
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
