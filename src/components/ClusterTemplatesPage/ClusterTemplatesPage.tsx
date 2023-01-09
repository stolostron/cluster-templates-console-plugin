import * as React from 'react';
import { ListPageCreateDropdown, ListPageHeader } from '@openshift-console/dynamic-plugin-sdk';
import { useHistory, useLocation } from 'react-router-dom';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import ClusterTemplatesTab from './ClusterTemplatesTab';
import HelmRepositoriesTab from './HelmRepositoriesTab';
import { useClusterTemplatesCount } from '../../hooks/useClusterTemplates';

import { clusterTemplateGVK } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { getNavLabelWithCount } from '../../utils/utils';
import { getReference, getResourceUrl } from '../../utils/k8s';
import { useHelmRepositoriesCount } from '../../hooks/useHelmRepositories';
import useDialogsReducer from '../../hooks/useDialogsReducer';
import NewHelmRepositoryDialog from '../HelmRepositories/NewHelmRepositoryDialog';

type ActionDialogIds = 'newHelmRepositoryDialog';
const actionDialogIds: ActionDialogIds[] = ['newHelmRepositoryDialog'];

const useActiveTab = () => {
  const { search } = useLocation();
  const activeTab = React.useMemo(() => {
    const query = new URLSearchParams(search);
    return query.get('tab') === 'repositories' ? 'repositories' : 'templates';
  }, [search]);
  return activeTab;
};

const ClusterTemplatesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const templatesCount = useClusterTemplatesCount();
  const helmRepositoriesCount = useHelmRepositoriesCount();
  const activeTab = useActiveTab();
  const { openDialog, closeDialog, isDialogOpen } = useDialogsReducer(actionDialogIds);

  const actionItems = React.useMemo(
    () => ({
      NEW_CLUSTER_TEMPLATE: t('Cluster template'),
      NEW_HELM_CHART_REPOSITORY: t('HELM repository'),
    }),
    [t],
  );

  const handleTabSelect: React.ComponentProps<typeof Tabs>['onSelect'] = (_, eventKey) => {
    switch (eventKey) {
      case 'repositories':
        history.push(`${getResourceUrl(clusterTemplateGVK)}?tab=repositories`);
        break;
      default:
        history.push(getResourceUrl(clusterTemplateGVK));
    }
  };

  const handleCreateDropdownActionClick = (item: string) => {
    switch (item) {
      case 'NEW_CLUSTER_TEMPLATE':
        history.push(`${getResourceUrl(clusterTemplateGVK)}/~new`);
        break;
      case 'NEW_HELM_CHART_REPOSITORY':
        openDialog('newHelmRepositoryDialog');
        break;
    }
  };

  return (
    <>
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
                {getNavLabelWithCount('HELM repositories', helmRepositoriesCount)}
              </TabTitleText>
            }
            aria-label="HELM repositories tab"
          />
        </Tabs>
        {activeTab === 'repositories' ? <HelmRepositoriesTab /> : <ClusterTemplatesTab />}
        {isDialogOpen('newHelmRepositoryDialog') && (
          <NewHelmRepositoryDialog closeDialog={() => closeDialog('newHelmRepositoryDialog')} />
        )}
      </div>
    </>
  );
};

export default ClusterTemplatesPage;
