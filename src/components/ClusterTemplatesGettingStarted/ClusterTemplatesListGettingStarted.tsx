import React from 'react';
import GettingStartedGrid from '../../helpers/GettingStarted/GettingStartedGrid';
import { useTranslation } from '../../hooks/useTranslation';
import { ShareTemplateCard, CreateTemplateCard } from './GettingStartedCards';

const ClusterTemplatesListGettingStarted = () => {
  const { t } = useTranslation();
  return (
    <GettingStartedGrid>
      <ShareTemplateCard title={t('Share a template')} />
      <CreateTemplateCard
        description={t(
          'The best way to get started is to use a community template and modify it per your needs.',
        )}
        key="create-template-card"
      />
    </GettingStartedGrid>
  );
};

export default ClusterTemplatesListGettingStarted;
