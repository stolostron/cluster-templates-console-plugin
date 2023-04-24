import { Flex, FlexItem, TextInputTypes } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxField, InputField, NumberSpinnerField } from 'formik-pf';
import React from 'react';
import FormSection from '../../helpers/FormSection';
import { InstanceParameter, InstanceParametersFormValues } from '../../types/instanceFormTypes';

import { FieldProps } from '../../helpers/types';
import { ApplicationSetLink } from '../sharedDetailItems/clusterTemplateDetailItems';

const SectionTitle = ({ title, appSetName }: { title: string; appSetName: string }) => (
  <Flex>
    <FlexItem spacer={{ default: 'spacerSm' }}>{`${title}:`}</FlexItem>
    <FlexItem>
      <ApplicationSetLink appSetName={appSetName} />
    </FlexItem>
  </Flex>
);

const InstanceParameterField = ({ fieldName }: { fieldName: string }) => {
  const [{ value }] = useField<InstanceParameter>(fieldName);
  const props: FieldProps & { fieldId: string } = {
    name: `${fieldName}.value`,
    label: value.title,
    fieldId: fieldName,
    isRequired: value.required,
    helperText: value.description,
  };
  switch (value.type) {
    case 'number':
      return <InputField {...props} type={TextInputTypes.number} />;
    case 'string':
      return <InputField {...props} />;
    case 'boolean':
      return <CheckboxField {...props} />;
    case 'integer':
      return <NumberSpinnerField {...props} />;
    default:
      throw `Unsupported parameter type ${value.type}`;
  }
};

const InstanceParametersFormFields = ({
  fieldName,
  title,
}: {
  fieldName: string;
  title: string;
}) => {
  const [field] = useField<InstanceParametersFormValues>(fieldName);
  if (field.value.parameters.length === 0) {
    return null;
  }
  return (
    <FormSection title={<SectionTitle title={title} appSetName={field.value.name} />}>
      {field.value.parameters.map((param, idx) => {
        const name = `${fieldName}.parameters[${idx}]`;
        return <InstanceParameterField key={name} fieldName={name} />;
      })}
    </FormSection>
  );
};

export default InstanceParametersFormFields;
