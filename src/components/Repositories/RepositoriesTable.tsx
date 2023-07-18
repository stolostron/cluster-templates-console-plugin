import * as React from 'react';
import { ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
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
import { Truncate, Text } from '@patternfly/react-core';
import useDialogsReducer from '../../hooks/useDialogsReducer';
import EditRepositoryDialog from './EditRepositoryDialog';
import { useTranslation } from '../../hooks/useTranslation';
import CellLoader from '../../helpers/CellLoader';
import DeleteDialog from '../sharedDialogs/DeleteDialog';
import { useClusterTemplatesFromRepo } from '../../hooks/useClusterTemplates';
import ActionsTd from '../../helpers/ActionsTd';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import Humanize from 'humanize-plus';
import VendorLabel from '../sharedDetailItems/VendorLabel';
import useRepositories, { RepositoriesListResult } from '../../hooks/useRepositories';
import RepositoryStatus from './RepositoryStatus';

const COLUMN_WIDTH = 11.6;

const getTableColumns = (t: TFunction): (TableColumn & { widthPercent: number })[] => [
  {
    title: t('Type'),
    id: 'type',
    widthPercent: COLUMN_WIDTH,
  },
  {
    title: t('Repository name and URL'),
    id: 'name',
    widthPercent: 30,
  },
  {
    title: t('Credentials'),
    id: 'credentials',
    widthPercent: COLUMN_WIDTH,
  },
  {
    title: t('Created'),
    id: 'created',
    widthPercent: COLUMN_WIDTH,
  },
  {
    title: t('Status'),
    id: 'status',
    widthPercent: COLUMN_WIDTH,
  },
  {
    title: t('Vendor'),
    id: 'vendor',
    widthPercent: COLUMN_WIDTH,
  },
  {
    title: '',
    id: 'kebab-menu',
    widthPercent: 1,
  },
];

type RepositoryActionDialogIds = 'deleteDialog' | 'editRepositoryDialog';
const RepositoryActionDialogIds: RepositoryActionDialogIds[] = [
  'deleteDialog',
  'editRepositoryDialog',
];

type RepositoryRowProps = RowProps<DecodedSecret<ArgoCDSecretData>> & {
  reposListResult: RepositoriesListResult;
};

export const RepositoryRow = ({ obj, reposListResult }: RepositoryRowProps) => {
  const { t } = useTranslation();

  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(RepositoryActionDialogIds);

  //const { repos, loaded, error } = reposListResult;

  const [templatesFromRepo, templatesLoaded, templatesLoadError] = useClusterTemplatesFromRepo(
    obj.data.url,
  );

  useAddAlertOnError(templatesLoadError, 'Failed to find repository templates');

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
      <Td dataLabel={columns[0].id}>{Humanize.titleCase(obj.data?.type || '')}</Td>
      <Td dataLabel={columns[1].id}>
        <ResourceLink
          groupVersionKind={secretGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
        <Text component="a" href={obj.data?.url} target="_blank" rel="noopener noreferrer">
          <Truncate content={obj.data?.url || ''} position={'middle'} trailingNumChars={10} />
        </Text>
      </Td>
      <Td dataLabel={columns[2].id}>
        {obj.data?.username ? t('Authenticated') : t('Not required')}
      </Td>
      <Td dataLabel={columns[3].id}>
        <Timestamp timestamp={obj.metadata?.creationTimestamp || ''} />
      </Td>
      <Td dataLabel={columns[4].id}>
        <RepositoryStatus secret={obj} reposListResult={reposListResult} />
      </Td>
      <Td dataLabel={columns[5].id}>
        <VendorLabel resource={obj} />
      </Td>
      <ActionsTd>
        <CellLoader loaded={templatesLoaded}>
          <ActionsColumn items={getRowActions()} />
        </CellLoader>
      </ActionsTd>
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
  const reposResult = useRepositories();
  // t('Failed to load repositories information')
  useAddAlertOnError(reposResult.error, 'Failed to load repositories information');
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
            <Th key={column.id} style={{ width: `${column.widthPercent}%` }}>
              {column.title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {secrets.map((secret) => (
          <RepositoryRow key={secret.data?.name} obj={secret} reposListResult={reposResult} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default RepositoriesTable;
