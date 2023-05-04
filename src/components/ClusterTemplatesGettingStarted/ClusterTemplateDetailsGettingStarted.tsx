import React from 'react';
import GettingStartedGrid from '../../helpers/GettingStarted/GettingStartedGrid';
import { TryThisTemplateCard, ShareTemplateCard, CreateTemplateCard } from './GettingStartedCards';

const ClusterTemplateDetailsGettingStarted = ({
  isRedhatTemplate,
  onCreateCluster,
}: {
  isRedhatTemplate: boolean;
  onCreateCluster: () => void;
}) => {
  return (
    <GettingStartedGrid>
      <TryThisTemplateCard onCreateCluster={onCreateCluster} key="try-this-template" />
      <ShareTemplateCard />
      {isRedhatTemplate && <CreateTemplateCard key="create-template-card" />}
    </GettingStartedGrid>
  );
};

export default ClusterTemplateDetailsGettingStarted;
