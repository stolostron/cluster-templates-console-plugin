import React, { Dispatch, SetStateAction } from 'react';
import { GitRepository } from '../types/resourceTypes';

export type GitRepositoriesListResult = {
  repos: GitRepository[];
  loaded: boolean;
  error: unknown;
};

export type GitRepositoriesContextType = [
  GitRepositoriesListResult | undefined,
  Dispatch<SetStateAction<GitRepositoriesListResult | undefined>>,
];

export const GitRepositoriesContext = React.createContext<GitRepositoriesContextType>([
  undefined,
  () => undefined,
]);

export const gitRepositoriesContextProvider = GitRepositoriesContext.Provider;

export const useGitRepositoriesState = (): GitRepositoriesContextType => {
  return React.useState<GitRepositoriesListResult>();
};
