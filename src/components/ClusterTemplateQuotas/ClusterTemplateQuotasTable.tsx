/* Copyright Contributors to the Open Cluster Management project */

import { ClusterTemplateQuota } from '../../types';

import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { TFunction } from 'i18next';
import React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK, namespaceGVK } from '../../constants';
import {
  ClusterTemplateQuotaAccessSummary,
  ClusterTemplateQuotaCostSummary,
} from './clusterTemplateQuotaComponents';
import { useTranslation } from '../../hooks/useTranslation';

type TableColumn = {
  title: string;
  id: string;
};

const getTableColumns = (t: TFunction): TableColumn[] => [
  {
    title: t('Name'),
    id: 'name',
  },
  {
    title: t('Namespace'),
    id: 'namespace',
  },
  {
    title: t('User management'),
    id: 'user-management',
  },
  {
    title: t('Cost'),
    id: 'cost',
  },
];

const QuotaRow: React.FC<{
  quota: ClusterTemplateQuota;
  columns: TableColumn[];
  index: number;
}> = ({ quota, columns, index }) => {
  return (
    <Tr data-index={index} data-testid="quotas-table-row">
      <Td dataLabel={columns[0].title} data-testid="name">
        <ResourceLink
          groupVersionKind={clusterTemplateQuotaGVK}
          name={quota.metadata?.name}
          namespace={quota.metadata?.namespace}
          hideIcon
          data-testid={`quota-${quota.metadata?.name}`}
        />
      </Td>
      <Td dataLabel={columns[1].title} data-testid="namespace">
        <ResourceLink
          groupVersionKind={namespaceGVK}
          name={quota.metadata?.namespace}
          hideIcon
          data-testid={`namespace-${quota.metadata?.namespace}`}
        />
      </Td>
      <Td dataLabel={columns[2].title} data-testid="user-management">
        <ClusterTemplateQuotaAccessSummary quota={quota} />
      </Td>
      <Td dataLabel={columns[3].title} data-testid="cost">
        <ClusterTemplateQuotaCostSummary quota={quota} />
      </Td>
    </Tr>
  );
};

const ClusterTemplateQuotasTable: React.FC<{
  quotas: ClusterTemplateQuota[];
}> = ({ quotas }) => {
  const { t } = useTranslation();
  const columns = getTableColumns(t);
  return (
    <TableComposable variant="compact" data-testid="quotas-table">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {quotas.map((quota, index) => (
          <QuotaRow quota={quota} columns={columns} index={index} key={index} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default ClusterTemplateQuotasTable;
