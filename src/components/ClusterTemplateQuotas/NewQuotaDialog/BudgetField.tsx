import { Flex, FlexItem, TextInputTypes } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxField, InputField } from 'formik-pf';
import React from 'react';
import { WithHelpIcon } from '../../../helpers/PopoverHelpIcon';

export type BudgetFieldProps = {
  hasBudgetFieldName: string;
  budgetFieldName: string;
  label: string;
  popoverHelpText?: string;
};

const BudgetField = ({
  budgetFieldName,
  hasBudgetFieldName,
  label,
  popoverHelpText,
}: BudgetFieldProps) => {
  const [{ value: hasBudget }] = useField<boolean>(hasBudgetFieldName);
  const [, , { setValue: setBudget }] = useField<number>(budgetFieldName);
  return (
    <Flex>
      <FlexItem>
        <CheckboxField
          name={hasBudgetFieldName}
          label={
            <WithHelpIcon helpText={popoverHelpText} noVerticalAlign={true}>
              {label}
            </WithHelpIcon>
          }
          fieldId={hasBudgetFieldName}
          onChange={(checked) => !checked && setBudget(undefined)}
        />
      </FlexItem>
      <FlexItem>
        <InputField
          name={budgetFieldName}
          isDisabled={!hasBudget}
          fieldId={budgetFieldName}
          type={TextInputTypes.number}
          autoComplete="off"
        />
      </FlexItem>
    </Flex>
  );
};

export default BudgetField;
