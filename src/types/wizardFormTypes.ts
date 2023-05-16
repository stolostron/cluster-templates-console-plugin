import { MetadataLabels, RepositoryType } from './resourceTypes';

export enum StepId {
  DETAILS = 'details',
  INSTALLATION = 'installation',
  POST_INSTALLATION = 'postInstallation',
  REVIEW = 'review',
}

export type HelmSourceFormikValues = {
  url: string;
  chart: string;
  version: string;
};

export type GitRepoSourceFormikValues = {
  url: string;
  commit?: string;
  directory?: string;
};

export type DetailsFormikValues = {
  name: string;
  description?: string;
  labels?: MetadataLabels;
};

export type InstallationFormikValues = {
  useInstanceNamespace: boolean;
  source: HelmSourceFormikValues;
  destinationNamespace?: string;
  appSetName: string;
};

export type PostInstallationFormikValues = {
  autoSync: boolean;
  pruneResources: boolean;
  createNamespace: boolean;
  destinationNamespace?: string;
  source: GitRepoSourceFormikValues | HelmSourceFormikValues;
  appSetName: string;
  type: RepositoryType;
};

export const isHelmSource = (
  source: GitRepoSourceFormikValues | HelmSourceFormikValues,
): source is HelmSourceFormikValues => (source as HelmSourceFormikValues).chart !== undefined;

export type WizardFormikValues = {
  details: DetailsFormikValues;
  installation: InstallationFormikValues;
  postInstallation: PostInstallationFormikValues[];
  isCreateFlow: boolean;
};
