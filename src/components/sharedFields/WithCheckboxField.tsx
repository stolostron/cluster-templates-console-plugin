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
  condition?: () => boolean;
};

const WithCheckboxField = ({
  checkboxFieldName,
  label,
  popoverHelpText,
  isDisabled,
  onChange,
  children,
  condition,
}: WithCheckboxFieldProps) => {
  const [{ value }] = useField<boolean>(checkboxFieldName);
  const showChildren = condition ? condition() : value && !isDisabled;
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
      {showChildren && <StackItem style={{ marginLeft: '20px' }}>{children}</StackItem>}
    </Stack>
  );
};

export default WithCheckboxField;
