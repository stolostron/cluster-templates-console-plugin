import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import ClusterTemplateInstancesTable from '../ClusterTemplateInstancesTable/ClusterTemplateInstancesTable';
import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';

import TableLoader from '../../helpers/TableLoader';
import { useTranslation } from '../../hooks/useTranslation';
import EmptyPageState from '../../helpers/EmptyPageState';
import { Card } from '@patternfly/react-core';

const InstancesEmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <EmptyPageState
        title={t('No clusters associated with this template yet')}
        message={t('lusters created using this template will appear here.')}
        action={undefined}
      />
    </Card>
  );
};

const InstancesTab: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const [instances, loaded, loadError] = useClusterTemplateInstances(
    clusterTemplate.metadata?.name,
  );
  return (
    <TableLoader loaded={loaded} error={loadError}>
      {instances.length === 0 ? (
        <InstancesEmptyState />
      ) : (
        <ClusterTemplateInstancesTable instances={instances} />
      )}
    </TableLoader>
  );
};

export default InstancesTab;
