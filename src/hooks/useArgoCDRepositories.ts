import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepoIndex, HelmRepoIndexChartEntry } from '../types';

const REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';
const REPOSITORY_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repository';

const getRepositoryEndpoint = (name) => `${REPOSITORY_ENDPOINT}/${name}`;

type RepositoryResponse = {
  name: string;
  url: string;
  index?: HelmRepoIndex;
  error?: string;
};
type RepositoriesResponse = RepositoryResponse[];

export type ArgoCDRepositoryListResult = [RepositoriesResponse | undefined, boolean, unknown];

export const useArgoCDRepositories = (): ArgoCDRepositoryListResult => {
  const [repoList, setRepoList] = React.useState<RepositoriesResponse>([]);
  const [repoListLoaded, setRepoListLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await consoleFetch(REPOSITORIES_ENDPOINT);
        const yaml = await res.text();
        setRepoList(load(yaml) as RepositoriesResponse);
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

export type ArgoCDRepositoryResult = [RepositoryResponse | undefined, boolean, unknown];

export const useArgoCDRepository = (repositoryName: string): ArgoCDRepositoryResult => {
  const [repository, setRepository] = React.useState<RepositoryResponse>();
  const [repositoryLoaded, setRepositoryLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await consoleFetch(getRepositoryEndpoint(repositoryName));
        const yaml = await res.text();
        setRepository(load(yaml) as RepositoryResponse);
      } catch (e) {
        setError(e);
      } finally {
        setRepositoryLoaded(true);
      }
    };
    fetch();
  }, []);

  return [repository, repositoryLoaded, error];
};

export const getRepoCharts = (index: HelmRepoIndex) =>
  Object.values(index?.entries || {}).reduce((acc, v) => {
    return [...acc, ...(v || [])];
  }, [] as HelmRepoIndexChartEntry[]);

export type HelmRepositoryChartsMap = {
  [chartName: string]: string[];
};

export const getRepoChartsMap = (index: HelmRepoIndex): HelmRepositoryChartsMap => {
  const map: HelmRepositoryChartsMap = {};
  const repoCharts = getRepoCharts(index);
  for (const chart of repoCharts) {
    if (!(chart.name in map)) {
      map[chart.name] = [];
    }
    map[chart.name].push(chart.version);
  }
  return map;
};
