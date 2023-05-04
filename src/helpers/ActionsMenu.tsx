import { Dropdown, DropdownItem, DropdownItemProps, DropdownToggle } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const ActionsMenu = ({
  actions,
  toggleText,
}: {
  actions: DropdownItemProps[];
  toggleText?: string;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-descriptions');
    element?.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = actions.map((action, idx) => (
    <DropdownItem key={idx} {...action}>
      {action.title}
    </DropdownItem>
  ));
  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-descriptions" onToggle={onToggle} toggleVariant="primary">
          {toggleText ? toggleText : t('Actions')}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
      position="right"
    />
  );
};
