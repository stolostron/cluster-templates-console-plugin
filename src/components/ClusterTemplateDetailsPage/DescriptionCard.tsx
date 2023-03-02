import * as React from 'react';
import { MarkdownView } from '@openshift-console/plugin-shared';
import { TEMPLATE_LABELS } from '../../utils/clusterTemplateDataUtils';
import { ClusterTemplate } from '../../types/resourceTypes';

const DescriptionCard: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const description = clusterTemplate.metadata?.annotations?.[TEMPLATE_LABELS.description];
  return <MarkdownView emptyMsg="" content={description} />;
};

export default DescriptionCard;
