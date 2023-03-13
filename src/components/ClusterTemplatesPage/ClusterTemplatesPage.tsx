import * as React from 'react';
import { ListPageCreateDropdown, ListPageHeader } from '@openshift-console/dynamic-plugin-sdk';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import ClusterTemplatesTab from './ClusterTemplatesTab';
import RepositoriesTab from './RepositoriesTab';
import { useClusterTemplatesCount } from '../../hooks/useClusterTemplates';
import { clusterTemplateGVK } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { getNavLabelWithCount } from '../../utils/utils';
import { getReference } from '../../utils/k8s';
import { useArgoCDSecretsCount } from '../../hooks/useArgoCDSecrets';
import useDialogsReducer from '../../hooks/useDialogsReducer';
import NewRepositoryDialog from '../HelmRepositories/NewRepositoryDialog';
import QuotasTab from './QuotasTab';
import { useQuotasCount } from '../../hooks/useQuotas';
import { useNavigation } from '../../hooks/useNavigation';
import ErrorBoundary from '../../helpers/ErrorBoundary';

type ActionDialogIds = 'newRepositoryDialog';
const actionDialogIds: ActionDialogIds[] = ['newRepositoryDialog'];

const useActiveTab = () => {
  const { search } = useLocation();
  const activeTab = React.useMemo(() => {
    const query = new URLSearchParams(search);
    const tab = query.get('tab');
    return tab ?? 'templates';
  }, [search]);
  return activeTab;
};

const ClusterTemplatesPage = () => {
  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(actionDialogIds);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const templatesCount = useClusterTemplatesCount();
  const argoCDSecretsCount = useArgoCDSecretsCount();
  const activeTab = useActiveTab();
  const quotasCount = useQuotasCount();

  const actionItems = React.useMemo(
    () => ({
      NEW_CLUSTER_TEMPLATE: t('Cluster template'),
      NEW_REPOSITORY: t('Repository'),
      NEW_QUOTA: t('Quota'),
    }),
    [t],
  );

  const handleTabSelect: React.ComponentProps<typeof Tabs>['onSelect'] = (_, eventKey) => {
    switch (eventKey) {
      case 'repositories':
      case 'quotas':
        navigation.goToClusterTemplatesPage(eventKey);
        break;
      default:
        navigation.goToClusterTemplatesPage();
    }
  };

  const handleCreateDropdownActionClick = (item: string) => {
    switch (item) {
      case 'NEW_CLUSTER_TEMPLATE':
        navigation.goToClusterTemplateCreatePage();
        break;
      case 'NEW_REPOSITORY':
        openDialog('newRepositoryDialog');
        break;
      case 'NEW_QUOTA':
        navigation.goToQuotaCreatePage();
        break;
    }
  };

  return (
    <ErrorBoundary>
      <ListPageHeader title="Cluster templates">
        <ListPageCreateDropdown
          createAccessReview={{ groupVersionKind: getReference(clusterTemplateGVK) }}
          items={actionItems}
          onClick={handleCreateDropdownActionClick}
        >
          {t('Create')}
        </ListPageCreateDropdown>
      </ListPageHeader>
      <div className="co-m-page__body">
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
          aria-label="Cluster templates page tabs"
          role="resource-list-tabs"
          usePageInsets
        >
          <Tab
            eventKey="templates"
            title={<TabTitleText>{getNavLabelWithCount('Templates', templatesCount)}</TabTitleText>}
            aria-label="Cluster templates tab"
          />
          <Tab
            eventKey="repositories"
            title={
              <TabTitleText>
                {getNavLabelWithCount('Helm repositories', argoCDSecretsCount)}
              </TabTitleText>
            }
            aria-label="Repositories tab"
          />
          <Tab
            eventKey="quotas"
            title={<TabTitleText>{getNavLabelWithCount('Quotas', quotasCount)}</TabTitleText>}
            aria-label="Quotas"
          />
        </Tabs>
        {activeTab === 'templates' && <ClusterTemplatesTab />}
        {activeTab === 'repositories' && (
          <RepositoriesTab openNewRepositoryDialog={() => openDialog('newRepositoryDialog')} />
        )}
        {activeTab === 'quotas' && <QuotasTab />}
        {isDialogOpen('newRepositoryDialog') && (
          <NewRepositoryDialog closeDialog={() => closeDialog('newRepositoryDialog')} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ClusterTemplatesPage;
