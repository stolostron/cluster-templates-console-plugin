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
} from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { InputField, CheckboxField, RadioGroupField } from 'formik-pf';
import { DecodedSecret, ArgoCDSecretData, RepositoryType } from '../../types/resourceTypes';
import { RepositoryFormValues } from './types';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import { nameValidationMessages } from '../../utils/commonValidationSchemas';
import RichInputField from '../../helpers/RichInputField';

type RepositoryFormProps = FormikProps<RepositoryFormValues> & {
  argoCDSecret?: DecodedSecret<ArgoCDSecretData>;
  closeDialog: () => void;
  submitError?: unknown;
  predefinedType?: RepositoryType;
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
  ...formikProps
}: RepositoryFormProps) => {
  const { t } = useTranslation();
  const { errors, values, isSubmitting, handleSubmit, setFieldValue } = formikProps;
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    urlInputRef.current?.focus();
  }, []);
  return (
    <>
      <ModalBoxBody>
        <Form data-testid="repository-form" onSubmit={handleSubmit}>
          {!predefinedType && <TypeField />}
          <InputField
            ref={urlInputRef}
            fieldId="url"
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
          />
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
