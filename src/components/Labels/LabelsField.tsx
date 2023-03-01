import { useField } from 'formik';
import React from 'react';
import { MetadataLabels } from '../../types/resourceTypes';
import { LabelsInput, LabelsInputProps } from './LabelsInput';

const LabelsField = (props: Omit<LabelsInputProps, 'value' | 'onChange'>) => {
  const [{ value }, , { setValue }] = useField<MetadataLabels>(props.name);
  return (
    <LabelsInput
      {...props}
      value={value}
      onChange={(labels: Record<string, string> | undefined): void => {
        setValue(labels);
      }}
    />
  );
};

export default LabelsField;
