import React from 'react';
import { FormGroup, NumberInput, NumberInputProps } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';
import toInteger from 'lodash/toInteger';
import { FieldProps } from '../../helpers/types';

//Couldn't use formik-pf NumberSpinnerField because it doesn't allow free entry of numbers

type NumberSpinnerFieldProps = FieldProps & {
  min?: number;
  max?: number;
};

const NumberSpinnerField: React.FC<NumberSpinnerFieldProps> = ({
  label,
  helperText,
  isRequired,
  ...props
}) => {
  const [field, { touched, error }, { setValue }] = useField<number>(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = props.name;
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  const changeValueBy = (operation: number) => {
    setFieldValue(props.name, toInteger(field.value) + operation);
    setFieldTouched(props.name, true);
  };

  const handleChange: NumberInputProps['onChange'] = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value as unknown as number;
    let newValue = props?.min && value < props?.min ? props?.min : value;
    newValue = props?.max && newValue > props?.max ? props?.max : value;
    setValue(isNaN(newValue) ? 0 : newValue);
  };

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={helperText}
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={isRequired}
    >
      <NumberInput
        {...field}
        {...props}
        id={fieldId}
        value={field.value}
        onMinus={() => changeValueBy(-1)}
        onPlus={() => changeValueBy(1)}
        onChange={handleChange}
        inputProps={{ ...props }}
        minusBtnAriaLabel="Decrement"
        plusBtnAriaLabel="Increment"
        aria-describedby={helperText ? `${fieldId}-helper` : undefined}
      />
    </FormGroup>
  );
};

export default NumberSpinnerField;
