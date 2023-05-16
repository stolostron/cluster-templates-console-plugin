import * as React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Label, Truncate, Text } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import {
  ActionsColumn,
  IAction,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { TFunction } from 'react-i18next';
import { secretGVK } from '../../constants';
import { ArgoCDSecretData, DecodedSecret, RowProps, TableColumn } from '../../types/resourceTypes';
import { getNumRepoCharts } from '../../hooks/useHelmChartRepositories';

import useDialogsReducer from '../../hooks/useDialogsReducer';
import EditRepositoryDialog from './EditRepositoryDialog';
import { useTranslation } from '../../hooks/useTranslation';
import CellLoader from '../../helpers/CellLoader';
import {
  HelmChartRepositoryListResult,
  useHelmChartRepositories,
} from '../../hooks/useHelmChartRepositories';
import RepositoryErrorPopover from './RepositoryErrorPopover';
import DeleteDialog from '../sharedDialogs/DeleteDialog';
import { useClusterTemplatesFromRepo } from '../../hooks/useClusterTemplates';

const getTableColumns = (t: TFunction): TableColumn[] => [
  {
    title: t('Name'),
    id: 'name',
  },
  {
    title: t('URL'),
    id: 'url',
  },
  {
    title: t('Credentials'),
    id: 'credentials',
  },
  {
    title: t('Last updated'),
    id: 'updated-at',
  },
  {
    title: t('Helm charts'),
    id: 'charts',
  },
  {
    title: t('Templates published'),
    id: 'templates',
  },
  {
    title: '',
    id: 'kebab-menu',
  },
];

type RepositoryActionDialogIds = 'deleteDialog' | 'editRepositoryDialog';
const RepositoryActionDialogIds: RepositoryActionDialogIds[] = [
  'deleteDialog',
  'editRepositoryDialog',
];

type RepositoryRowProps = RowProps<DecodedSecret<ArgoCDSecretData>> & {
  helmChartRepositoriesResult: HelmChartRepositoryListResult;
};

export const RepositoryRow = ({ obj, helmChartRepositoriesResult }: RepositoryRowProps) => {
  const { t } = useTranslation();

  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(RepositoryActionDialogIds);
  const { repos, loaded, error } = helmChartRepositoriesResult;
  const [templatesFromRepo, templatesLoaded, templatesLoadError] = useClusterTemplatesFromRepo(
    obj.data.url,
  );

  let repoChartsCount: string | number = '-';
  let repoChartsUpdatedAt = '-';
  let repository;
  if (obj.data.type === 'helm') {
    repository = repos.find((r) => r.url === obj.data?.url);
    repoChartsCount = (repository && getNumRepoCharts(repository)) || '-';
    repoChartsUpdatedAt =
      (repository?.index && new Date(repository.index.generated).toLocaleString()) || '-';
  }

  const getRowActions = (): IAction[] => {
    return [
      {
        title: t('Edit'),
        onClick: () => openDialog('editRepositoryDialog'),
      },
      {
        title: t('Remove'),
        onClick: () => openDialog('deleteDialog'),
        disabled: templatesFromRepo.length > 0,
        description:
          templatesFromRepo.length > 0
            ? t('To remove the repository, delete the templates using it')
            : undefined,
      },
    ];
  };

  const columns = React.useMemo(() => getTableColumns(t), [t]);

  return (
    <Tr>
      <Td dataLabel={columns[0].id}>
        <ResourceLink
          groupVersionKind={secretGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
      </Td>
      <Td dataLabel={columns[1].id}>
        <Text component="a" href={obj.data?.url} target="_blank" rel="noopener noreferrer">
          <Truncate content={obj.data?.url || ''} position={'middle'} trailingNumChars={10} />
        </Text>
      </Td>
      <Td dataLabel={columns[2].id}>
        {obj.data?.username ? t('Authenticated') : t('Not required')}
      </Td>
      <Td dataLabel={columns[3].id}>
        <CellLoader loaded={loaded} error={error}>
          {repoChartsUpdatedAt}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[4].id}>
        <CellLoader loaded={loaded} error={error}>
          {repository?.error ? (
            <RepositoryErrorPopover error={repository.error} />
          ) : (
            repoChartsCount
          )}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[5].id}>
        <CellLoader loaded={templatesLoaded} error={templatesLoadError}>
          <Label color="green" icon={<CheckCircleIcon />}>
            {templatesFromRepo.length}
          </Label>
        </CellLoader>
      </Td>
      <Td isActionCell>
        <CellLoader loaded={templatesLoaded}>
          <ActionsColumn items={getRowActions()} />
        </CellLoader>
      </Td>
      <DeleteDialog
        isOpen={isDialogOpen('deleteDialog')}
        onCancel={() => closeDialog('deleteDialog')}
        onDelete={() => closeDialog('deleteDialog')}
        gvk={secretGVK}
        resource={obj}
      />
      {isDialogOpen('editRepositoryDialog') && (
        <EditRepositoryDialog
          argoCDSecret={obj}
          closeDialog={() => closeDialog('editRepositoryDialog')}
        />
      )}
    </Tr>
  );
};

const RepositoriesTable = ({ secrets }: { secrets: DecodedSecret<ArgoCDSecretData>[] }) => {
  const helmChartRepositoriesResult = useHelmChartRepositories();
  const { t } = useTranslation();

  return (
    <TableComposable
      aria-label="repositories table"
      data-testid="repositories-table"
      variant="compact"
    >
      <Thead>
        <Tr>
          {getTableColumns(t).map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {secrets.map((secret) => (
          <RepositoryRow
            key={secret.data?.name}
            obj={secret}
            helmChartRepositoriesResult={helmChartRepositoriesResult}
          />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default RepositoriesTable;
