import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepository } from '../types';
import { RepositoriesContext } from '../contexts/helmRepositoriesContext';

const HELM_REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';

export type HelmChartRepositoryListResult = {
  repos: HelmRepository[];
  loaded: boolean;
  error: unknown;
};

export const useHelmChartRepositories = (): HelmChartRepositoryListResult & {
  refetch: () => Promise<HelmRepository[]>;
} => {
  const [repoListResult, setRepoListResult] = React.useContext(RepositoriesContext);
  const fetch = async (): Promise<HelmRepository[]> => {
    setRepoListResult({ repos: [], loaded: false, error: null });
    try {
      const res = await consoleFetch(HELM_REPOSITORIES_ENDPOINT);
      const yaml = await res.text();
      const repos = load(yaml) as HelmRepository[];
      setRepoListResult({ repos, loaded: true, error: null });
      return repos;
    } catch (e) {
      setRepoListResult({ repos: [], loaded: true, error: e });
      throw e;
    }
  };

  React.useEffect(() => {
    if (!repoListResult) {
      fetch();
    }
  }, []);

  if (!repoListResult) {
    return { loaded: false, repos: [], error: undefined, refetch: fetch };
  } else {
    return { ...repoListResult, refetch: fetch };
  }
};

export const getNumRepoCharts = (repo: HelmRepository): number | undefined =>
  repo.index ? Object.keys(repo.index?.entries).length : undefined;
