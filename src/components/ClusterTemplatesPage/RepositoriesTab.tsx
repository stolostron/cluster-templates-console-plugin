import * as React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import {
  Label,
  PageSection,
  Truncate,
  Text,
  KebabToggle,
  Page,
  Card,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import {
  ActionsColumn,
  CustomActionsToggleProps,
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
import {
  ArgoCDSecretData,
  ClusterTemplate,
  DecodedSecret,
  RowProps,
  TableColumn,
} from '../../types/resourceTypes';
import { getNumRepoCharts } from '../../hooks/useHelmChartRepositories';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';

import TableLoader from '../../helpers/TableLoader';
import useDialogsReducer from '../../hooks/useDialogsReducer';
import EditRepositoryDialog from '../HelmRepositories/EditRepositoryDialog';
import { useTranslation } from '../../hooks/useTranslation';
import CellLoader from '../../helpers/CellLoader';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import {
  HelmChartRepositoryListResult,
  useHelmChartRepositories,
} from '../../hooks/useHelmChartRepositories';
import RepositoriesEmptyState from '../HelmRepositories/RepositoriesEmptyState';
import RepositoryErrorPopover from '../HelmRepositories/RepositoryErrorPopover';
import { WatchK8sResult } from '../../hooks/k8s';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import DeleteDialog from '../sharedDialogs/DeleteDialog';

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
  clusterTemplatesResult: WatchK8sResult<ClusterTemplate[]>;
};

export const RepositoryRow = ({
  obj,
  helmChartRepositoriesResult,
  clusterTemplatesResult,
}: RepositoryRowProps) => {
  const { t } = useTranslation();

  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(RepositoryActionDialogIds);
  const { repos, loaded, error } = helmChartRepositoriesResult;
  const [templates, templatesLoaded, templatesLoadError] = clusterTemplatesResult;

  const templatesFromRepo = templates.filter(
    (t) => t.spec.clusterDefinition.source.repoURL === obj.data?.url,
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
        title: t('Edit repository'),
        onClick: () => openDialog('editRepositoryDialog'),
      },
      {
        title: t('Delete repository'),
        onClick: () => openDialog('deleteDialog'),
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
        <ActionsColumn
          items={getRowActions()}
          actionsToggle={(props: CustomActionsToggleProps) => <KebabToggle {...props} />}
        />
      </Td>
      <DeleteDialog
        isOpen={isDialogOpen('deleteDialog')}
        onClose={() => closeDialog('deleteDialog')}
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

type RepositoriesTabProps = {
  openNewRepositoryDialog: () => void;
};

const RepositoriesTab = ({ openNewRepositoryDialog }: RepositoriesTabProps) => {
  const [secrets, loaded, error] = useArgoCDSecrets();
  const helmChartRepositoriesResult = useHelmChartRepositories();
  const clusterTemplatesResult = useClusterTemplates();
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <Page>
        <PageSection>
          <TableLoader
            loaded={loaded}
            error={error}
            errorId="repositories-load-error"
            errorMessage={t('Repositories could not be loaded.')}
          >
            <Card>
              {!secrets.length ? (
                <RepositoriesEmptyState addRepository={openNewRepositoryDialog} />
              ) : (
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
                        clusterTemplatesResult={clusterTemplatesResult}
                        helmChartRepositoriesResult={helmChartRepositoriesResult}
                      />
                    ))}
                  </Tbody>
                </TableComposable>
              )}
            </Card>
          </TableLoader>
        </PageSection>
      </Page>
    </ErrorBoundary>
  );
};

export default RepositoriesTab;
