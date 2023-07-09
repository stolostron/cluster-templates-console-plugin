import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { GitRepository } from '../types/resourceTypes';

import { REPOSITORIES_URL } from '../constants';
import {
  GitRepositoriesContext,
  GitRepositoriesListResult,
} from '../contexts/gitRepositoriesContext';

const GIT_REPOSITORIES_ENDPOINT = `${REPOSITORIES_URL}/git-repositories`;

export const useGitRepositories = (): GitRepositoriesListResult & {
  refetch: () => Promise<void>;
} => {
  const [repoListResult, setRepoListResult] = React.useContext(GitRepositoriesContext);
  const fetch = React.useCallback(async () => {
    setRepoListResult({ repos: [], loaded: false, error: null });
    try {
      const res = await consoleFetch(GIT_REPOSITORIES_ENDPOINT);
      const yaml = await res.text();
      const repos = load(yaml) as GitRepository[];
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
