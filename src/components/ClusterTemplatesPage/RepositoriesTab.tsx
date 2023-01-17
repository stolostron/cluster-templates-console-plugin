import * as React from 'react';
import {
  k8sDelete,
  ResourceLink,
  useK8sModel,
  WatchK8sResult,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Label,
  Modal,
  ModalVariant,
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
} from '../../types';
import { getRepoCharts } from '../../hooks/useHelmChartRepositories';
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
  const [model] = useK8sModel(secretGVK);
  const [repositories, repositoriesLoaded, repositoriesError] = helmChartRepositoriesResult;
  const [templates, templatesLoaded, templatesLoadError] = clusterTemplatesResult;

  const templatesFromRepo = templates.filter(
    (t) => t.spec.clusterDefinition.source.repoURL === obj.data?.url,
  );

  const repository = repositories.find((r) => r.url === obj.data?.url);

  const repoChartsCount = repository?.index ? getRepoCharts(repository.index).length ?? '-' : '-';

  const repoChartsUpdatedAt = repository?.index
    ? new Date(repository.index.generated).toLocaleString()
    : '-';

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
      <Td dataLabel={columns[0].title}>
        <ResourceLink
          groupVersionKind={secretGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
      </Td>
      <Td dataLabel={columns[1].title}>
        <Text component="a" href={obj.data?.url} target="_blank" rel="noopener noreferrer">
          <Truncate content={obj.data?.url} position={'middle'} trailingNumChars={10} />
        </Text>
      </Td>
      <Td dataLabel={columns[2].title}>
        {obj.data?.username ? t('Authenticated') : t('Not required')}
      </Td>
      <Td dataLabel={columns[3].title}>
        <CellLoader loaded={repositoriesLoaded} error={repositoriesError}>
          {repoChartsUpdatedAt}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[4].title}>
        <CellLoader loaded={repositoriesLoaded} error={repositoriesError}>
          {repository?.error ? (
            <RepositoryErrorPopover error={repository.error} />
          ) : (
            repoChartsCount
          )}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[5].title}>
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
      {isDialogOpen('deleteDialog') && (
        <Modal
          variant={ModalVariant.small}
          isOpen
          title={t('Delete Helm chart repository')}
          titleIconVariant="warning"
          showClose
          onClose={() => closeDialog('deleteDialog')}
          actions={[
            <Button
              key="confirm"
              variant="danger"
              onClick={async () => {
                await k8sDelete({
                  model,
                  resource: obj,
                });
                closeDialog('deleteDialog');
              }}
            >
              {t('Delete')}
            </Button>,
            <Button key="cancel" variant="link" onClick={() => closeDialog('deleteDialog')}>
              {t('Cancel')}
            </Button>,
          ]}
        >
          {t('Are you sure you want to delete?')}
        </Modal>
      )}
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
  );
};

export default RepositoriesTab;
