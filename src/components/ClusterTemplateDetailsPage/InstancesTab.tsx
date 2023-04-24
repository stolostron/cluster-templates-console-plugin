import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import ClusterTemplateInstancesTable from '../ClusterTemplateInstancesTable/ClusterTemplateInstancesTable';
import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';

import TableLoader from '../../helpers/TableLoader';
import { useTranslation } from '../../hooks/useTranslation';
import EmptyPageState from '../../helpers/EmptyPageState';
import { Button, Toolbar, ToolbarContent } from '@patternfly/react-core';
import { useNavigation } from '../../hooks/useNavigation';

const CreateInstanceButton = ({ template }: { template: ClusterTemplate }) => {
  const navigaton = useNavigation();
  const { t } = useTranslation();
  return (
    <Button variant="primary" onClick={() => navigaton.goToInstanceCreatePage(template)}>
      {t('Create a cluster')}
    </Button>
  );
};

const InstancesEmptyState = ({ template }: { template: ClusterTemplate }) => {
  const { t } = useTranslation();
  return (
    <EmptyPageState
      title={t('No clusters associated with this template yet')}
      message={t('Clusters created using this template will appear here.')}
      action={<CreateInstanceButton template={template} />}
    />
  );
};

const InstancesToolbar = ({ template }: { template: ClusterTemplate }) => {
  return (
    <Toolbar>
      <ToolbarContent>
        <CreateInstanceButton template={template} />
      </ToolbarContent>
    </Toolbar>
  );
};
const InstancesTab: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const [instances, loaded, loadError] = useClusterTemplateInstances(
    clusterTemplate.metadata?.name,
  );
  return (
    <TableLoader loaded={loaded} error={loadError}>
      {instances.length === 0 ? (
        <InstancesEmptyState template={clusterTemplate} />
      ) : (
        <>
          <InstancesToolbar template={clusterTemplate} />
          <ClusterTemplateInstancesTable instances={instances} />
        </>
      )}
    </TableLoader>
  );
};

export default InstancesTab;
