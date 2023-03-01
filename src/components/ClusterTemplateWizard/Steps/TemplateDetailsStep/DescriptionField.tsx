import * as React from 'react';
import { useField } from 'formik';
import { FormGroup } from '@patternfly/react-core';
import { useTranslation } from '../../../../hooks/useTranslation';
import MarkdownEditor from '../../../../helpers/MardownEditor';

const DescriptionField = () => {
  const name = 'details.description';
  const { t } = useTranslation();
  const [field, { error, touched }, { setValue }] = useField<string>(name);
  const isValid = !error && !touched;

  return (
    <>
      <FormGroup
        fieldId={name}
        label={t('Description')}
        helperText={t(
          'Describe when and how to use this template, what are the preconditions of using it, and add links to relevant documentation if needed',
        )}
        helperTextInvalid={error}
        validated={isValid ? 'default' : 'error'}
      >
        <MarkdownEditor code={field.value} onChange={(code) => setValue(code)} height={200} />
      </FormGroup>
    </>
  );
};

export default DescriptionField;
