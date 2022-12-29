import { useK8sWatchResource, WatchK8sResult } from '@openshift-console/dynamic-plugin-sdk';
import * as React from 'react';
import { helmRepoGVK } from '../constants';
import { HelmChartRepository } from '../types';

export const useHelmRepositories = (): WatchK8sResult<HelmChartRepository[]> => {
  const [repositories, loaded, loadError] = useK8sWatchResource<HelmChartRepository[]>({
    groupVersionKind: helmRepoGVK,
    isList: true,
  });
  return [repositories, loaded, loadError];
};

export const useHelmRepositoriesCount = () => {
  const [templates, loaded, error] = useHelmRepositories();
  return loaded && !error ? templates.length : undefined;
};

export const useHelmRepoCR = (repoUrl: string): [HelmChartRepository, boolean, unknown] => {
  const [repositories, loaded, loadError] = useHelmRepositories();
  const repoCR = React.useMemo(
    () => repositories.find((repo) => repo.spec.connectionConfig.url === repoUrl),
    [repositories],
  );
  return [repoCR, loaded, loadError];
};
