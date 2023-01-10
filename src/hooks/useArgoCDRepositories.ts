import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepoIndex } from '../types';

const REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';
const REPOSITORY_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repository';

const getRepositoryEndpoint = (name) => `${REPOSITORY_ENDPOINT}/${name}`;

export type ArgoCDRepositoryListResult = [HelmRepoIndex | undefined, boolean, unknown];

export const useArgoCDRepositories = (): ArgoCDRepositoryListResult => {
  const [repoList, setRepoList] = React.useState<HelmRepoIndex>();
  const [repoListLoaded, setRepoListLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await consoleFetch(REPOSITORIES_ENDPOINT);
        console.log('res', res);
        const yaml = await res.text();
        console.log('yaml', yaml);
        setRepoList(load(yaml) as HelmRepoIndex);
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

export type ArgoCDRepositoryResult = [HelmRepoIndex | undefined, boolean, unknown];

export const useArgoCDRepository = (repositoryName: string): ArgoCDRepositoryResult => {
  const [repository, setRepository] = React.useState<HelmRepoIndex>();
  const [repositoryLoaded, setRepositoryLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  React.useEffect(() => {
    const fetch = async () => {
      try {
        const res = await consoleFetch(getRepositoryEndpoint(repositoryName));
        console.log('res', res);
        const yaml = await res.text();
        console.log('yaml', yaml);
        setRepository(load(yaml) as HelmRepoIndex);
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

export const getRepoCharts = (index: HelmRepoIndex | undefined, repoName: string) =>
  Object.keys(index?.entries || {})
    .filter((k) => {
      const keyParts = k.split('--');
      return keyParts[keyParts.length - 1] === repoName;
    })
    .reduce((acc, k) => {
      return [...acc, ...(index?.entries?.[k] || [])];
    }, [] as { name: string; version: string; created: string }[]);

export type HelmRepositoryChartsMap = {
  [chartName: string]: string[];
};

export const getRepoChartsMap = (
  index: HelmRepoIndex | undefined,
  repoName: string,
): HelmRepositoryChartsMap => {
  const map: HelmRepositoryChartsMap = {};
  const repoCharts = getRepoCharts(index, repoName);
  for (const chart of repoCharts) {
    if (!(chart.name in map)) {
      map[chart.name] = [];
    }
    map[chart.name].push(chart.version);
  }
  return map;
};
