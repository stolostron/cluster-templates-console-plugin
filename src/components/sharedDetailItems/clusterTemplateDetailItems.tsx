import { Label } from '@patternfly/react-core';
import * as React from 'react';
import CellLoader from '../../helpers/CellLoader';

import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplate, ClusterTemplateVendor } from '../../types';
import { getClusterTemplateVendor } from '../../utils/clusterTemplateDataUtils';
import ArgoCDSpecDetails from './ArgoCDSpecDetails';

const NotAvailable = () => <>-</>;

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
    return <NotAvailable />;
  }
  const color = vendor === ClusterTemplateVendor.REDHAT ? 'green' : 'purple';
  const labelText =
    vendor === ClusterTemplateVendor.REDHAT ? t('Red Hat template') : t('Custom template');
  return <Label color={color}>{labelText}</Label>;
};

export const ClusterTemplateCost: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return <>{`${clusterTemplate.spec.cost} / ${t('Per instance')}`}</>;
};

export const PostInstallationDetails = ({
  clusterTemplate,
}: {
  clusterTemplate: ClusterTemplate;
}) => {
  return clusterTemplate.spec.clusterSetup && clusterTemplate.spec.clusterSetup.length > 0 ? (
    <>
      {clusterTemplate.spec.clusterSetup.map(({ spec }) => (
        <ArgoCDSpecDetails argocdSpec={spec} key={spec.source.repoURL} />
      ))}
    </>
  ) : (
    <>-</>
  );
};

export const InstallationDetails = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => (
  <ArgoCDSpecDetails argocdSpec={clusterTemplate.spec.clusterDefinition} />
);
