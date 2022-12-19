import * as React from 'react';
import { SyncMarkdownView } from '@openshift-console/plugin-shared';
import { ClusterTemplate } from '../../types';

const DESCRIPTION_ANNOTATION_KEY = 'clustertemplate.openshift.io/description';

const DescriptionSection: React.FC<{ clusterTemplate: ClusterTemplate }> = ({
  clusterTemplate,
}) => {
  const description = clusterTemplate.metadata?.annotations?.[DESCRIPTION_ANNOTATION_KEY];
  return <SyncMarkdownView emptyMsg="foo" content={description} />;
};

export default DescriptionSection;
