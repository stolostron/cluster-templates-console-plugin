import { Label } from '@patternfly/react-core';
import * as React from 'react';
import { applicationSetGVK } from '../../constants';
import CellLoader from '../../helpers/CellLoader';
import ExternalLink from '../../helpers/ExternalLink';
import NotAvailable from '../../helpers/NotAvailable';
import useArgocdNamespace from '../../hooks/useArgocdNamespace';

import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { useClusterTemplateQuotas } from '../../hooks/useQuotas';

import { useTranslation } from '../../hooks/useTranslation';
import {
  ClusterSetup,
  DeserializedClusterTemplate,
  ClusterTemplateVendor,
} from '../../types/resourceTypes';
import { getClusterTemplateVendor } from '../../utils/clusterTemplateDataUtils';
import { getResourceUrl } from '../../utils/k8s';
import ResourceStatus, { Status } from './ResourceStatus';

export const ClusterTemplateUsage = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => {
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

export const ClusterTemplateVendorLabel = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => {
  const { t } = useTranslation();
  const vendor = getClusterTemplateVendor(clusterTemplate);
  if (!vendor) {
    return <NotAvailable />;
  }
  const color = vendor === ClusterTemplateVendor.REDHAT ? 'green' : 'purple';
  const labelText = vendor === ClusterTemplateVendor.REDHAT ? t('Red Hat') : t('Custom');
  return <Label color={color}>{labelText}</Label>;
};

export const ApplicationSetLink = ({ appSetName }: { appSetName: string }) => {
  const [namespace, loaded, error] = useArgocdNamespace();

  return (
    <>
      <CellLoader loaded={loaded} error={error}>
        <ExternalLink href={`${getResourceUrl(applicationSetGVK, appSetName, namespace)}/yaml`}>
          {appSetName}
        </ExternalLink>
      </CellLoader>
    </>
  );
};

export const InstallationDetails = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => <ApplicationSetLink appSetName={clusterTemplate.spec.clusterDefinitionName} />;

export const PostInstallationDetails = ({
  clusterSetup,
}: {
  clusterSetup: ClusterSetup | undefined;
}) => {
  return clusterSetup && clusterSetup.length > 0 ? (
    <div>
      {clusterSetup.map(({ name }) => (
        <div key={name}>
          <ApplicationSetLink appSetName={name} />
        </div>
      ))}
    </div>
  ) : (
    <NotAvailable />
  );
};

export const ClusterTemplateQuotasSummary = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => {
  const [quotas, loaded, loadError] = useClusterTemplateQuotas(
    clusterTemplate.metadata?.name || '',
  );
  return (
    <CellLoader loaded={loaded} error={loadError}>
      {quotas.length}
    </CellLoader>
  );
};

export const ClusterTemplateStatus = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => {
  const { t } = useTranslation();
  const templateStatus = clusterTemplate.status;
  if (!templateStatus) {
    return <>-</>;
  }
  const { label, status, message }: { label: string; status: Status; message?: string } =
    templateStatus.error
      ? {
          label: t('Failed'),
          message: templateStatus.error,
          status: Status.Failed,
        }
      : {
          label: t('Ready'),
          status: Status.Ready,
        };
  return (
    <ResourceStatus
      message={message}
      statusLabel={label}
      status={status}
      errorInstructions={templateStatus.errorInstructions}
    />
  );
};
