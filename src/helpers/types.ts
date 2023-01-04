import React from 'react';

export type FieldProps = {
  name: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  isRequired?: boolean;
  labelIcon?: React.ReactElement;
};
