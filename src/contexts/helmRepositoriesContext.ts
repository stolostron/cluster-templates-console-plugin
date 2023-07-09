import React, { Dispatch, SetStateAction } from 'react';
import { HelmRepository } from '../types/resourceTypes';

export type HelmChartRepositoryListResult = {
  repos: HelmRepository[];
  loaded: boolean;
  error: unknown;
};

export type HelmRepositoriesContextType = [
  HelmChartRepositoryListResult | undefined,
  Dispatch<SetStateAction<HelmChartRepositoryListResult | undefined>>,
];

export const HelmRepositoriesContext = React.createContext<HelmRepositoriesContextType>([
  undefined,
  () => undefined,
]);

export const helmRepositoriesContextProvider = HelmRepositoriesContext.Provider;

export const useHelmRepositoriesState = (): HelmRepositoriesContextType => {
  return React.useState<HelmChartRepositoryListResult>();
};
