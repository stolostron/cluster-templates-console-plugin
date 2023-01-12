import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepository } from '../types';

const HELM_REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';
const HELM_REPOSITORY_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repository';

const getHelmRepositoryEndpoint = (name) => `${HELM_REPOSITORY_ENDPOINT}/${name}`;
type HelmRepositoriesResponse = HelmRepository[];

export type HelmChartRepositoryListResult = [
  HelmRepositoriesResponse | undefined,
  boolean,
  unknown,
];

export const useHelmChartRepositories = (): HelmChartRepositoryListResult => {
  const [repoList, setRepoList] = React.useState<HelmRepositoriesResponse>([]);
  const [repoListLoaded, setRepoListLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await consoleFetch(HELM_REPOSITORIES_ENDPOINT);
        const yaml = await res.text();
        setRepoList(load(yaml) as HelmRepositoriesResponse);
      } catch (e) {
        setError(e);
      } finally {
        setRepoListLoaded(true);
      }
    };
    fetch();
  }, []);

  return [repoList, repoListLoaded, error];
};

export const getNumRepoCharts = (repo): number =>
  repo.index ? Object.keys(repo.index.entries).length : undefined;

export type HelmChartRepositoryResult = [HelmRepository | undefined, boolean, unknown];

export const fetchHelmRepository = async (repositoryName: string): Promise<HelmRepository> => {
  const res = await consoleFetch(getHelmRepositoryEndpoint(repositoryName));
  const yaml = await res.text();
  return load(yaml) as HelmRepository;
};
