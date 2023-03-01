import React from 'react';
import {
  ModalBoxBody,
  TextInputTypes,
  Alert,
  AlertVariant,
  ModalBoxFooter,
  Button,
  ButtonVariant,
  Form,
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { InputField, TextAreaField, CheckboxField } from 'formik-pf';
import { DecodedSecret, ArgoCDSecretData } from '../../types/resourceTypes';
import { FormError, RepositoryFormValues } from './types';
import { useTranslation } from '../../hooks/useTranslation';

type RepositoryFormProps = FormikProps<RepositoryFormValues> & {
  argoCDSecret?: DecodedSecret<ArgoCDSecretData>;
  closeDialog: () => void;
  formError?: FormError;
};

const RepositoryForm = ({
  argoCDSecret,
  formError,
  closeDialog,
  ...formikProps
}: RepositoryFormProps) => {
  const { t } = useTranslation();
  const { errors, values, isSubmitting, isValid, handleSubmit } = formikProps;

  return (
    <>
      <ModalBoxBody>
        <Form data-testid="repository-form" onSubmit={handleSubmit}>
          <InputField
            fieldId="name"
            name="name"
            label={t('Name')}
            type={TextInputTypes.text}
            helperTextInvalid={errors.name}
            isDisabled={!!argoCDSecret}
            isRequired
          />
          <InputField
            fieldId="url"
            name="url"
            label={t('Repository URL')}
            type={TextInputTypes.text}
            placeholder="Repository URL"
            helperTextInvalid={errors.url}
            isRequired
          />
          <TextAreaField fieldId="description" name="description" label={t('Description')} />
          <CheckboxField
            fieldId="useCredentials"
            name="useCredentials"
            label={t('Requires authentication')}
            helperText={t(
              'Add credentials and certificates to connect to private Helm chart repository.',
            )}
          />
          {values.useCredentials && (
            <>
              <InputField
                fieldId="username"
                name="username"
                label={t('Username')}
                type={TextInputTypes.text}
                helperTextInvalid={errors.username}
                isRequired
              />
              <InputField
                fieldId="password"
                name="password"
                label={t('Password')}
                type={TextInputTypes.password}
                helperTextInvalid={errors.password}
                isRequired
              />
              {/* <TextAreaField
                fieldId="tlsClientCert"
                name="tlsClientCert"
                label={t('TLS client certificate')}
                helperTextInvalid={errors.tlsClientCert}
                isRequired
              />
              <TextAreaField
                fieldId="tlsClientKey"
                name="tlsClientKey"
                label={t('TLS client key')}
                helperTextInvalid={errors.tlsClientKey}
                isRequired
              /> */}
            </>
          )}
          {formError && (
            <Alert variant={AlertVariant.danger} title={formError?.title} isInline>
              {formError?.message}
            </Alert>
          )}
        </Form>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button
          onClick={() => handleSubmit()}
          variant={ButtonVariant.primary}
          isDisabled={isSubmitting || !isValid}
          isLoading={isSubmitting}
        >
          {t('Submit')}
        </Button>
        <Button onClick={() => closeDialog()} variant={ButtonVariant.link}>
          {t('Cancel')}
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default RepositoryForm;
