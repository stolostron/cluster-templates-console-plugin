import { QuotaDetails } from '../../types';

import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { TFunction } from 'i18next';
import React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK, namespaceGVK } from '../../constants';
import { ClusterTemplateQuotaCostSummary } from './clusterTemplateQuotaComponents';
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
    title: t('Users'),
    id: 'users',
  },
  {
    title: t('Groups'),
    id: 'groups',
  },
  {
    title: t('Cost'),
    id: 'cost',
  },
];

const QuotaRow: React.FC<{
  quotaDetails: QuotaDetails;
  columns: TableColumn[];
  index: number;
}> = ({ quotaDetails, columns, index }) => {
  return (
    <Tr data-index={index} data-testid="quotas-table-row">
      <Td dataLabel={columns[0].title} data-testid="name">
        <ResourceLink
          groupVersionKind={clusterTemplateQuotaGVK}
          name={quotaDetails.name}
          namespace={quotaDetails.namespace}
          hideIcon
          data-testid={`quota-${quotaDetails.name}`}
        />
      </Td>
      <Td dataLabel={columns[1].title} data-testid="namespace">
        <ResourceLink
          groupVersionKind={namespaceGVK}
          name={quotaDetails.namespace}
          hideIcon
          data-testid={`namespace-${quotaDetails.namespace}`}
        />
      </Td>
      <Td dataLabel={columns[2].title}>{quotaDetails.numUsers}</Td>
      <Td dataLabel={columns[2].title}>{quotaDetails.numGroups}</Td>
      <Td dataLabel={columns[3].title} data-testid="cost">
        <ClusterTemplateQuotaCostSummary quotaDetails={quotaDetails} />
      </Td>
    </Tr>
  );
};

const ClusterTemplateQuotasTable: React.FC<{
  quotaDetails: QuotaDetails[];
}> = ({ quotaDetails }) => {
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
        {quotaDetails.map((quotaDetails, index) => (
          <QuotaRow
            quotaDetails={quotaDetails}
            columns={columns}
            index={index}
            key={quotaDetails.uid}
          />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default ClusterTemplateQuotasTable;
