import * as React from 'react';
import {
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
  SelectProps,
  SelectOptionObject,
  ValidatedOptions,
} from '@patternfly/react-core';
import { useField } from 'formik';
import { getOptionValueStr } from './formikFieldUtils';
import { FieldProps } from './types';

export type SelectInputOption = {
  value: string | SelectOptionObject;
  disabled: boolean;
  description?: string;
};

type SelectFieldProps = FieldProps & {
  options: SelectInputOption[];
  validate?: () => string;
  helperTextInvalid?: string;
} & Omit<
    SelectProps,
    | 'variant'
    | 'validated'
    | 'onToggle'
    | 'onSelect'
    | 'onClear'
    | 'isOpen'
    | 'selections'
    | 'className'
    | 'toggleId'
    | 'onCreateOption'
  >;
// https://github.com/patternfly-labs/formik-pf/blob/main/src/components/utils.ts
export const getFieldId = (fieldName: string, fieldType: string) =>
  `form-${fieldType}-${fieldName?.replace(/\./g, '-')}-field`;

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  labelIcon,
  options,
  helperText,
  isRequired,
  validate,
  ...props
}) => {
  const [field, { touched, error }, { setValue }] = useField<string | SelectOptionObject>(name);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const errorMessage = validate ? validate() : error;
  const validated = touched && errorMessage ? ValidatedOptions.error : ValidatedOptions.default;
  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect: SelectProps['onSelect'] = (_, value) => {
    setValue(value);
    setIsOpen(false);
  };

  const onClearSelection = () => {
    setValue(undefined);
  };

  const onCreateOption = (newOption: string) => {
    setValue(newOption);
    setIsOpen(false);
  };

  return (
    <FormGroup
      fieldId={name}
      validated={validated}
      label={label}
      labelIcon={labelIcon}
      helperText={helperText}
      helperTextInvalid={errorMessage}
      isRequired={isRequired}
    >
      <Select
        variant={SelectVariant.typeahead}
        validated={validated}
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={onClearSelection}
        isOpen={isOpen}
        selections={field.value}
        typeAheadAriaLabel={props.typeAheadAriaLabel || name}
        toggleId={name}
        onCreateOption={onCreateOption}
        className="cluster-templates-select-field"
        {...props}
      >
        {options.map((op, idx) => {
          const valueStr = getOptionValueStr(op);
          return (
            <SelectOption
              value={op.value}
              isDisabled={op.disabled}
              key={idx}
              name={valueStr}
              description={op.description}
            />
          );
        })}
      </Select>
    </FormGroup>
  );
};

export default SelectField;
