import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

import {
  ClusterTemplateInstance,
  ClusterTemplateInstanceStatusPhase,
} from '../../types/resourceTypes';
import ResourceStatus, { Status } from '../sharedDetailItems/ResourceStatus';

const getStatus = (
  phase: ClusterTemplateInstanceStatusPhase,
): Status | ClusterTemplateInstanceStatusPhase => {
  switch (phase) {
    case ClusterTemplateInstanceStatusPhase.HelmChartInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreateFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupFailed:
    case ClusterTemplateInstanceStatusPhase.CredentialsFailed: {
      return Status.Failed;
    }
    case ClusterTemplateInstanceStatusPhase.PendingPhase:
    case ClusterTemplateInstanceStatusPhase.PendingMessage:
    case ClusterTemplateInstanceStatusPhase.ClusterInstalling:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreating:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupRunning: {
      return Status.Running;
    }
    case ClusterTemplateInstanceStatusPhase.Ready: {
      return Status.Ready;
    }
    default: {
      return phase;
    }
  }
};

const getStatusLabel = (t: TFunction, phase: ClusterTemplateInstanceStatusPhase): string => {
  switch (phase) {
    case ClusterTemplateInstanceStatusPhase.HelmChartInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreateFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupFailed:
    case ClusterTemplateInstanceStatusPhase.CredentialsFailed: {
      return t('Failed');
    }
    case ClusterTemplateInstanceStatusPhase.PendingPhase:
    case ClusterTemplateInstanceStatusPhase.PendingMessage: {
      return t('Pending');
    }
    case ClusterTemplateInstanceStatusPhase.ClusterInstalling: {
      return t('Installing');
    }
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreating:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupRunning: {
      return t('Post install configuration');
    }
    case ClusterTemplateInstanceStatusPhase.Ready: {
      return t('Ready');
    }
    default: {
      return phase;
    }
  }
};

const ClusterTemplateInstanceStatus: React.FC<{
  instance: ClusterTemplateInstance;
}> = ({ instance }) => {
  const { t } = useTranslation();
  const phase = instance.status?.phase;
  if (!phase) {
    return <>-</>;
  }
  return (
    <ResourceStatus
      message={instance.status?.message || ''}
      statusLabel={getStatusLabel(t, phase)}
      status={getStatus(phase)}
    />
  );
};

export default ClusterTemplateInstanceStatus;
