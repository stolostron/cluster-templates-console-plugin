import { Flex, FlexItem, Page, PageSection, Title } from '@patternfly/react-core';
import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import ClusterTemplateDetailsSections from './ClusterTemplateDetailsSections';
import PageLoader from '../../helpers/PageLoader';
import { Action, ActionsMenu } from '../../helpers/ActionsMenu';
import { useNavigation } from '../../hooks/useNavigation';
import WithBreadcrumb from '../../helpers/WithBreadcrumb';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { ClusterTemplate } from '../../types/resourceTypes';

const PageHeader = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const actions: Action[] = [
    {
      title: t('Edit'),
      onClick: () => navigation.goToClusterTemplateEditPage(clusterTemplate),
    },
  ];
  return (
    <WithBreadcrumb
      activeItemText={clusterTemplate.metadata?.name || ''}
      onBack={() => navigation.goToClusterTemplatesPage()}
      prevItemText={t('Cluster templates')}
    >
      <Flex>
        <FlexItem>
          <Title headingLevel="h1">{clusterTemplate.metadata?.name || ''}</Title>
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <ActionsMenu actions={actions} />
        </FlexItem>
      </Flex>
    </WithBreadcrumb>
  );
};

const ClusterTemplateDetailsPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [clusterTemplate, loaded, loadError] = useClusterTemplate(name);
  return (
    <AlertsContextProvider>
      <PageLoader loaded={loaded} error={loadError}>
        <Page>
          <PageHeader clusterTemplate={clusterTemplate} />
          <PageSection>
            <ClusterTemplateDetailsSections clusterTemplate={clusterTemplate} />
          </PageSection>
        </Page>
      </PageLoader>
    </AlertsContextProvider>
  );
};

export default ClusterTemplateDetailsPage;
