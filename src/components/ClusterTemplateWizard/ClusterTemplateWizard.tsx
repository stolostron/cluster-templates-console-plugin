import * as React from 'react';
import {
  Alert,
  Button,
  Wizard,
  WizardContext,
  WizardFooter,
  WizardStep,
} from '@patternfly/react-core';
import { Formik, useFormikContext } from 'formik';
import ReviewStep from './Steps/ReviewStep/ReviewStep';
import { StepId, WizardFormikValues } from './types';
import { useHistory } from 'react-router';
import { useSaveClusterTemplate } from '../../hooks/useSaveClusterTemplate';

import TemplateDetailsStep from './Steps/TemplateDetailsStep/TemplateDetailsStep';
import { getErrorMessage } from '../../utils/utils';
import { useTranslation } from '../../hooks/useTranslation';
import Loader from '../../helpers/Loader';
import ManageQuotasStep from './Steps/ManageQuotasStep/ManageQuotasStep';
import Alerts from '../../alerts/Alerts';
import { AlertsContextProvider } from '../../alerts/AlertsContext';
import InstallationSettingsStep from './Steps/InstallationSettingsStep/InstallationSettingsStep';
import PostInstallationStep from './Steps/PostInsallationSettingsStep/PostInstallationSettingsStep';
import { ClusterTemplate } from '../../types';
import { useFormValues } from '../../utils/toWizardFormValues';
import isEmpty from 'lodash/isEmpty';
import { getResourceUrl } from '../../utils/k8s';
import { clusterTemplateGVK } from '../../constants';
import findIndex from 'lodash/findIndex';
import useWizardValidationSchema from './wizardValidationSchema';
import ConfirmCancelModal from './ConfirmCancelModal';

export type ClusterTemplateWizardProps = {
  clusterTemplate?: ClusterTemplate;
};

const CustomFooter = () => {
  const history = useHistory();
  const { values, isSubmitting, submitForm, setTouched, errors } =
    useFormikContext<WizardFormikValues>();
  const [submitError, setSubmitError] = React.useState<string>();
  const [submitClicked, setSubmitClicked] = React.useState(false);
  const { activeStep, onBack, onNext } = React.useContext(WizardContext);
  const { t } = useTranslation();
  const invalid = activeStep.id === 'review' ? !isEmpty(errors) : !isEmpty(errors[activeStep.id]);
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = React.useState(false);
  const reset = () => {
    setSubmitError(undefined);
    setSubmitClicked(false);
    setTouched({});
  };

  const onClickSubmit = async () => {
    if (invalid) {
      await submitForm();
      setSubmitClicked(true);
      return;
    } else if (activeStep.id === 'review') {
      try {
        await submitForm();
        history.push(getResourceUrl(clusterTemplateGVK, values.details.name));
      } catch (err) {
        setSubmitError(getErrorMessage(err));
      }
    } else {
      reset();
      onNext();
    }
  };

  const onClickedBack = () => {
    reset();
    onBack();
  };

  const onCancel = () => history.goBack();

  return (
    <>
      <Alerts />
      {submitError && (
        <Alert title={t('Failed to save the cluster template')} variant="danger" isInline>
          {getErrorMessage(submitError)}
        </Alert>
      )}
      {submitClicked && invalid && (
        <Alert title={t('Please fix the form errors')} variant="danger" isInline />
      )}
      <WizardFooter>
        <Button
          variant="primary"
          type="submit"
          onClick={void onClickSubmit()}
          isLoading={isSubmitting}
          isDisabled={submitClicked && invalid}
        >
          {activeStep.id === StepId.REVIEW
            ? values.isCreateFlow
              ? t('Create template')
              : t('Save')
            : t('Next')}
        </Button>
        <Button
          variant="secondary"
          onClick={onClickedBack}
          isDisabled={activeStep.id === StepId.DETAILS}
        >
          {t('Back')}
        </Button>
        <Button variant="link" onClick={() => setConfirmCancelModalOpen(true)}>
          {t('Cancel')}
        </Button>
        <ConfirmCancelModal
          isOpen={confirmCancelModalOpen}
          onCancel={() => setConfirmCancelModalOpen(false)}
          onConfirm={onCancel}
        />
      </WizardFooter>
    </>
  );
};

const _ClusterTemplateWizard = ({ clusterTemplate }: ClusterTemplateWizardProps) => {
  const [initialValues, initialValuesLoaded, initialValuesError] = useFormValues(clusterTemplate);
  const [activeStepIndex, setActiveStepIndex] = React.useState<number>(0);
  const validationSchema = useWizardValidationSchema(!clusterTemplate);
  const [saveClusterTemplate, saveClusterTemplateLoaded] = useSaveClusterTemplate(
    initialValues,
    clusterTemplate,
  );
  const { t } = useTranslation();
  const reviewStep = (
    <Loader loaded={saveClusterTemplateLoaded}>
      <ReviewStep />
    </Loader>
  );

  const steps: WizardStep[] = [
    {
      name: t('Details'),
      component: <TemplateDetailsStep />,
      id: StepId.DETAILS,
      canJumpTo: true,
    },
    {
      name: t('Installation settings'),
      component: <InstallationSettingsStep />,
      id: StepId.INSTALLATION,
      canJumpTo: activeStepIndex >= 1,
    },
    {
      name: t('Post-installation settings'),
      component: <PostInstallationStep />,
      id: StepId.POST_INSTALLATION,
      canJumpTo: activeStepIndex >= 2,
    },
    {
      name: t('Manage quotas'),
      component: <ManageQuotasStep />,
      id: StepId.QUOTAS,
      canJumpTo: activeStepIndex >= 3,
    },
    {
      name: t('Review'),
      component: reviewStep,
      id: StepId.REVIEW,
      canJumpTo: activeStepIndex === 4,
    },
  ];

  const onSubmit = async (values: WizardFormikValues) => {
    await saveClusterTemplate(values);
  };

  const updateActiveStepIndex = (stepId?: string | number) => {
    if (stepId) {
      const index = findIndex(steps, { id: stepId });
      setActiveStepIndex(index);
    }
  };

  return (
    <Loader loaded={initialValuesLoaded} error={initialValuesError}>
      <Formik<WizardFormikValues>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Wizard
          steps={steps}
          footer={<CustomFooter />}
          hideClose
          onGoToStep={(newStep) => updateActiveStepIndex(newStep.id)}
          onNext={({ id }) => updateActiveStepIndex(id)}
          onBack={({ id }) => updateActiveStepIndex(id)}
        />
      </Formik>
    </Loader>
  );
};

const ClusterTemplateWizard = (props: ClusterTemplateWizardProps) => (
  <AlertsContextProvider>
    <_ClusterTemplateWizard {...props} />
  </AlertsContextProvider>
);

export default ClusterTemplateWizard;
