import { Page, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import * as React from 'react';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import ClusterTemplateWizard from '../ClusterTemplateWizard/ClusterTemplateWizard';
import { useTranslation } from '../../hooks/useTranslation';
import { Breadcrumb } from '../../helpers/WithBreadcrumb';
import { getClusterTemplatesPageUrl } from '../../hooks/useNavigation';
import { DeserializedClusterTemplate } from '../../types/resourceTypes';

const PageHeader = ({ clusterTemplate }: { clusterTemplate?: DeserializedClusterTemplate }) => {
  const { t } = useTranslation();
  const createTitle = t('Create a cluster template');
  const title = clusterTemplate ? t('Edit ClusterTemplate') : createTitle;
  const activeItemText = clusterTemplate ? clusterTemplate?.metadata?.name || '' : createTitle;
  return (
    <>
      <PageSection variant={PageSectionVariants.light} type="breadcrumb">
        <Breadcrumb
          breadcrumb={[
            { to: getClusterTemplatesPageUrl(), text: t('Cluster Templates') },
            { text: activeItemText },
          ]}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{title}</Title>
      </PageSection>
    </>
  );
};

const ClusterTemplateWizardPage = ({
  clusterTemplate,
}: {
  clusterTemplate?: DeserializedClusterTemplate;
}) => {
  return (
    <ErrorBoundary>
      <Page>
        <PageHeader clusterTemplate={clusterTemplate} />
        <PageSection type="wizard">
          <ClusterTemplateWizard clusterTemplate={clusterTemplate} />
        </PageSection>
      </Page>
    </ErrorBoundary>
  );
};

export default ClusterTemplateWizardPage;
