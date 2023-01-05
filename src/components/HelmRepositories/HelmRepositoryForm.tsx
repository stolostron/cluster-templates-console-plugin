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
import { InputField, TextAreaField, CheckboxField, SelectField } from 'formik-pf';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelmChartRepository, Secret, ConfigMap } from '../../types';
import { HelmRepositoryFormValues, FormError } from './types';
import { useFieldChangeHandlers } from './utils';

type FormikContentProps = FormikProps<HelmRepositoryFormValues> & {
  helmChartRepository?: HelmChartRepository;
  availableTlsSecrets: Secret[];
  configMaps: ConfigMap[];
  closeDialog: () => void;
  formError?: FormError;
};

const HelmRepositoryForm = ({
  helmChartRepository,
  availableTlsSecrets,
  configMaps,
  formError,
  closeDialog,
  ...formikProps
}: FormikContentProps) => {
  const { t } = useTranslation();
  const { errors, values, isSubmitting, isValid, handleSubmit } = formikProps;
  useFieldChangeHandlers(formikProps, configMaps, availableTlsSecrets);

  return (
    <>
      <ModalBoxBody>
        <Form data-testid="helm-repo-form" onSubmit={handleSubmit}>
          <InputField
            fieldId="name"
            name="name"
            label={t('Name')}
            type={TextInputTypes.text}
            helperTextInvalid={errors.name}
            isDisabled={!!helmChartRepository}
            isRequired
          />
          <InputField
            fieldId="url"
            name="url"
            label={t('HELM chart repository URL')}
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
              'Add credentials and custom certificate authority (CA) certificates to connect to private helm chart repository.',
            )}
          />
          {values.useCredentials && (
            <>
              <SelectField
                name="existingConfigMapName"
                fieldId="existingConfigMapName"
                label={t('CA certificate config map')}
                placeholder={t('Select a ConfigMap')}
                options={configMaps.map((cm) => ({
                  value: cm.metadata?.name || '',
                  disabled: false,
                }))}
              />
              <TextAreaField
                fieldId="caCertificate"
                name="caCertificate"
                label={t('CA certificate')}
                helperTextInvalid={errors.tlsClientKey}
                isRequired
              />
              <SelectField
                name="existingSecretName"
                fieldId="existingSecretName"
                label={t('TLS config secret')}
                placeholder={t('Select a credential')}
                options={availableTlsSecrets.map((secret) => ({
                  value: secret.metadata?.name || '',
                  disabled: false,
                }))}
              />
              <TextAreaField
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
              />
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
        >
          {t('Submit')}
        </Button>
        <Button onClick={closeDialog} variant={ButtonVariant.link}>
          {t('Cancel')}
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default HelmRepositoryForm;
