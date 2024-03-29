import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepository } from '../types/resourceTypes';
import {
  HelmChartRepositoryListResult,
  HelmRepositoriesContext,
} from '../contexts/helmRepositoriesContext';
import { REPOSITORIES_URL } from '../constants';

const HELM_REPOSITORIES_ENDPOINT = `${REPOSITORIES_URL}/helm-repositories`;

export const useHelmChartRepositories = (): HelmChartRepositoryListResult & {
  refetch: () => Promise<void>;
} => {
  const [repoListResult, setRepoListResult] = React.useContext(HelmRepositoriesContext);
  const fetch = React.useCallback(async () => {
    setRepoListResult({ repos: [], loaded: false, error: null });
    try {
      const res = await consoleFetch(HELM_REPOSITORIES_ENDPOINT);
      const yaml = await res.text();
      const repos = load(yaml) as HelmRepository[];
      setRepoListResult({ repos, loaded: true, error: null });
    } catch (e) {
      setRepoListResult({ repos: [], loaded: true, error: e });
    }
  }, [setRepoListResult]);

  React.useEffect(() => {
    if (!repoListResult) {
      void fetch();
    }
  }, [fetch, repoListResult]);

  if (!repoListResult) {
    return { loaded: false, repos: [], error: undefined, refetch: fetch };
  } else {
    return { ...repoListResult, refetch: fetch };
  }
};
