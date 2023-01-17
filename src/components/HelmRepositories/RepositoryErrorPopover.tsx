import { Button, ButtonVariant, Popover } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import React from 'react';

type RepositoryErrorPopoverProps = { error: string };
function RepositoryErrorPopover({ error }: RepositoryErrorPopoverProps) {
  const icon = <ExclamationCircleIcon color={dangerColor.value} />;
  return (
    <Popover
      headerContent="Error"
      headerIcon={icon}
      alertSeverityVariant="danger"
      bodyContent={<div>{error}</div>}
    >
      <Button variant={ButtonVariant.link} isInline>
        {icon}
      </Button>
    </Popover>
  );
}

export default RepositoryErrorPopover;
