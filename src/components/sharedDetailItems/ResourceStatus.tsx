import { Popover, Button, Text, TextContent } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  RunningIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import React from 'react';

export enum Status {
  Ready = 'Ready',
  Running = 'running',
  Failed = 'Failed',
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case Status.Failed: {
      return (
        <ExclamationCircleIcon
          color="var(--pf-global--danger-color--100)"
          data-testid="failed-icon"
        />
      );
    }
    case Status.Running: {
      return (
        <RunningIcon color="var(--pf-global--success-color--100)" data-testid="running-icon" />
      );
    }
    case Status.Ready: {
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

type ResourceStatusProps = {
  message?: string;
  errorInstructions?: string;
  status: string;
  statusLabel: string;
};

const StatusWithPopover = ({
  icon,
  message,
  statusLabel,
  errorInstructions,
}: ResourceStatusProps & { icon: React.ReactNode }) => {
  const popoverContent = (
    <TextContent>
      <Text>{message}</Text>
      {errorInstructions && (
        <Text>
          <b>{errorInstructions}</b>
        </Text>
      )}
    </TextContent>
  );
  return (
    <Popover bodyContent={popoverContent}>
      <Button variant={message ? 'link' : 'plain'} style={{ paddingLeft: 'unset' }} icon={icon}>
        {statusLabel}
      </Button>
    </Popover>
  );
};

const ResourceStatus = (props: ResourceStatusProps) => {
  const icon = getStatusIcon(props.status);
  return props.message ? (
    <StatusWithPopover {...props} icon={icon} />
  ) : (
    <Text>
      <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>{icon}</span>
      {props.statusLabel}
    </Text>
  );
};

export default ResourceStatus;
