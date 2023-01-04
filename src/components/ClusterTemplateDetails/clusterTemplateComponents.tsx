import { Label } from '@patternfly/react-core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import CellLoader from '../../helpers/CellLoader';

import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplate, ClusterTemplateVendor } from '../../types';
import {
  getClusterDefinitionHelmChart,
  getClusterTemplateVendor,
  isHelmClusterDefinition,
} from '../../utils/clusterTemplateDataUtils';

export const ClusterTemplateUsage: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const [instances, loaded, loadError] = useClusterTemplateInstances(
    clusterTemplate.metadata?.name,
  );
  return (
    <CellLoader loaded={loaded} error={loadError}>
      {t('{{count}} cluster', {
        count: instances.length,
      })}
    </CellLoader>
  );
};

export const ClusterTemplateVendorLabel: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const vendor = getClusterTemplateVendor(clusterTemplate);
  if (!vendor) {
    return <>-</>;
  }
  const color = vendor === ClusterTemplateVendor.REDHAT ? 'green' : 'purple';
  const labelText =
    vendor === ClusterTemplateVendor.REDHAT ? t('Red Hat template') : t('Custom template');
  return <Label color={color}>{labelText}</Label>;
};

export const ClusterTemplateHelmResourceLink: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  return isHelmClusterDefinition(clusterTemplate) ? (
    <Link
      to={{
        pathname: clusterTemplate.spec.clusterDefinition.source.repoURL,
      }}
    >
      {clusterTemplate.spec.clusterDefinition.source.repoURL}
    </Link>
  ) : (
    <>-</>
  );
};

export const ClusterTemplateHelmChart: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => (
  <>
    {isHelmClusterDefinition(clusterTemplate)
      ? getClusterDefinitionHelmChart(clusterTemplate)
      : '-'}
  </>
);
export const ClusterTemplateCost: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return <>{`${clusterTemplate.spec.cost} / ${t('Per use')}`}</>;
};
