import React, { Dispatch, SetStateAction } from 'react';
import { HelmChartRepositoryListResult } from '../hooks/useHelmChartRepositories';

export type RepositoriesContextType = [
  HelmChartRepositoryListResult | undefined,
  Dispatch<SetStateAction<HelmChartRepositoryListResult>>,
];

export const RepositoriesContext = React.createContext<RepositoriesContextType>([
  undefined,
  () => undefined,
]);

export const repositoriesContextProvider = RepositoriesContext.Provider;

export const useHelmRepositoriesState = (): RepositoriesContextType => {
  return React.useState<HelmChartRepositoryListResult>();
};
