import { ActionGroup, Alert, Button, Form, Stack } from '@patternfly/react-core';
import { Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import { SkeletonLoader } from '../../helpers/SkeletonLoader';
import useCreateInstance from '../../hooks/useCreateInstance';
import { useInstanceFormValues } from '../../hooks/useInstanceFormValues';
import { useNavigation } from '../../hooks/useNavigation';
import { useTranslation } from '../../hooks/useTranslation';
import { InstanceFormValues } from '../../types/instanceFormTypes';
import { ClusterTemplate } from '../../types/resourceTypes';
import { getErrorMessage } from '../../utils/utils';
import InstanceFormFields from './InstanceFormFields';
import useInstanceValidationSchema from './instanceValidationSchema';

const InstanceFormToolbar = ({
  onCancel,
  handleSubmit,
  isSubmitting,
}: {
  onCancel: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <ActionGroup>
      <Button
        variant="primary"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        name="confirm"
        onClick={handleSubmit}
        type="submit"
      >
        {t('Create')}
      </Button>
      <Button onClick={onCancel} variant="link" isDisabled={isSubmitting}>
        {t('Cancel')}
      </Button>
    </ActionGroup>
  );
};

const InstanceForm = ({
  templateName,
  templateLoadResult,
}: {
  templateName: string;
  templateLoadResult: [ClusterTemplate, boolean, unknown];
}) => {
  const { t } = useTranslation();
  const [template, templateLoaded, templateError] = templateLoadResult;
  const [initialValues, initialValuesError] = useInstanceFormValues(templateLoadResult);
  const [create, createLoaded] = useCreateInstance(template);
  const validationSchema = useInstanceValidationSchema();
  const [submitError, setSubmitError] = React.useState<unknown>();
  const history = useHistory();
  const navigation = useNavigation();
  const onSubmit = async (values: InstanceFormValues) => {
    try {
      await create(values);
      navigation.goToClusterTemplateDetailsPage(template, 'instances');
    } catch (err) {
      setSubmitError(err);
    }
  };

  const getErrorTitle = () => {
    if (templateError) {
      return t(`Failed to load template {{templateName}}`, { templateName });
    } else if (initialValuesError) {
      return t(`Failed to parse template status {{templateName}}`, { templateName });
    } else {
      return undefined;
    }
  };

  return (
    <AlertsContextProvider>
      <SkeletonLoader
        numRows={8}
        loaded={templateLoaded && createLoaded}
        error={templateError || initialValuesError}
        errorTitle={getErrorTitle()}
      >
        {initialValues && (
          <Formik<InstanceFormValues>
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, handleSubmit, values }) => (
              <Stack hasGutter>
                <Form isWidthLimited>
                  <InstanceFormFields />
                </Form>
                {values.hasUnsupportedParameters && (
                  <Alert
                    title={t(
                      'Some of the Helm parameters are none primitives and cannot be set in the UI',
                    )}
                    variant="warning"
                    isInline
                  />
                )}
                {submitError && (
                  <Alert title={t('Failed to save the instance')} variant="danger" isInline>
                    {getErrorMessage(submitError)}
                  </Alert>
                )}
                <InstanceFormToolbar
                  onCancel={() => history.goBack()}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </Stack>
            )}
          </Formik>
        )}
      </SkeletonLoader>
    </AlertsContextProvider>
  );
};

export default InstanceForm;
