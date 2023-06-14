import { ActionGroup, Alert, Button, Form, Stack } from '@patternfly/react-core';
import { Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router';
import Alerts from '../../../alerts/Alerts';
import { AlertsContextProvider } from '../../../alerts/AlertsContext';
import { SkeletonLoader } from '../../../helpers/SkeletonLoader';
import { useNavigation } from '../../../hooks/useNavigation';
import { useQuotaFormValues } from '../../../hooks/useQuotaFormValues';
import useSaveQuota from '../../../hooks/useSaveQuota';
import { useTranslation } from '../../../hooks/useTranslation';
import { QuotaFormValues } from '../../../types/quotaFormTypes';
import { Quota } from '../../../types/resourceTypes';
import { getErrorMessage } from '../../../utils/utils';
import QuotaFormFields from './QuotaFormFields';
import useQuotasValidationSchema from './quotasValidationSchema';

const QuotaFormToolbar = ({
  onCancel,
  handleSubmit,
  isSubmitting,
  isCreateFlow,
}: {
  onCancel: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  isCreateFlow: boolean;
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
        {isCreateFlow ? t('Create') : t('Save')}
      </Button>
      <Button onClick={onCancel} variant="link" isDisabled={isSubmitting}>
        {t('Cancel')}
      </Button>
    </ActionGroup>
  );
};

const QuotaForm = ({ quota }: { quota?: Quota }) => {
  const { t } = useTranslation();
  const [initialValues, initialValuesLoaded, initialValuesError] = useQuotaFormValues(quota);
  const validationSchema = useQuotasValidationSchema(!quota);
  const [save, saveLoaded] = useSaveQuota(quota);
  const [submitError, setSubmitError] = React.useState<unknown>();
  const history = useHistory();
  const navigation = useNavigation();
  const onSubmit = async (values: QuotaFormValues) => {
    try {
      await save(values);
      navigation.goToClusterTemplatesPage('quotas');
    } catch (err) {
      setSubmitError(err);
    }
  };
  return (
    <AlertsContextProvider>
      <SkeletonLoader
        numRows={12}
        loaded={saveLoaded && initialValuesLoaded}
        error={initialValuesError}
      >
        {initialValues && (
          <Formik<QuotaFormValues>
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Stack hasGutter>
                <Form isWidthLimited>
                  <QuotaFormFields originalQuota={quota} />
                </Form>
                {submitError && (
                  <Alert title={t('Failed to save the quota')} variant="danger" isInline>
                    {getErrorMessage(submitError)}
                  </Alert>
                )}
                <QuotaFormToolbar
                  onCancel={() => history.goBack()}
                  isCreateFlow={!quota}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </Stack>
            )}
          </Formik>
        )}

        <Alerts />
      </SkeletonLoader>
    </AlertsContextProvider>
  );
};

export default QuotaForm;
