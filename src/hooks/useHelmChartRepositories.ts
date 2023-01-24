import { load } from 'js-yaml';
import * as React from 'react';
import { consoleFetch } from '@openshift-console/dynamic-plugin-sdk';
import { HelmRepository } from '../types';
import { useTranslation } from 'react-i18next';

const HELM_REPOSITORIES_ENDPOINT =
  '/api/proxy/plugin/clustertemplates-plugin/repositories/api/helm-repositories';

export type RepositoriesContextType = {
  repos: HelmRepository[];
  loaded: boolean;
  error: unknown;
  refetch: () => Promise<HelmRepository[]>;
};

export const RepositoriesContext = React.createContext<RepositoriesContextType>(null);

export const repositoriesContextProvider = RepositoriesContext.Provider;

export const useHelmChartRepositoriesContextValue = (): RepositoriesContextType => {
  const [repos, setRepos] = React.useState<HelmRepository[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  const fetch = async (): Promise<HelmRepository[]> => {
    let fetchedRepos = [];
    try {
      const res = await consoleFetch(HELM_REPOSITORIES_ENDPOINT);
      const yaml = await res.text();
      fetchedRepos = load(yaml) as HelmRepository[];
      setRepos(fetchedRepos);
    } catch (e) {
      setError(e);
    } finally {
      setLoaded(true);
    }
    return fetchedRepos;
  };

  React.useEffect(() => {
    fetch();
  }, []);

  return { repos, loaded, error, refetch: fetch };
};

export const getNumRepoCharts = (repo): number =>
  repo.index ? Object.keys(repo.index.entries).length : undefined;

export const useHelmChartRepositories = (): RepositoriesContextType => {
  const context = React.useContext(RepositoriesContext);
  const { t } = useTranslation();
  if (!context) {
    throw t('useHelmChartRepositories must be callsed within RepositoriesContext provider');
  }
  return context;
};
