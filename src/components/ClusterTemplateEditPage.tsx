import {
  Divider,
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
import PageLoader from '../helpers/PageLoader';
import { ClusterTemplate } from '../types';
import { k8sGet, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

const PageHeader = ({ clusterTemplateName }: { clusterTemplateName: string }) => {
  const { t } = useTranslation();
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
          <Title headingLevel="h1">{t('Edit ClusterTemplate')}</Title>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

const ClusterTemplateEditPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [model, modelLoading] = useK8sModel(clusterTemplateGVK);
  const [clusterTemplate, setClusterTemplate] = React.useState<ClusterTemplate>();
  const [clusterTemplateLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    if (name && !clusterTemplate) {
      setLoading(true);
      k8sGet<ClusterTemplate>({ model, name: name })
        .then((template) => {
          setLoading(false);
          setClusterTemplate(template);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [name, clusterTemplate, model]);
  return (
    <ErrorBoundary>
      <PageLoader
        loaded={!modelLoading && !clusterTemplateLoading && !!clusterTemplate}
        error={error}
      >
        <Page>
          <PageHeader clusterTemplateName={name} />
          <Divider />
          <ClusterTemplateWizard clusterTemplate={clusterTemplate} />
        </Page>
      </PageLoader>
    </ErrorBoundary>
  );
};

export default ClusterTemplateEditPage;
