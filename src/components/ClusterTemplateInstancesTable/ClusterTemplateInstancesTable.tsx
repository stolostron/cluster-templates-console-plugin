import {
  ClusterTemplateInstance,
  ClusterTemplateInstanceStatusPhase,
} from '../../types/resourceTypes';

import { Thead, Tr, Th, Tbody, Td, IAction, ActionsColumn } from '@patternfly/react-table';
import {
  applicationGVK,
  clusterTemplateInstanceGVK,
  CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX,
} from '../../constants';
import ClusterTemplateInstanceStatus from './ClusterTemplateInstanceStatus';
import { TFunction } from 'react-i18next';
import React from 'react';
import { K8sResourceCommon, ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from '../../hooks/useTranslation';
import DeleteDialog from '../sharedDialogs/DeleteDialog';
import { useManagedCluster } from '../../hooks/useManagedCluster';
import CellLoader from '../../helpers/CellLoader';
import { getManagedClusterUrl } from '../../utils/mceUrls';
import ActionsTd from '../../helpers/ActionsTd';
import { useK8sWatchResource } from '../../hooks/k8s';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import { getResourceUrl } from '../../utils/k8s';
import useCredentials from '../../hooks/useCredentials';
import { TableComposableEqualColumnSize } from '../../helpers/PatternflyOverrides';
import CredentialsDialog from './CredentialsDialog';

type TableColumn = {
  title: string;
  id: string;
};

const getTableColumns = (t: TFunction): TableColumn[] => [
  {
    title: t('Instance'),
    id: 'instance',
  },
  {
    title: t('Cluster'),
    id: 'cluster',
  },
  {
    title: t('Status'),
    id: 'status',
  },
  {
    title: t('Argo Applications'),
    id: 'applications',
  },
  { title: t('Created'), id: 'created' },
];

const ClusterLink = ({ instance }: { instance: ClusterTemplateInstance }) => {
  const [managedCluster, loaded, error] = useManagedCluster(instance);
  return (
    <CellLoader loaded={loaded} error={error}>
      {managedCluster && managedCluster?.metadata?.name ? (
        <a href={getManagedClusterUrl(managedCluster.metadata.name || '')}>
          {managedCluster.metadata.name || ''}
        </a>
      ) : (
        <>-</>
      )}
    </CellLoader>
  );
};

const ApplicationsLink = ({ instance }: { instance: ClusterTemplateInstance }) => {
  const { t } = useTranslation();
  const appLabels = {
    [`${CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX}/name`]: instance.metadata?.name || '',
    [`${CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX}/namespace`]: instance.metadata?.namespace || '',
  };
  const [applications, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: applicationGVK,
    selector: { matchLabels: appLabels },
    isList: true,
  });
  // t("Failed to load Argo Applications")
  useAddAlertOnError(error, 'Failed to load Argo Applications');
  return (
    <CellLoader loaded={loaded} error={error}>
      <a href={getResourceUrl(applicationGVK, undefined, undefined, appLabels)}>
        {t('{{count}} Application', { count: applications.length })}
      </a>
    </CellLoader>
  );
};

const InstanceRow: React.FC<{
  instance: ClusterTemplateInstance;
  columns: TableColumn[];
  index: number;
}> = ({ instance, columns, index }) => {
  const { t } = useTranslation();
  const [deleteDlgOpen, setDeleteDlgOpen] = React.useState(false);
  const [credentialsData, credentialsDataLoaded, credentialsDataError] = useCredentials(instance);
  const [isCredentialsDlgOpen, setCredentialsDlgOpen] = React.useState(false);
  // t('Failed to load credentials');
  useAddAlertOnError(credentialsDataError, 'Failed to load credentials');
  let description = '';
  if (!credentialsData) {
    description =
      instance.status?.phase !== ClusterTemplateInstanceStatusPhase.Ready
        ? t('Cluster is not ready yet')
        : t('Credentials unavailable');
  }
  const getRowActions = (): IAction[] => {
    return [
      {
        title: t('Delete'),
        onClick: () => setDeleteDlgOpen(true),
      },
      {
        title: t('Show credentials'),
        onClick: () => setCredentialsDlgOpen(true),
        isDisabled: !credentialsData,
        description,
      },
    ];
  };

  return (
    <Tr data-index={index} data-testid="cluster-template-instance-row">
      <Td dataLabel={columns[0].title}>
        <ResourceLink
          groupVersionKind={clusterTemplateInstanceGVK}
          name={instance.metadata?.name}
          namespace={instance.metadata?.namespace}
          hideIcon
          data-testid={`instance-${instance.metadata?.name || ''}`}
        />
      </Td>
      <Td dataLabel={columns[1].title}>
        <ClusterLink instance={instance} />
      </Td>
      <Td dataLabel={columns[2].title}>
        <ClusterTemplateInstanceStatus instance={instance} />
      </Td>
      <Td dataLabel={columns[3].title}>
        <ApplicationsLink instance={instance} />
      </Td>
      <Td dataLabel={columns[4].title}>
        <Timestamp timestamp={instance.metadata?.creationTimestamp || ''} />
      </Td>

      <ActionsTd>
        <CellLoader loaded={credentialsDataLoaded}>
          <ActionsColumn items={getRowActions()} />
        </CellLoader>
      </ActionsTd>
      <DeleteDialog
        isOpen={deleteDlgOpen}
        onDelete={() => setDeleteDlgOpen(false)}
        onCancel={() => setDeleteDlgOpen(false)}
        gvk={clusterTemplateInstanceGVK}
        resource={instance}
      />
      {credentialsData && (
        <CredentialsDialog
          isOpen={isCredentialsDlgOpen}
          onClose={() => setCredentialsDlgOpen(false)}
          {...credentialsData}
        />
      )}
    </Tr>
  );
};

const ClusterTemplateInstanceTable: React.FC<{
  instances: ClusterTemplateInstance[];
}> = ({ instances }) => {
  const { t } = useTranslation();
  const columns = getTableColumns(t);
  return (
    <TableComposableEqualColumnSize
      variant="compact"
      data-testid="cluster-template-instances-table"
    >
      <Thead>
        <Tr>
          {columns.map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {instances.map((instance, index) => (
          <InstanceRow
            instance={instance}
            columns={columns}
            index={index}
            key={instance.metadata?.uid || ''}
          />
        ))}
      </Tbody>
    </TableComposableEqualColumnSize>
  );
};

export default ClusterTemplateInstanceTable;
