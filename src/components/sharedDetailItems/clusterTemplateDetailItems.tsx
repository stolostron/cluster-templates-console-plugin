import * as React from 'react';
import { Flex, FlexItem, Text } from '@patternfly/react-core';
import CellLoader from '../../helpers/CellLoader';
import NotAvailable from '../../helpers/NotAvailable';
import useArgocdNamespace from '../../hooks/useArgocdNamespace';

import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import { useClusterTemplateQuotas } from '../../hooks/useQuotas';

import { useTranslation } from '../../hooks/useTranslation';
import { ClusterSetup, DeserializedClusterTemplate } from '../../types/resourceTypes';
import ResourceStatus, { Status } from './ResourceStatus';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { applicationSetGVK } from '../../constants';

export const ClusterTemplateUsage = ({
  clusterTemplate,
}: {
  clusterTemplate: DeserializedClusterTemplate;
}) => {
  const [instances, loaded, loadError] = useClusterTemplateInstances(
    clusterTemplate.metadata?.name,
  );
  return (
    <CellLoader loaded={loaded} error={loadError}>
      {instances.length}
    </CellLoader>
  );
};

export const ApplicationSetLink = ({ appSetName }: { appSetName: string }) => {
  const [namespace, loaded, error] = useArgocdNamespace();
  const { t } = useTranslation();
  return (
    <>
      <CellLoader loaded={loaded} error={error}>
        <Flex>
          <FlexItem spacer={{ default: 'spacerXs' }}>
            <Text style={{ display: 'inline' }}>{t('ApplicationSet')}</Text>
          </FlexItem>
          <FlexItem>
            <ResourceLink
              groupVersionKind={applicationSetGVK}
              name={appSetName}
              namespace={namespace}
              hideIcon={true}
            />
          </FlexItem>
        </Flex>
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
