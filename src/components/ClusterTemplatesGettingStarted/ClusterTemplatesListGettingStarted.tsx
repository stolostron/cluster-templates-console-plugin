import React from 'react';
import GettingStartedGrid from '../../helpers/GettingStarted/GettingStartedGrid';
import { useTranslation } from '../../hooks/useTranslation';
import { ShareTemplateCard, CreateTemplateCard } from './GettingStartedCards';

const ClusterTemplatesListGettingStarted = () => {
  const { t } = useTranslation();
  return (
    <GettingStartedGrid>
      <ShareTemplateCard />
      <CreateTemplateCard
        description={t(
          'If you want to customize the template to your needs, create a new template based on the community one. Community templates cannot be modified, but are a great starting point for your own.',
        )}
        key="create-template-card"
      />
    </GettingStartedGrid>
  );
};

export default ClusterTemplatesListGettingStarted;
