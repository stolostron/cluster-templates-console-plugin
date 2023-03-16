import {
  Alert,
  AlertActionLink,
  Flex,
  FlexItem,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSection,
  Title,
} from '@patternfly/react-core';
import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import PageLoader from '../../helpers/PageLoader';
import { ActionsMenu } from '../../helpers/ActionsMenu';
import {
  getClusterTemplatesPageUrl,
  getResourceDetailsPageUrl,
  useNavigation,
} from '../../hooks/useNavigation';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { ClusterTemplate, ClusterTemplateVendor } from '../../types/resourceTypes';
import { clusterTemplateGVK } from '../../constants';
import { getNavLabelWithCount } from '../../utils/utils';
import { useHistory } from 'react-router';
import { useClusterTemplateQuotasCount } from '../../hooks/useQuotas';
import OverviewTab from './OverviewTab';
import { Breadcrumb } from '../../helpers/WithBreadcrumb';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import { useClusterTemplateInstancesCount } from '../../hooks/useClusterTemplateInstances';
import InstancesTab from './InstancesTab';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import DetailsQuotasTab from './DetailsQuotasTab';
import DeleteDialog from '../sharedDialogs/DeleteDialog';
import { getClusterTemplateVendor } from '../../utils/clusterTemplateDataUtils';
import useClusterTemplateActions from '../../hooks/useClusterTemplateActions';

const useActiveNavItem = (clusterTemplate: ClusterTemplate | undefined) => {
  const history = useHistory();
  if (!clusterTemplate) {
    return 'overview';
  }
  const detailsPath = getResourceDetailsPageUrl(clusterTemplateGVK, clusterTemplate);
  return detailsPath === history.location.pathname
    ? 'overview'
    : history.location.pathname.split('/').at(-1);
};

const PageNavigation = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => {
  const activeNavItem = useActiveNavItem(clusterTemplate);
  const quotasCount = useClusterTemplateQuotasCount(clusterTemplate);
  const instancesCount = useClusterTemplateInstancesCount(clusterTemplate);
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <Nav variant="tertiary">
      <NavList>
        <NavItem
          onClick={() => navigation.goToClusterTemplateDetailsPage(clusterTemplate, 'overview')}
          isActive={activeNavItem === 'overview'}
        >
          {t('Overview')}
        </NavItem>
        <NavItem
          onClick={() => navigation.goToClusterTemplateDetailsPage(clusterTemplate, 'quotas')}
          isActive={activeNavItem === 'quotas'}
        >
          {getNavLabelWithCount(t('Quotas'), quotasCount)}
        </NavItem>
        <NavItem
          onClick={() => navigation.goToClusterTemplateDetailsPage(clusterTemplate, 'instances')}
          isActive={activeNavItem === 'instances'}
        >
          {getNavLabelWithCount(t('Instances'), instancesCount)}
        </NavItem>
        <NavItem
          onClick={() => navigation.goToClusterTemplateDetailsPage(clusterTemplate, 'yaml')}
          isActive={activeNavItem === 'yaml'}
        >
          {t('YAML')}
        </NavItem>
      </NavList>
    </Nav>
  );
};

const RedhatTemplateAlert = () => {
  const { t } = useTranslation();
  return (
    <Alert
      isInline
      variant="info"
      title="Create your own template"
      actionLinks={
        <AlertActionLink onClick={() => console.log('link')}>
          {t('Learn more about creating your own cluster template')}
        </AlertActionLink>
      }
    >
      {t('Templates provided by Red Hat cannot be modified. To customize, make your own template.')}
    </Alert>
  );
};

const PageHeader = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const isRedhatTemplate =
    getClusterTemplateVendor(clusterTemplate) === ClusterTemplateVendor.REDHAT;
  const actions = useClusterTemplateActions(
    clusterTemplate,
    () => setDeleteDialogOpen(true),
    false,
  );
  return (
    <>
      <PageSection type="breadcrumb">
        <Breadcrumb
          breadcrumb={[
            { to: getClusterTemplatesPageUrl(), text: t('Cluster Templates') },
            { text: clusterTemplate.metadata?.name || '' },
          ]}
        />
      </PageSection>
      <PageSection variant="light" style={{ paddingBottom: 'unset' }}>
        <Flex>
          <FlexItem>
            <Title headingLevel="h1">{clusterTemplate.metadata?.name || ''}</Title>
          </FlexItem>
          {!isRedhatTemplate && (
            <FlexItem align={{ default: 'alignRight' }}>
              <ActionsMenu actions={actions} />
            </FlexItem>
          )}
        </Flex>
      </PageSection>
      {isRedhatTemplate && (
        <PageSection variant="light">
          <RedhatTemplateAlert />
        </PageSection>
      )}
      <PageSection type="nav" style={{ paddingTop: 'unset' }}>
        <PageNavigation clusterTemplate={clusterTemplate} />
      </PageSection>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onDelete={() => {
          setDeleteDialogOpen(false);
          navigation.goToClusterTemplatesPage();
        }}
        onCancel={() => setDeleteDialogOpen(false)}
        gvk={clusterTemplateGVK}
        resource={clusterTemplate}
      />
    </>
  );
};

const ClusterTemplateDetailsPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [clusterTemplate, loaded, loadError] = useClusterTemplate(name);
  const activeNavItem = useActiveNavItem(clusterTemplate);
  return (
    <ErrorBoundary>
      <AlertsContextProvider>
        <PageLoader loaded={loaded} error={loadError}>
          <Page>
            <PageHeader clusterTemplate={clusterTemplate} />
            {activeNavItem !== 'yaml' && (
              <PageSection>
                {activeNavItem === 'overview' && <OverviewTab clusterTemplate={clusterTemplate} />}
                {activeNavItem === 'quotas' && (
                  <DetailsQuotasTab clusterTemplate={clusterTemplate} />
                )}
                {activeNavItem === 'instances' && (
                  <InstancesTab clusterTemplate={clusterTemplate} />
                )}
              </PageSection>
            )}
            {activeNavItem === 'yaml' && <ResourceYAMLEditor initialResource={clusterTemplate} />}
          </Page>
        </PageLoader>
      </AlertsContextProvider>
    </ErrorBoundary>
  );
};

export default ClusterTemplateDetailsPage;
