import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepository } from '../types';
import { RepositoriesContext } from '../contexts/helmRepositoriesContext';
import { useAlerts } from '../alerts/AlertsContext';
import { getErrorMessage } from '../utils/utils';

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
  const { addAlert } = useAlerts();
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
    try {
      if (repoListResult === null) {
        fetch();
      }
    } catch (e) {
      addAlert({ title: `Failed to fetch Helm chart repositories`, message: getErrorMessage(e) });
    }
  }, []);

  if (!repoListResult) {
    return { loaded: false, repos: [], error: null, refetch: fetch };
  } else {
    return { ...repoListResult, refetch: fetch };
  }
};

export const getNumRepoCharts = (repo): number =>
  repo.index ? Object.keys(repo.index.entries).length : undefined;
