import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import ClusterTemplateInstancesTable from '../ClusterTemplateInstancesTable/ClusterTemplateInstancesTable';
import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { EmptyState, Title, EmptyStateBody } from '@patternfly/react-core';

import TableLoader from '../../helpers/TableLoader';
import { useTranslation } from '../../hooks/useTranslation';

const UsageEmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <EmptyState>
      <Title size="lg" headingLevel="h4">
        {t('No clusters associated with this template yet')}
      </Title>
      <EmptyStateBody>{t('Clusters created using this template will appear here.')}</EmptyStateBody>
    </EmptyState>
  );
};

const UsageSection: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const [instances, loaded, loadError] = useClusterTemplateInstances(
    clusterTemplate.metadata?.name,
  );
  return (
    <TableLoader loaded={loaded} error={loadError}>
      {instances.length === 0 ? (
        <UsageEmptyState />
      ) : (
        <ClusterTemplateInstancesTable instances={instances} />
      )}
    </TableLoader>
  );
};

export default UsageSection;
