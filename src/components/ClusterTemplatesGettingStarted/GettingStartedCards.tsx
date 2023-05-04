import { RouteIcon } from '@patternfly/react-icons';
import React from 'react';
import ErrorState from '../../helpers/ErrorState';
import GettingStartedCard from '../../helpers/GettingStarted/GettingStartedCard';
import { QuickStartContext } from '@patternfly/quickstarts';

export const TryThisTemplateCard = ({ onCreateCluster }: { onCreateCluster: () => void }) => {
  return (
    <GettingStartedCard
      id={'try-this-template-card'}
      title={'Try this template'}
      titleColor={'var(--pf-global--palette--purple-700)'}
      icon={<RouteIcon />}
      description={
        'Make sure the template fits your needs before you share it by creating a cluster from it.'
      }
      links={[
        {
          title: 'Create a cluster from this template',
          onClick: () => onCreateCluster(),
          id: 'try-this-template',
        },
      ]}
    />
  );
};

export const CreateTemplateCard = () => {
  const qsCtx = React.useContext(QuickStartContext);
  if (!qsCtx || !qsCtx.setActiveQuickStart) {
    return (
      <ErrorState error={'QuickStartContext should be used without QuickStartContextProvider'} />
    );
  }
  return (
    <GettingStartedCard
      id={'create-template-card'}
      title={'Create your own template'}
      titleColor={'var(--pf-global--info-color--200)'}
      description={
        'If you want to customize the template to your needs, create a new template based on the community one. Community templates cannot be modified, but are a great starting point for your own.'
      }
      links={[
        {
          title: 'Create a new cluster template',
          onClick: () =>
            qsCtx.setActiveQuickStart && qsCtx.setActiveQuickStart('create-cluster-template-qs'),
          id: 'create-custom-template',
        },
      ]}
    />
  );
};

export const ShareTemplateCard = () => {
  const qsCtx = React.useContext(QuickStartContext);
  if (!qsCtx || !qsCtx.setActiveQuickStart) {
    return (
      <ErrorState error={'QuickStartContext should be used without QuickStartContextProvider'} />
    );
  }
  return (
    <GettingStartedCard
      id={'share-template-card'}
      title={'Share this template'}
      titleColor={'var(--pf-global--info-color--200)'}
      description={
        'To enable unprivileged developers to create clusters, you’ll need to provide them with a namespace configured with the required permissions.'
      }
      links={[
        {
          title: 'Give access to a cluster template',
          onClick: () =>
            qsCtx.setActiveQuickStart && qsCtx.setActiveQuickStart('share-template-qs'),
          id: 'give-access',
        },
        {
          title: 'Limit cluster template access using quotas',
          onClick: () => qsCtx.setActiveQuickStart && qsCtx.setActiveQuickStart('create-quota-qs'),
          id: 'give-access',
        },
      ]}
    />
  );
};
