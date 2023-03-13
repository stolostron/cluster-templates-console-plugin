import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  CustomActionsToggleProps,
  IAction,
} from '@patternfly/react-table';
import { TFunction } from 'i18next';
import React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK, namespaceGVK } from '../../constants';

import { useTranslation } from '../../hooks/useTranslation';
import { KebabToggle } from '@patternfly/react-core';
import { ClusterTemplate, Quota } from '../../types/resourceTypes';
import NotAvailable from '../../helpers/NotAvailable';
import { useNavigation } from '../../hooks/useNavigation';
import DeleteDialog from '../sharedDialogs/DeleteDialog';

export const BudgetStatus = ({ quota }: { quota: Quota }) => {
  const costAllowed = quota.spec?.budget;
  const costSpent = quota.status?.budgetSpent;
  if (costAllowed === undefined || costSpent === undefined) {
    return <>-</>;
  }
  return <>{`${costSpent} / ${costAllowed}`}</>;
};

export const ClusterTemplateInstancesStatus = ({
  quota,
  clusterTemplate,
}: {
  quota: Quota;
  clusterTemplate: ClusterTemplate;
}) => {
  const numInstances = quota.status?.templateInstances?.find(
    (status) => status.name === clusterTemplate.metadata?.name,
  )?.count;
  const numAllowed = quota.spec?.allowedTemplates?.find(
    (allowedTemplate) => allowedTemplate.name === clusterTemplate.metadata?.name,
  )?.count;
  return numInstances !== undefined && numAllowed !== undefined ? (
    <>{`${numInstances} / ${numAllowed}`}</>
  ) : (
    <NotAvailable />
  );
};

type TableColumn = {
  title: string;
  id: string;
  getContent: (quota: Quota) => React.ReactNode;
};

const getClusterTemplateInstancesStatusColumn = (
  t: TFunction,
  clusterTemplate: ClusterTemplate,
): TableColumn => ({
  title: t('Name'),
  id: 'name',
  getContent: (quota: Quota): React.ReactNode => (
    <ClusterTemplateInstancesStatus quota={quota} clusterTemplate={clusterTemplate} />
  ),
});

const getTemplatesColumn = (t: TFunction) => ({
  title: t('Templates'),
  id: 'templates',
  getContent: (quota: Quota): React.ReactNode =>
    quota.spec?.allowedTemplates?.length || <NotAvailable />,
});

const getTableColumns = (t: TFunction, clusterTemplate?: ClusterTemplate): TableColumn[] => {
  const columns = [
    {
      title: t('Name'),
      id: 'name',
      getContent: (quota: Quota) => (
        <ResourceLink
          groupVersionKind={clusterTemplateQuotaGVK}
          name={quota.metadata?.name}
          hideIcon
        />
      ),
    },
    {
      title: t('Namespace'),
      id: 'namespace',
      getContent: (quota: Quota) => (
        <ResourceLink groupVersionKind={namespaceGVK} name={quota.metadata?.namespace} hideIcon />
      ),
    },
    {
      title: t('Consumption in use'),
      id: 'consumption-in-use',
      getContent: (quota: Quota) => <BudgetStatus quota={quota} />,
    },
  ];
  const lastColumn = clusterTemplate
    ? getClusterTemplateInstancesStatusColumn(t, clusterTemplate)
    : getTemplatesColumn(t);
  return [...columns, lastColumn];
};

const QuotaRow: React.FC<{
  quota: Quota;
  columns: TableColumn[];
  index: number;
}> = ({ quota, columns, index }) => {
  const [deleteDlgOpen, setDeleteDlgOpen] = React.useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const getRowActions = (): IAction[] => {
    return [
      {
        title: t('Edit'),
        onClick: () => navigation.goToQuotaEditPage(quota),
      },
      {
        title: t('Delete'),
        onClick: () => setDeleteDlgOpen(true),
      },
    ];
  };

  return (
    <Tr data-index={index} data-testid="quotas-table-row">
      {columns.map((column) => (
        <Td dataLabel={column.title} key={column.id}>
          {column.getContent(quota)}
        </Td>
      ))}
      <Td isActionCell>
        <ActionsColumn
          items={getRowActions()}
          actionsToggle={(props: CustomActionsToggleProps) => <KebabToggle {...props} />}
        />
      </Td>
      <DeleteDialog
        isOpen={deleteDlgOpen}
        onClose={() => setDeleteDlgOpen(false)}
        gvk={clusterTemplateQuotaGVK}
        resource={quota}
      />
    </Tr>
  );
};

const QuotasTable: React.FC<{
  quotas: Quota[];
  clusterTemplate?: ClusterTemplate;
}> = ({ quotas, clusterTemplate }) => {
  const { t } = useTranslation();
  const columns = getTableColumns(t, clusterTemplate);
  return (
    <TableComposable variant="compact" data-testid="quotas-table">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
          <Th key="kababp-menu" />
        </Tr>
      </Thead>
      <Tbody>
        {quotas.map((quota, index) => (
          <QuotaRow quota={quota} columns={columns} index={index} key={quota.metadata?.uid || ''} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default QuotasTable;
