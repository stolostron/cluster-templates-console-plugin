import * as React from 'react';
import { GitRepository, HelmRepository } from '../types/resourceTypes';

import { useGitRepositories } from './useGitRepositories';
import { useHelmChartRepositories } from './useHelmChartRepositories';

export type RepositoriesListResult = {
  repos: (GitRepository | HelmRepository)[];
  loaded: boolean;
  error: unknown;
};

const useRepositories = (): RepositoriesListResult & {
  refetch: () => Promise<void>;
} => {
  const {
    repos: gitRepos,
    loaded: gitReposLoaded,
    error: gitReposError,
    refetch: refetchGitRepos,
  } = useGitRepositories();
  const {
    repos: helmRepos,
    loaded: helmReposLoaded,
    error: helmReposError,
    refetch: refetchHelmRepos,
  } = useHelmChartRepositories();

  const fetch = React.useCallback(async () => {
    await refetchHelmRepos();
    await refetchGitRepos();
  }, [refetchGitRepos, refetchHelmRepos]);
  return {
    loaded: gitReposLoaded && helmReposLoaded,
    error: gitReposError || helmReposError,
    repos: [...gitRepos, ...helmRepos],
    refetch: fetch,
  };
};

export default useRepositories;
