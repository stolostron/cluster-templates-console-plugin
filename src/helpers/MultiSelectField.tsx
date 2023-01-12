import * as React from 'react';
import { useField } from 'formik';
import {
  FormGroup,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectProps,
  SelectVariant,
  ValidatedOptions,
} from '@patternfly/react-core';
import { selectValuesEqual } from './formikFieldUtils';
import { FieldProps } from './types';

type MultiSelectFieldProps = FieldProps & {
  options: string[];
} & Omit<
    SelectProps,
    'variant' | 'validated' | 'isOpen' | 'onToggle' | 'onSelect' | 'selections' | 'onClear'
  >;
const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  required,
  labelIcon,
  helperText,
  name,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [field, { touched, error }, { setValue }] = useField<(SelectOptionObject | string)[]>(name);
  const validated = touched && error ? ValidatedOptions.error : ValidatedOptions.default;
  const onToggle = (isOpen: boolean) => setOpen(isOpen);

  const onClearSelection = () => {
    setValue([]);
    setOpen(false);
  };

  const onSelect: SelectProps['onSelect'] = (event, selection) => {
    const selected = field.value;

    let newValue;
    if (selected.find((value) => selectValuesEqual(selection, value))) {
      newValue = selected.filter((sel: string) => !selectValuesEqual(sel, selection));
    } else {
      newValue = [...field.value, selection];
    }
    setValue(newValue);
  };

  return (
    <FormGroup
      fieldId={name}
      label={label}
      helperText={helperText}
      helperTextInvalid={error}
      validated={validated}
      isRequired={required}
      labelIcon={labelIcon}
      data-test={`multi-select-${label}`}
      className="cluster-templates-select-field"
    >
      <Select
        variant={SelectVariant.typeaheadMulti}
        validated={validated}
        isOpen={isOpen}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={field.value}
        onClear={onClearSelection}
        name={name}
        {...props}
      >
        {options.map((option, idx) => {
          return <SelectOption key={idx} value={option} />;
        })}
      </Select>
    </FormGroup>
  );
};

export default MultiSelectField;
