import { RouteIcon } from '@patternfly/react-icons';
import React from 'react';
import ErrorState from '../../helpers/ErrorState';
import GettingStartedCard, {
  GettingStartedLink,
} from '../../helpers/GettingStarted/GettingStartedCard';
import { QuickStartContext, QuickStartContextValues } from '@patternfly/quickstarts';
import { useTranslation } from '../../hooks/useTranslation';
import { QuickStartKey, quickStartsData } from './quickStartConstants';
import { TFunction } from 'react-i18next';

const getQuickStartLink = (
  qsCtx: QuickStartContextValues,
  t: TFunction,
  quickStartKey: QuickStartKey,
): GettingStartedLink => ({
  title: t(quickStartsData[quickStartKey].title),
  onClick: () =>
    qsCtx.setActiveQuickStart && qsCtx.setActiveQuickStart(quickStartsData[quickStartKey].name),
  id: quickStartsData[quickStartKey].name,
});

export const TryThisTemplateCard = ({ onCreateCluster }: { onCreateCluster: () => void }) => {
  const { t } = useTranslation();
  return (
    <GettingStartedCard
      id={'try-this-template-card'}
      title={t('Try this template')}
      titleColor={'var(--pf-global--palette--purple-700)'}
      icon={<RouteIcon />}
      description={t(
        'Make sure the template fits your needs before you share it by creating a cluster from it.',
      )}
      links={[
        {
          title: t('Create a cluster from this template'),
          onClick: () => onCreateCluster(),
          id: 'try-this-template',
        },
      ]}
    />
  );
};

export const CreateTemplateCard = ({ description }: { description: string }) => {
  const qsCtx = React.useContext(QuickStartContext);
  const { t } = useTranslation();
  if (!qsCtx || !qsCtx.setActiveQuickStart) {
    return (
      <ErrorState error={'QuickStartContext should be used without QuickStartContextProvider'} />
    );
  }
  return (
    <GettingStartedCard
      id={'create-template-card'}
      title={t('Create your own template')}
      titleColor={'var(--pf-global--info-color--200)'}
      description={description}
      links={[getQuickStartLink(qsCtx, t, 'createTemplate')]}
    />
  );
};

export const ShareTemplateCard = () => {
  const qsCtx = React.useContext(QuickStartContext);
  const { t } = useTranslation();
  if (!qsCtx || !qsCtx.setActiveQuickStart) {
    return (
      <ErrorState error={t('QuickStartContext should be used without QuickStartContextProvider')} />
    );
  }
  return (
    <GettingStartedCard
      id={'share-template-card'}
      title={t('Share this template')}
      titleColor={'var(--pf-global--info-color--200)'}
      description={t(
        'To enable unprivileged developers to create clusters, you’ll need to provide them with a namespace configured with the required permissions.',
      )}
      links={[
        getQuickStartLink(qsCtx, t, 'shareTemplate'),
        getQuickStartLink(qsCtx, t, 'createQuota'),
      ]}
    />
  );
};
