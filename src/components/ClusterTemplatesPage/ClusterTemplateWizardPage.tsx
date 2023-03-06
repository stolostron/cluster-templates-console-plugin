import { Divider, Page, Title } from '@patternfly/react-core';
import * as React from 'react';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import ClusterTemplateWizard from '../ClusterTemplateWizard/ClusterTemplateWizard';
import { useTranslation } from '../../hooks/useTranslation';
import WithBreadcrumb from '../../helpers/WithBreadcrumb';
import { useNavigation } from '../../hooks/useNavigation';
import { ClusterTemplate } from '../../types/resourceTypes';

const PageHeader = ({ clusterTemplate }: { clusterTemplate?: ClusterTemplate }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const createTitle = t('Create a new cluster template');
  const title = clusterTemplate ? t('Edit ClusterTemplate') : createTitle;
  const activeItemText = clusterTemplate ? clusterTemplate?.metadata?.name || '' : createTitle;
  return (
    <WithBreadcrumb
      activeItemText={activeItemText}
      onBack={navigation.goToClusterTemplatesPage}
      prevItemText={t('Cluster templates')}
    >
      <Title headingLevel="h1">{title}</Title>
    </WithBreadcrumb>
  );
};

const ClusterTemplateWizardPage = ({ clusterTemplate }: { clusterTemplate?: ClusterTemplate }) => {
  return (
    <ErrorBoundary>
      <Page>
        <PageHeader />
        <Divider />
        <ClusterTemplateWizard clusterTemplate={clusterTemplate} />
      </Page>
    </ErrorBoundary>
  );
};

export default ClusterTemplateWizardPage;
