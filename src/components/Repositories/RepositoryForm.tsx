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
  Divider,
  Stack,
  StackItem,
  Tooltip,
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { CheckboxField, InputField, RadioGroupField } from 'formik-pf';
import {
  DecodedSecret,
  ArgoCDSecretData,
  RepositoryType,
  DeserializedClusterTemplate,
} from '../../types/resourceTypes';
import { RepositoryFormValues } from './types';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import { nameValidationMessages } from '../../utils/commonValidationSchemas';
import RichInputField from '../../helpers/RichInputField';
import CertificateAuthorityField from './CertificateAuthorityField/CertificateAuthorityField';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import Alerts from '../../alerts/Alerts';

type RepositoryFormProps = FormikProps<RepositoryFormValues> & {
  argoCDSecret?: DecodedSecret<ArgoCDSecretData>;
  closeDialog: () => void;
  submitError?: unknown;
  predefinedType?: RepositoryType;
  templatesFromRepo?: DeserializedClusterTemplate[];
};

const TypeField = () => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}>
        <Divider />
      </StackItem>
      <StackItem style={{ marginBottom: 'unset' }}>
        <RadioGroupField
          label={t('Type')}
          name="type"
          options={[
            {
              label: t('Git'),
              value: 'git',
            },
            {
              label: t('Helm'),
              value: 'helm',
            },
          ]}
          fieldId="repository-type"
          isInline
        />
      </StackItem>
      <StackItem>
        <Divider />
      </StackItem>
    </Stack>
  );
};

const RepositoryForm = ({
  argoCDSecret,
  submitError,
  closeDialog,
  predefinedType,
  templatesFromRepo,
  ...formikProps
}: RepositoryFormProps) => {
  const { t } = useTranslation();
  const { errors, values, isSubmitting, handleSubmit, setFieldValue } = formikProps;
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  const hasTemplates = !!templatesFromRepo?.length;
  return (
    <AlertsContextProvider>
      <ModalBoxBody>
        <Form data-testid="repository-form" onSubmit={handleSubmit}>
          {!predefinedType && <TypeField />}
          <InputField
            fieldId="url"
            ref={urlInputRef}
            name="url"
            label={t('Repository URL')}
            type={TextInputTypes.text}
            placeholder="Repository URL"
            helperTextInvalid={errors.url}
            isRequired
            onChange={(event) => {
              const e = event as React.FormEvent<HTMLInputElement>;
              const newUrl = e.currentTarget.value;
              if (!argoCDSecret && !values.name && newUrl) {
                setFieldValue('name', newUrl.substring(newUrl.lastIndexOf('/') + 1));
              }
            }}
            isDisabled={hasTemplates}
          />
          <Tooltip
            hidden={!hasTemplates}
            content={t(
              'It is not possible to edit the URL if there are templates associated with this repository. To edit it delete the templates using it',
            )}
            reference={urlInputRef}
          />
          <RichInputField
            isRequired
            name="name"
            placeholder={t('Enter a name')}
            richValidationMessages={nameValidationMessages(t)}
            label={t('Name')}
            isDisabled={!!argoCDSecret}
            tooltip={
              argoCDSecret
                ? t('Cannot rename the repository once it has been set up as a Secret')
                : undefined
            }
          />
          <CertificateAuthorityField />
          <CheckboxField
            fieldId="useCredentials"
            name="useCredentials"
            label={t('Requires authentication')}
            helperText={t('Add credentials to connect to a private repository.')}
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
            </>
          )}
          <Alerts />
          {submitError && (
            <Alert variant={AlertVariant.danger} title={t('Failed to save repository')} isInline>
              {getErrorMessage(submitError)}
            </Alert>
          )}
        </Form>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button
          onClick={() => handleSubmit()}
          variant={ButtonVariant.primary}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {argoCDSecret ? t('Save') : t('Add')}
        </Button>
        <Button onClick={() => closeDialog()} variant={ButtonVariant.link}>
          {t('Cancel')}
        </Button>
      </ModalBoxFooter>
    </AlertsContextProvider>
  );
};

export default RepositoryForm;
