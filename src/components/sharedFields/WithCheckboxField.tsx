import { Stack, StackItem } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxField } from 'formik-pf';
import React from 'react';
import { WithHelpIcon } from '../../helpers/PopoverHelpIcon';

type WithCheckboxFieldProps = {
  checkboxFieldName: string;
  label: string;
  popoverHelpText?: React.ReactNode;
  isDisabled?: boolean;
  children: React.ReactNode;
  onChange?: (checked: boolean) => void;
  showChlidren?: boolean;
};

const WithCheckboxField = ({
  checkboxFieldName,
  label,
  popoverHelpText,
  isDisabled,
  onChange,
  children,
  showChlidren,
}: WithCheckboxFieldProps) => {
  const [{ value }] = useField<boolean>(checkboxFieldName);
  const _showChildren = showChlidren ?? (value && !isDisabled);
  return (
    <Stack hasGutter>
      <StackItem style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}>
        <CheckboxField
          name={checkboxFieldName}
          label={<WithHelpIcon helpText={popoverHelpText}>{label}</WithHelpIcon>}
          fieldId={checkboxFieldName}
          onChange={(checked) => onChange && onChange(!!checked)}
          isDisabled={isDisabled}
        />
      </StackItem>
      {_showChildren && <StackItem style={{ marginLeft: '20px' }}>{children}</StackItem>}
    </Stack>
  );
};

export default WithCheckboxField;
