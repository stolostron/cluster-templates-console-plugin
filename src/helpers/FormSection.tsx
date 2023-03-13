import { FormSection as PfFormSection, FormSectionProps } from '@patternfly/react-core';
import React from 'react';

const FormSection = (props: FormSectionProps) => (
  <PfFormSection style={{ marginTop: 'unset' }} {...props} />
);

export default FormSection;
