import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export type Action = {
  onClick: () => void;
  title: string;
};

export const ActionsMenu = ({ actions }: { actions: Action[] }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-descriptions');
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = actions.map((action, idx) => (
    <DropdownItem onClick={action.onClick} key={idx}>
      {action.title}
    </DropdownItem>
  ));
  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-descriptions" onToggle={onToggle}>
          {t('Actions')}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};
