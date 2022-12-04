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
import { helmRepoGVK } from '../../constants';
import { ClusterTemplate, HelmChartRepository, RowProps, TableColumn } from '../../types';
import { useHelmRepositories } from '../../hooks/useHelmRepositories';
import {
  useHelmRepositoryIndex,
  getRepoCharts,
  HelmRepositoryIndexResult,
} from '../../hooks/useHelmRepositoryIndex';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';

import TableLoader from '../../helpers/TableLoader';
import useDialogsReducer from '../../hooks/useDialogsReducer';
import EditHelmRepositoryDialog from '../HelmRepositories/EditHelmRepositoryDialog';
import { useTranslation } from '../../hooks/useTranslation';
import CellLoader from '../../helpers/CellLoader';

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
    title: t('Group'),
    id: 'group',
  },
  {
    title: '',
    id: 'kebab-menu',
  },
];

type HelmRepositoryActionDialogIds = 'deleteDialog' | 'editCredentialsDialog';
const helmRepositoryActionDialogIds: HelmRepositoryActionDialogIds[] = [
  'deleteDialog',
  'editCredentialsDialog',
];

type HelmRepoRowProps = RowProps<HelmChartRepository> & {
  helmRepoIndexResult: HelmRepositoryIndexResult;
  clusterTemplatesResult: WatchK8sResult<ClusterTemplate[]>;
};

export const HelmRepoRow = ({
  obj,
  helmRepoIndexResult,
  clusterTemplatesResult,
}: HelmRepoRowProps) => {
  const { t } = useTranslation();

  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(
    helmRepositoryActionDialogIds,
  );
  const [model] = useK8sModel(helmRepoGVK);
  const [repoIndex, repoIndexLoaded, repoIndexError] = helmRepoIndexResult;
  const [templates, templatesLoaded, templatesLoadError] = clusterTemplatesResult;

  const templatesFromRepo = templates.filter(
    (t) => t.spec.clusterDefinition.source.repoURL === obj.metadata?.name,
  );
  const repoChartsCount = repoIndex
    ? getRepoCharts(repoIndex, obj.metadata?.name ?? '').length ?? '-'
    : '-';
  const repoChartsUpdatedAt = repoIndex ? new Date(repoIndex.generated).toLocaleString() : '-';

  const getRowActions = (): IAction[] => {
    return [
      {
        title: t('Edit repository'),
        onClick: () => openDialog('editCredentialsDialog'),
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
          groupVersionKind={helmRepoGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
      </Td>
      <Td dataLabel={columns[1].title}>
        <Text
          component="a"
          href={obj.spec.connectionConfig.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Truncate
            content={obj.spec.connectionConfig.url}
            position={'middle'}
            trailingNumChars={10}
          />
        </Text>
      </Td>
      <Td dataLabel={columns[2].title}>
        {obj.spec.connectionConfig.tlsClientConfig ? t('Authenticated') : t('Not required')}
      </Td>
      <Td dataLabel={columns[3].title}>
        <CellLoader loaded={repoIndexLoaded} error={repoIndexError}>
          {repoChartsUpdatedAt}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[4].title}>
        <CellLoader loaded={repoIndexLoaded} error={repoIndexError}>
          {repoChartsCount}
        </CellLoader>
      </Td>
      <Td dataLabel={columns[5].title}>
        <CellLoader loaded={templatesLoaded} error={templatesLoadError}>
          <Label color="green" icon={<CheckCircleIcon />}>
            {templatesFromRepo.length}
          </Label>
        </CellLoader>
      </Td>
      <Td dataLabel={columns[6].title}>-</Td>
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
      {isDialogOpen('editCredentialsDialog') && (
        <EditHelmRepositoryDialog
          helmChartRepository={obj}
          closeDialog={() => closeDialog('editCredentialsDialog')}
        />
      )}
    </Tr>
  );
};

const HelmRepositoriesTab = () => {
  const [repositories, repositoriesLoaded, repositoriesError] = useHelmRepositories();
  const helmRepoIndexResult = useHelmRepositoryIndex();
  const clusterTemplatesResult = useClusterTemplates();
  const { t } = useTranslation();

  return (
    <Page>
      <PageSection>
        <TableLoader
          loaded={repositoriesLoaded}
          error={repositoriesError}
          errorId="helm-repositories-load-error"
          errorMessage={t('The Helm repositories could not be loaded.')}
        >
          <Card>
            <TableComposable
              aria-label="Helm repositories table"
              data-testid="helm-repositories-table"
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
                {repositories.map((repository) => (
                  <HelmRepoRow
                    key={repository.metadata?.name}
                    obj={repository}
                    clusterTemplatesResult={clusterTemplatesResult}
                    helmRepoIndexResult={helmRepoIndexResult}
                  />
                ))}
              </Tbody>
            </TableComposable>
          </Card>
        </TableLoader>
      </PageSection>
    </Page>
  );
};

export default HelmRepositoriesTab;
