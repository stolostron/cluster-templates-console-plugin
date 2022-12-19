import { Button, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './styles.css';

type WithRemoveButtonProps = {
  children: React.ReactNode;
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
    <div className="cluster-templates-removable-item">
      <Tooltip content={t('Remove')}>
        <Button
          variant="plain"
          className="cluster-templates-remove-button"
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
