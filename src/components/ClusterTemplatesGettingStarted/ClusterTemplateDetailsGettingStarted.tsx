import React from 'react';
import GettingStartedGrid from '../../helpers/GettingStarted/GettingStartedGrid';
import { useTranslation } from '../../hooks/useTranslation';
import { TryThisTemplateCard, ShareTemplateCard, CreateTemplateCard } from './GettingStartedCards';

const ClusterTemplateDetailsGettingStarted = ({
  isRedhatTemplate,
  onCreateCluster,
}: {
  isRedhatTemplate: boolean;
  onCreateCluster: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <GettingStartedGrid>
      <TryThisTemplateCard onCreateCluster={onCreateCluster} key="try-this-template" />
      <ShareTemplateCard title={t('Share this template')} />
      {isRedhatTemplate && (
        <CreateTemplateCard
          key="create-template-card"
          description={t(
            'If you want to customize the template to your needs, create a new template based on the community one. Community templates cannot be modified, but are a great starting point for your own.',
          )}
        />
      )}
    </GettingStartedGrid>
  );
};

export default ClusterTemplateDetailsGettingStarted;
