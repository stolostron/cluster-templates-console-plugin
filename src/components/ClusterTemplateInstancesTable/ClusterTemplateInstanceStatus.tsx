import { Button, Popover } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  RunningIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

import {
  ClusterTemplateInstance,
  ClusterTemplateInstanceStatusPhase,
} from '../../types/resourceTypes';

const getStatusIcon = (phase: ClusterTemplateInstanceStatusPhase): React.ReactNode => {
  switch (phase) {
    case ClusterTemplateInstanceStatusPhase.HelmChartInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterInstallFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreateFailed:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupFailed:
    case ClusterTemplateInstanceStatusPhase.CredentialsFailed: {
      return (
        <ExclamationCircleIcon
          color="var(--pf-global--danger-color--100)"
          data-testid="failed-icon"
        />
      );
    }
    case ClusterTemplateInstanceStatusPhase.PendingPhase:
    case ClusterTemplateInstanceStatusPhase.PendingMessage:
    case ClusterTemplateInstanceStatusPhase.ClusterInstalling:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupCreating:
    case ClusterTemplateInstanceStatusPhase.ClusterSetupRunning: {
      return (
        <RunningIcon color="var(--pf-global--success-color--100)" data-testid="running-icon" />
      );
    }
    case ClusterTemplateInstanceStatusPhase.Ready: {
      return (
        <CheckCircleIcon color="var(--pf-global--success-color--100)" data-testid="success-icon" />
      );
    }
    default: {
      return (
        <UnknownIcon color="var(--pf-global--disabled-color--100)" data-testid="unknown-icon" />
      );
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
    <Popover bodyContent={instance.status?.message}>
      <Button icon={getStatusIcon(phase)} variant="link" style={{ paddingLeft: 'unset' }}>
        {getStatusLabel(t, phase)}
      </Button>
    </Popover>
  );
};

export default ClusterTemplateInstanceStatus;
