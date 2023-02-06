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
  refetch: () => Promise<void>;
} => {
  const [repoListResult, setRepoListResult] = React.useContext(RepositoriesContext);
  const fetch = async () => {
    setRepoListResult({ repos: [], loaded: false, error: null });
    try {
      const res = await consoleFetch(HELM_REPOSITORIES_ENDPOINT);
      const yaml = await res.text();
      const repos = load(yaml) as HelmRepository[];
      setRepoListResult({ repos, loaded: true, error: null });
    } catch (e) {
      setRepoListResult({ repos: [], loaded: true, error: e });
    }
  };

  React.useEffect(() => {
    if (!repoListResult) {
      void fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoListResult]);

  if (!repoListResult) {
    return { loaded: false, repos: [], error: undefined, refetch: fetch };
  } else {
    return { ...repoListResult, refetch: fetch };
  }
};

export const getNumRepoCharts = (repo: HelmRepository): number | undefined =>
  repo.index ? Object.keys(repo.index?.entries).length : undefined;
