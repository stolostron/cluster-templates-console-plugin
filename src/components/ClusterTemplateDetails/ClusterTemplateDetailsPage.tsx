/* Copyright Contributors to the Open Cluster Management project */
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Page,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import ClusterTemplateDetailsSections from './ClusterTemplateDetailsSections';
import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';
import PageLoader from '../../helpers/PageLoader';

export const getResourceListPageUrl = (resourceGVK: K8sGroupVersionKind) =>
  `/k8s/cluster/${resourceGVK.group}~${resourceGVK.version}~${resourceGVK.kind}`;

const PageBreadcrumb: React.FC<{ clusterTemplateName: string }> = ({
  clusterTemplateName,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Button variant="link" isInline onClick={() => history.goBack()}>
          {t('Cluster templates')}
        </Button>
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{clusterTemplateName}</BreadcrumbItem>
    </Breadcrumb>
  );
};

const PageHeader: React.FC<{ clusterTemplateName: string }> = ({
  clusterTemplateName,
}) => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      style={{
        paddingTop: 'var(--pf-c-page__main-breadcrumb--PaddingTop)',
      }}
    >
      <Stack hasGutter>
        <StackItem>
          <PageBreadcrumb clusterTemplateName={clusterTemplateName} />
        </StackItem>
        <StackItem>
          <Title headingLevel="h1">{clusterTemplateName}</Title>
        </StackItem>
      </Stack>
    </PageSection>
  );
};

const ClusterTemplateDetailsPage: React.FC<{
  match: { params: { name: string } };
}> = ({ match }) => {
  const { name } = match.params;
  const [clusterTemplate, loaded, loadError] = useClusterTemplate(name);

  return (
    <PageLoader loaded={loaded} error={loadError}>
      <Page>
        <PageHeader clusterTemplateName={name} />
        <PageSection>
          <ClusterTemplateDetailsSections clusterTemplate={clusterTemplate} />
        </PageSection>
      </Page>
    </PageLoader>
  );
};

export default ClusterTemplateDetailsPage;
