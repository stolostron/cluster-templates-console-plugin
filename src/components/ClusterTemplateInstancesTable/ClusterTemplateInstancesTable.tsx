import { ClusterTemplateInstance } from '../../types';

import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { clusterTemplateInstanceGVK, namespaceGVK } from '../../constants';
import ClusterTemplateInstanceStatus from './ClusterTemplateInstanceStatus';
import { TFunction } from 'react-i18next';
import React from 'react';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
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
    title: t('Status'),
    id: 'status',
  },
];

const InstanceRow: React.FC<{
  instance: ClusterTemplateInstance;
  columns: TableColumn[];
  index: number;
}> = ({ instance, columns, index }) => {
  return (
    <Tr data-index={index} data-testid="cluster-template-instance-row">
      <Td dataLabel={columns[0].title} data-testid="name">
        <ResourceLink
          groupVersionKind={clusterTemplateInstanceGVK}
          name={instance.metadata?.name}
          namespace={instance.metadata?.namespace}
          hideIcon
          data-testid={`instance-${instance.metadata?.name}`}
        />
      </Td>
      <Td dataLabel={columns[1].title} data-testid="namespace">
        <ResourceLink
          groupVersionKind={namespaceGVK}
          name={instance.metadata?.namespace}
          hideIcon
          data-testid={`namespace-${instance.metadata?.namespace}`}
        />
      </Td>
      <Td dataLabel={columns[2].title} data-testid="status">
        <ClusterTemplateInstanceStatus instance={instance} />
      </Td>
    </Tr>
  );
};

const ClusterTemplateInstanceTable: React.FC<{
  instances: ClusterTemplateInstance[];
}> = ({ instances }) => {
  const { t } = useTranslation();
  const columns = getTableColumns(t);
  return (
    <TableComposable variant="compact" data-testid="cluster-template-instances-table">
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {instances.map((instance, index) => (
          <InstanceRow instance={instance} columns={columns} index={index} key={index} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default ClusterTemplateInstanceTable;
