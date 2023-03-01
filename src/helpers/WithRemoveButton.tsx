import { Button, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

type WithRemoveButtonProps = {
  children?: React.ReactNode;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  ariaLabel: string;
};

export const WithRemoveButton = ({
  children,
  onRemove,
  isRemoveDisabled,
  ariaLabel,
}: WithRemoveButtonProps) => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: 'block',
        position: 'relative',
      }}
    >
      <Tooltip content={t('Remove')}>
        <Button
          variant="plain"
          style={{ position: 'absolute', top: '-0.5rem', right: '0' }}
          onClick={onRemove}
          isDisabled={isRemoveDisabled}
          aria-label={ariaLabel}
        >
          <MinusCircleIcon />
        </Button>
      </Tooltip>
      {children}
    </div>
  );
};
