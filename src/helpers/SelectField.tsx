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
import { FieldProps } from './types';
import CellLoader from './CellLoader';

export type SelectInputOption =
  | {
      value: string | SelectOptionObject;
      disabled: boolean;
      description?: string;
    }
  | string;

type SelectFieldProps = FieldProps & {
  options: SelectInputOption[];
  validate?: () => string;
  helperTextInvalid?: string;
  onSelectValue?: (value: string | SelectOptionObject) => void;
  value?: string | SelectOptionObject;
  loaded?: boolean;
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
  onSelectValue,
  value,
  loaded = true,
  ...props
}) => {
  const [field, { touched, error, initialValue }, { setValue }] = useField<
    string | SelectOptionObject
  >(name);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const errorMessage = validate ? validate() : error;
  const validated = touched && errorMessage ? ValidatedOptions.error : ValidatedOptions.default;
  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const _setValue = (value) => {
    setValue(value, true);
    onSelectValue && onSelectValue(value);
  };

  const onSelect: SelectProps['onSelect'] = (_, value) => {
    setIsOpen(false);
    _setValue(value);
  };

  const onClearSelection = () => {
    _setValue(initialValue);
  };

  const onCreateOption = (newOption: string) => {
    _setValue(newOption);
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
      <CellLoader loaded={loaded} fontSize="2xl">
        <Select
          variant={SelectVariant.typeahead}
          validated={validated}
          onToggle={onToggle}
          onSelect={onSelect}
          onClear={isRequired ? undefined : onClearSelection}
          isOpen={isOpen}
          selections={value || field.value}
          typeAheadAriaLabel={props.typeAheadAriaLabel || name}
          toggleId={name}
          onCreateOption={onCreateOption}
          className="cluster-templates-select-field"
          {...props}
        >
          {options.map((op, idx) => {
            const isStr = typeof op === 'string';
            return (
              <SelectOption
                value={isStr ? op : op.value}
                isDisabled={isStr ? false : op.disabled}
                key={idx}
                name={op.toString()}
                description={isStr ? '' : op.description}
              />
            );
          })}
        </Select>
      </CellLoader>
    </FormGroup>
  );
};

export default SelectField;
