import { Popover, Button, Text, TextContent, PopoverProps } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import React from 'react';
import {
  global_danger_color_100 as dangerColor,
  global_success_color_100 as successColor,
  global_disabled_color_100 as disabledColor,
} from '@patternfly/react-tokens';
import { useTranslation } from '../../hooks/useTranslation';

export enum Status {
  Ready = 'Ready',
  Running = 'Running',
  Failed = 'Failed',
}

const ErrorIcon = <ExclamationCircleIcon color={dangerColor.value} />;

const getStatusIcon = (status: string) => {
  switch (status) {
    case Status.Failed: {
      return ErrorIcon;
    }
    case Status.Running: {
      return <InProgressIcon data-testid="running-icon" color="var(--pf-global--Color--100)" />;
    }
    case Status.Ready: {
      return <CheckCircleIcon color={successColor.value} data-testid="success-icon" />;
    }
    default: {
      return <UnknownIcon color={disabledColor.value} data-testid="unknown-icon" />;
    }
  }
};

type ResourceStatusProps = {
  message?: React.ReactNode;
  errorInstructions?: string;
  status: string;
  statusLabel: string;
};

const StatusWithPopover = ({
  icon,
  message,
  statusLabel,
  errorInstructions,
  status,
}: ResourceStatusProps & { icon: React.ReactNode }) => {
  const { t } = useTranslation();
  const popoverContent = (
    <TextContent style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Text>{message}</Text>
      {errorInstructions && (
        <Text>
          <b>{errorInstructions}</b>
        </Text>
      )}
    </TextContent>
  );
  const popoverProps:
    | Pick<PopoverProps, 'alertSeverityVariant' | 'headerContent' | 'headerIcon'>
    | undefined =
    status === Status.Failed
      ? {
          alertSeverityVariant: 'danger',
          headerIcon: ErrorIcon,
          headerContent: t('Error'),
        }
      : undefined;
  return (
    <Popover bodyContent={popoverContent} {...popoverProps}>
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
