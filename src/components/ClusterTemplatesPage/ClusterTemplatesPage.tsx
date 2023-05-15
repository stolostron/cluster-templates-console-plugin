import * as React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavList,
  Page,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { useClusterTemplatesCount } from '../../hooks/useClusterTemplates';
import { useTranslation } from '../../hooks/useTranslation';
import { getNavLabelWithCount } from '../../utils/utils';
import { useArgoCDSecretsCount } from '../../hooks/useArgoCDSecrets';
import { useQuotasCount } from '../../hooks/useQuotas';
import { useNavigation } from '../../hooks/useNavigation';
import ClusterTemplatesTab from './ClusterTemplatesTab';
import QuotasTab from './QuotasTab';
import RepositoriesTable from './RepositoriesTab';
import './hack.css';
import WithClusterTemplateQuickStarts from '../ClusterTemplatesGettingStarted/WithClusterTemplateQuickStarts';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import Alerts from '../../alerts/Alerts';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import ClusterTemplatesListGettingStarted from '../ClusterTemplatesGettingStarted/ClusterTemplatesListGettingStarted';

const PageNavigation = () => {
  const navigation = useNavigation();
  const activeNavItem = useActiveNavItem();
  const templatesCount = useClusterTemplatesCount();
  const argoCDSecretsCount = useArgoCDSecretsCount();
  const quotasCount = useQuotasCount();
  const { t } = useTranslation();
  return (
    <Nav variant="tertiary">
      <NavList>
        <NavItem
          onClick={() => navigation.goToClusterTemplatesPage()}
          isActive={activeNavItem === 'templates'}
          aria-label={t('Cluster templates tab')}
        >
          {getNavLabelWithCount('Templates', templatesCount)}
        </NavItem>
        <NavItem
          onClick={() => navigation.goToClusterTemplatesPage('repositories')}
          isActive={activeNavItem === 'repositories'}
          aria-label={t('Repositories tab')}
        >
          {getNavLabelWithCount('Repositories', argoCDSecretsCount)}
        </NavItem>
        <NavItem
          onClick={() => navigation.goToClusterTemplatesPage('quotas')}
          isActive={activeNavItem === 'quotas'}
          aria-label={t('Quotas tab')}
        >
          {getNavLabelWithCount('Quotas', quotasCount)}
        </NavItem>
      </NavList>
    </Nav>
  );
};

const PageHeader = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1">{t('Cluster templates')}</Title>
      </PageSection>
      <PageSection type="nav" style={{ paddingTop: 'unset' }}>
        <PageNavigation />
      </PageSection>
    </>
  );
};
const useActiveNavItem = () => {
  const { search } = useLocation();
  const activeTab = React.useMemo(() => {
    const query = new URLSearchParams(search);
    const tab = query.get('tab');
    return tab ?? 'templates';
  }, [search]);
  return activeTab;
};

const ClusterTemplatesPage = () => {
  const activeTab = useActiveNavItem();
  return (
    <ErrorBoundary>
      <AlertsContextProvider>
        <WithClusterTemplateQuickStarts>
          <Page>
            <PageHeader />
            <Alerts />
            <Stack hasGutter>
              <StackItem>
                <ClusterTemplatesListGettingStarted />
              </StackItem>
              <StackItem>
                <PageSection>
                  {activeTab === 'templates' && <ClusterTemplatesTab />}
                  {activeTab === 'repositories' && <RepositoriesTable />}
                  {activeTab === 'quotas' && <QuotasTab />}
                </PageSection>
              </StackItem>
            </Stack>
          </Page>
        </WithClusterTemplateQuickStarts>
      </AlertsContextProvider>
    </ErrorBoundary>
  );
};

export default ClusterTemplatesPage;
