import * as React from 'react';
import { useField } from 'formik';
import { FormGroup } from '@patternfly/react-core';
import { Trans } from 'react-i18next';
import { useTranslation } from '../../../../hooks/useTranslation';
import MarkdownEditor from '../../../../helpers/MardownEditor';

const HelperText = () => (
  <Trans ns="plugin__clustertemplates-plugin">
    Describe when and how to use this template, what are the preconditions of using it, and add
    links to relevant documentation if needed.{' '}
    <a href="https://www.google.com">See formatting instructions</a>
  </Trans>
);

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
        helperText={<HelperText />}
        helperTextInvalid={error}
        validated={isValid ? 'default' : 'error'}
      >
        <MarkdownEditor code={field.value} onChange={(code) => setValue(code)} />
      </FormGroup>
    </>
  );
};

export default DescriptionField;
