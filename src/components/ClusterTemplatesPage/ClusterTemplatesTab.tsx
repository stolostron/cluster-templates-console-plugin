import { Button, Stack, StackItem, Toolbar, ToolbarContent } from '@patternfly/react-core';
import React from 'react';
import EmptyPageState from '../../helpers/EmptyPageState';
import TableLoader from '../../helpers/TableLoader';
import { useDeserializedClusterTemplates } from '../../hooks/useClusterTemplates';
import { useNavigation } from '../../hooks/useNavigation';
import { useTranslation } from '../../hooks/useTranslation';
import ClusterTemplatesListGettingStarted from '../ClusterTemplatesGettingStarted/ClusterTemplatesListGettingStarted';
import ClusterTemplatesTable from './ClusterTemplatesTable';

const CreateClusterTemplateButton = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Button variant="primary" onClick={() => navigation.goToClusterTemplateCreatePage()}>
      {t('Create a template')}
    </Button>
  );
};

const ClusterTemplatesToolbar = () => {
  return (
    <Toolbar>
      <ToolbarContent>
        <CreateClusterTemplateButton />
      </ToolbarContent>
    </Toolbar>
  );
};

const ClusterTemplatesTab = () => {
  const { t } = useTranslation();
  const [clusterTemplates, loaded, error] = useDeserializedClusterTemplates();

  return (
    <TableLoader
      loaded={loaded}
      error={error}
      errorTitle={t('The Cluster Templates could not be loaded.')}
    >
      {clusterTemplates.length > 0 ? (
        <Stack hasGutter>
          <StackItem>
            <ClusterTemplatesListGettingStarted />
          </StackItem>
          <StackItem>
            <ClusterTemplatesToolbar />
            <ClusterTemplatesTable clusterTemplates={clusterTemplates} />
          </StackItem>
        </Stack>
      ) : (
        <EmptyPageState
          title={t('You have no cluster templates')}
          message={t('Click Create a template to create the first one')}
          action={<CreateClusterTemplateButton />}
        />
      )}
    </TableLoader>
  );
};

export default ClusterTemplatesTab;
