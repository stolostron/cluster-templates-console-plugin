import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import CellLoader from '../../helpers/CellLoader';
import { RepositoriesListResult } from '../../hooks/useRepositories';
import { useTranslation } from '../../hooks/useTranslation';
import {
  ArgoCDSecretData,
  DecodedSecret,
  GitRepository,
  HelmRepository,
  isHelmRepository,
} from '../../types/resourceTypes';
import ResourceStatus, { Status } from '../sharedDetailItems/ResourceStatus';

export const getNumRepoCharts = (repo: HelmRepository): number | undefined => {
  return repo.index?.entries ? Object.keys(repo.index.entries).length : undefined;
};

const GitRepoDetails = ({ repo }: { repo: GitRepository }) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <StackItem>
        <Flex>
          <FlexItem>
            <b>{t('Branches:')}</b>
          </FlexItem>
          <FlexItem>{repo.branches?.length || '-'}</FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <Flex>
          <FlexItem>
            <b>{t('Tags:')}</b>
          </FlexItem>
          <FlexItem>{repo.tags?.length || '-'}</FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );
};

const HelmRepoDetails = ({ repo }: { repo: HelmRepository }) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <StackItem>
        <Flex>
          <FlexItem>
            <b>{t('Updated at:')}</b>
          </FlexItem>
          <FlexItem>{repo?.index ? new Date(repo.index.generated).toLocaleString() : '-'}</FlexItem>
        </Flex>
      </StackItem>
      <StackItem>
        <Flex>
          <FlexItem>
            <b>{t('Charts:')}</b>
          </FlexItem>
          <FlexItem>{getNumRepoCharts(repo) || '-'}</FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );
};

const StatusText = ({ repo }: { repo: GitRepository | HelmRepository }) => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem>{t('Successfully retrieved the following repository information:')}</StackItem>
      <StackItem>
        {isHelmRepository(repo) ? <HelmRepoDetails repo={repo} /> : <GitRepoDetails repo={repo} />}
      </StackItem>
    </Stack>
  );
};

export type RepositoryStatusProps = {
  secret: DecodedSecret<ArgoCDSecretData>;
  reposListResult: RepositoriesListResult;
};

const RepositoryStatus = ({ secret, reposListResult }: RepositoryStatusProps) => {
  const { repos, loaded, error } = reposListResult;
  const { t } = useTranslation();
  const repo = repos.find((r) => r.url === secret.data?.url);
  if (!repo) {
    return (
      <CellLoader error={error} loaded={loaded}>
        <ResourceStatus
          status={Status.Failed}
          statusLabel={t('Failed')}
          message={t(`Failed to retreive information on repository {{url}}`, {
            url: secret.data.url,
          })}
        />
      </CellLoader>
    );
  }

  return (
    <CellLoader error={error} loaded={loaded}>
      <ResourceStatus
        status={repo.error ? Status.Failed : Status.Ready}
        statusLabel={repo?.error ? t('Failed') : t('Ready')}
        message={repo.error ? repo.error : <StatusText repo={repo} />}
      />
    </CellLoader>
  );
};

export default RepositoryStatus;
