import { Label } from '@patternfly/react-core';
import * as React from 'react';
import CellLoader from '../../helpers/CellLoader';
import NotAvailable from '../../helpers/NotAvailable';

import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { useClusterTemplateQuotas } from '../../hooks/useQuotas';

import { useTranslation } from '../../hooks/useTranslation';
import { ClusterSetup, ClusterTemplate, ClusterTemplateVendor } from '../../types/resourceTypes';
import { getClusterTemplateVendor } from '../../utils/clusterTemplateDataUtils';
import ArgoCDSpecDetails from './ArgoCDSpecDetails';

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

export const PostInstallationDetails = ({
  clusterSetup,
}: {
  clusterSetup: ClusterSetup | undefined;
}) => {
  return clusterSetup && clusterSetup.length > 0 ? (
    <>
      {clusterSetup.map(({ spec }) => (
        <ArgoCDSpecDetails argocdSpec={spec} key={spec.source.repoURL} />
      ))}
    </>
  ) : (
    <NotAvailable />
  );
};

export const InstallationDetails = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => (
  <ArgoCDSpecDetails argocdSpec={clusterTemplate.spec.clusterDefinition} />
);

export const ClusterTemplateQuotasSummary: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const [quotas, loaded, loadError] = useClusterTemplateQuotas(
    clusterTemplate.metadata?.name || '',
  );
  return (
    <CellLoader loaded={loaded} error={loadError}>
      {quotas.length}
    </CellLoader>
  );
};
