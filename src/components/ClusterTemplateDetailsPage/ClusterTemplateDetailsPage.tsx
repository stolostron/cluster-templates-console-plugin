import {
  Flex,
  FlexItem,
  Page,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import ClusterTemplateDetailsSections from './ClusterTemplateDetailsSections';
import PageLoader from '../../helpers/PageLoader';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { Action, ActionsMenu } from '../../helpers/ActionsMenu';
import PageBreadcrumb from '../../helpers/PageBreadcrumb';
import { getEditClusterTemplateUrl } from '../../utils/utils';
import { useHistory } from 'react-router';

const PageHeader = ({ clusterTemplateName }: { clusterTemplateName: string }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const actions: Action[] = [
    {
      title: t('Edit'),
      onClick: () => history.push(getEditClusterTemplateUrl(clusterTemplateName)),
    },
  ];
  return (
    <PageSection
      variant={PageSectionVariants.light}
      style={{
        paddingTop: 'var(--pf-c-page__main-breadcrumb--PaddingTop)',
      }}
    >
      <Stack hasGutter>
        <StackItem>
          <PageBreadcrumb activeItemText={clusterTemplateName} />
        </StackItem>
        <StackItem>
          <Flex>
            <FlexItem>
              <Title headingLevel="h1">{clusterTemplateName}</Title>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <ActionsMenu actions={actions} />
            </FlexItem>
          </Flex>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

const ClusterTemplateDetailsPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [clusterTemplate, loaded, loadError] = useClusterTemplate(name);
  return (
    <ErrorBoundary>
      <AlertsContextProvider>
        <PageLoader loaded={loaded} error={loadError}>
          <Page>
            <PageHeader clusterTemplateName={name} />
            <PageSection>
              <ClusterTemplateDetailsSections clusterTemplate={clusterTemplate} />
            </PageSection>
          </Page>
        </PageLoader>
      </AlertsContextProvider>
    </ErrorBoundary>
  );
};

export default ClusterTemplateDetailsPage;
