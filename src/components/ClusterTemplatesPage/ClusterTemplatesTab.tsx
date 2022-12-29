import * as React from 'react';
import { k8sDelete, ResourceLink, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Card,
  KebabToggle,
  Modal,
  ModalVariant,
  Page,
  PageSection,
} from '@patternfly/react-core';
import {
  ActionsColumn,
  Td,
  Th,
  Thead,
  Tr,
  CustomActionsToggleProps,
  IAction,
  TableComposable,
  Tbody,
} from '@patternfly/react-table';
import { clusterTemplateGVK } from '../../constants';
import { ClusterTemplate, RowProps, TableColumn } from '../../types';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { TFunction } from 'react-i18next';
import TableLoader from '../../helpers/TableLoader';

import {
  ClusterTemplateCost,
  ClusterTemplateUsage,
} from '../sharedDetailItems/clusterTemplateDetailItems';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { useHistory } from 'react-router';
import { getEditClusterTemplateUrl } from '../../utils/utils';
import { useTranslation } from '../../hooks/useTranslation';

function getTableColumns(t: TFunction): TableColumn[] {
  return [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Cost estimation'),
      id: 'cost',
    },
    {
      title: t('Template uses'),
      id: 'usage',
    },
    {
      title: '',
      id: 'kebab-menu',
    },
  ];
}

export const ClusterTemplateRow: React.FC<RowProps<ClusterTemplate>> = ({ obj }) => {
  const { t } = useTranslation();
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const [model] = useK8sModel(clusterTemplateGVK);
  const history = useHistory();

  const getRowActions = (): IAction[] => [
    {
      title: t('Delete template'),
      onClick: () => setDeleteOpen(true),
    },
    {
      title: t('Edit template'),
      onClick: () => history.push(getEditClusterTemplateUrl(obj.metadata?.name)),
    },
  ];

  const columns = React.useMemo(() => getTableColumns(t), [t]);

  return (
    <Tr>
      <Td data-testid={columns[0].id} dataLabel={columns[0].title}>
        <ResourceLink
          groupVersionKind={clusterTemplateGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
      </Td>
      <Td data-testid={columns[1].id} dataLabel={columns[1].title}>
        <ClusterTemplateCost clusterTemplate={obj} />
      </Td>
      <Td data-testid={columns[2].id} dataLabel={columns[2].title}>
        <ClusterTemplateUsage clusterTemplate={obj} />
      </Td>
      <Td data-testid={columns[3].id} isActionCell>
        <ActionsColumn
          items={getRowActions()}
          actionsToggle={(props: CustomActionsToggleProps) => <KebabToggle {...props} />}
        />
      </Td>
      {isDeleteOpen && (
        <Modal
          variant={ModalVariant.small}
          isOpen
          title="Delete cluster template"
          titleIconVariant="warning"
          showClose
          onClose={() => setDeleteOpen(false)}
          actions={[
            <Button
              key="confirm"
              variant="danger"
              onClick={async () => {
                await k8sDelete({
                  model,
                  resource: obj,
                });
                setDeleteOpen(false);
              }}
            >
              {t('Delete')}
            </Button>,
            <Button key="cancel" variant="link" onClick={() => setDeleteOpen(false)}>
              {t('Cancel')}
            </Button>,
          ]}
        >
          {t('Are you sure you want to delete?')}
        </Modal>
      )}
    </Tr>
  );
};

const ClusterTemplatesTab = () => {
  const { t } = useTranslation();
  const [templates, loaded, loadError] = useClusterTemplates();
  return (
    <AlertsContextProvider>
      <Page>
        <PageSection>
          <TableLoader
            loaded={loaded}
            error={loadError}
            errorId="templates-load-error"
            errorMessage={t('The cluster templates could not be loaded.')}
          >
            <Card>
              <TableComposable
                aria-label="Cluster templates table"
                data-testid="cluster-templates-table"
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
                  {templates.map((template) => (
                    <ClusterTemplateRow key={template.metadata?.name} obj={template} />
                  ))}
                </Tbody>
              </TableComposable>
            </Card>
          </TableLoader>
        </PageSection>
      </Page>
    </AlertsContextProvider>
  );
};

export default ClusterTemplatesTab;
