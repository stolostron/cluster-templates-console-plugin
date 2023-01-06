import {
  Page,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import * as React from 'react';
import ErrorBoundary from '../helpers/ErrorBoundary';
import ClusterTemplateWizard from './ClusterTemplateWizard/ClusterTemplateWizard';
import PageBreadcrumb from '../helpers/PageBreadcrumb';
import { useTranslation } from '../hooks/useTranslation';

const PageHeader = () => {
  const { t } = useTranslation();
  const title = t('Create a new cluster template');
  return (
    <PageSection
      variant={PageSectionVariants.light}
      style={{
        paddingTop: 'var(--pf-c-page__main-breadcrumb--PaddingTop)',
      }}
    >
      <Stack hasGutter>
        <StackItem>
          <PageBreadcrumb activeItemText={title} />
        </StackItem>
        <StackItem>
          <Title headingLevel="h1">{title}</Title>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

const ClusterTemplateCreatePage = () => {
  return (
    <ErrorBoundary>
      <Page>
        <PageHeader />
        <ClusterTemplateWizard />
      </Page>
    </ErrorBoundary>
  );
};

export default ClusterTemplateCreatePage;
