import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { mockGitRepoList, mockHelmRepoList } from '../../mocks/mockRepoList';
import RepositoryStatus, { RepositoryStatusProps } from './RepositoryStatus';

const RepositoryStatusWrapper = (props: RepositoryStatusProps) => {
  return (
    <AlertsContextProvider>
      <div style={{ marginTop: '50px' }}>
        <RepositoryStatus {...props} />
      </div>
    </AlertsContextProvider>
  );
};

const meta: Meta<typeof RepositoryStatusWrapper> = {
  title: 'RepositoryStatus',
  component: RepositoryStatusWrapper,
};

export default meta;
type Story = StoryObj<typeof RepositoryStatusWrapper>;

export const GitRepository: Story = {
  args: {
    reposListResult: {
      repos: mockGitRepoList,
      loaded: true,
      error: null,
    },
    secret: {
      metadata: {
        name: 'git-repo',
      },
      data: {
        url: mockGitRepoList[0].url,
      },
    },
  },
};

export const HelmRepository: Story = {
  args: {
    reposListResult: {
      repos: mockHelmRepoList,
      loaded: true,
      error: null,
    },
    secret: {
      metadata: {
        name: 'helm-repo',
      },
      data: {
        url: mockHelmRepoList[0].url,
      },
    },
  },
};

export const ErrorRepository: Story = {
  args: {
    reposListResult: {
      repos: mockHelmRepoList,
      loaded: true,
      error: null,
    },
    secret: {
      metadata: {
        name: 'git-repo',
      },
      data: {
        url: 'https://dddd.com',
      },
    },
  },
};
