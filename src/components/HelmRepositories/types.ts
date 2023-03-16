import { RepositoryType } from '../../types/resourceTypes';

export type RepositoryFormValues = {
  useCredentials: boolean;
  name: string;
  url: string;
  type: RepositoryType;
  username: string;
  password: string;
};
