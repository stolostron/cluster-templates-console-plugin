import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepoIndex, HelmRepoIndexChartEntry } from '../types';

const HELM_REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';
const HELM_REPOSITORY_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repository';

const getHelmRepositoryEndpoint = (name) => `${HELM_REPOSITORY_ENDPOINT}/${name}`;

type HelmRepositoryResponse = {
  name: string;
  url: string;
  index?: HelmRepoIndex;
  error?: string;
};
type HelmRepositoriesResponse = HelmRepositoryResponse[];

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

export type HelmChartRepositoryResult = [HelmRepositoryResponse | undefined, boolean, unknown];

export const useHelmChartRepository = (repositoryName: string): HelmChartRepositoryResult => {
  const [repository, setRepository] = React.useState<HelmRepositoryResponse>();
  const [repositoryLoaded, setRepositoryLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      setError(undefined);
      try {
        const res = await consoleFetch(getHelmRepositoryEndpoint(repositoryName));
        const yaml = await res.text();
        setRepository(load(yaml) as HelmRepositoryResponse);
      } catch (e) {
        setError(e);
      } finally {
        setRepositoryLoaded(true);
      }
    };
    if (repositoryName) fetch();
  }, [repositoryName]);

  return [repository, repositoryLoaded, error];
};

export const getRepoCharts = (index: HelmRepoIndex) =>
  Object.values(index?.entries || {}).reduce((acc, v) => {
    return [...acc, ...(v || [])];
  }, [] as HelmRepoIndexChartEntry[]);

export type HelmRepositoryChartsMap = {
  [chartName: string]: string[];
};

export const getRepoChartsMap = (index: HelmRepoIndex | undefined): HelmRepositoryChartsMap => {
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
