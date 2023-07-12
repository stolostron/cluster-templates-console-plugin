import { Page, Title, PageSection, PageSectionVariants, Divider } from '@patternfly/react-core';
import * as React from 'react';
import { useParams } from 'react-router';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { clusterTemplateGVK } from '../../constants';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import { Breadcrumb } from '../../helpers/WithBreadcrumb';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import { getClusterTemplatesPageUrl } from '../../hooks/useNavigation';
import { useTranslation } from '../../hooks/useTranslation';
import { getResourceUrl } from '../../utils/k8s';

import InstanceForm from './InstanceForm';

const useCurrentTemplate = () => {
  const params = useParams<{ name: string }>();
  return params.name;
};

const PageHeader = ({ template }: { template: string }) => {
  const { t } = useTranslation();
  const title = t('Create a cluster');
  return (
    <>
      <PageSection variant={PageSectionVariants.light} type="breadcrumb">
        <Breadcrumb
          breadcrumb={[
            { to: getClusterTemplatesPageUrl(), text: t('Cluster templates') },
            { to: getResourceUrl(clusterTemplateGVK, template), text: template },
            { text: title },
          ]}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{title}</Title>
      </PageSection>
    </>
  );
};

const InstanceCreatePage = () => {
  const templateName = useCurrentTemplate();
  const templateLoadResult = useClusterTemplate(templateName);
  return (
    <ErrorBoundary>
      <AlertsContextProvider>
        <Page>
          <PageHeader template={templateName} />
          <Divider />
          <PageSection variant={PageSectionVariants.light}>
            <InstanceForm templateLoadResult={templateLoadResult} templateName={templateName} />
          </PageSection>
        </Page>
      </AlertsContextProvider>
    </ErrorBoundary>
  );
};

export default InstanceCreatePage;
