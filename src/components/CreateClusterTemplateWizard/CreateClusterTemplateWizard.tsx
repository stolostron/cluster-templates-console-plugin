import * as React from 'react';
import { Alert, Button, Wizard, WizardContext, WizardFooter } from '@patternfly/react-core';
import { Formik, useFormikContext } from 'formik';
import ReviewStep from './Steps/ReviewStep/ReviewStep';
import { StepId, WizardFormikValues } from './types';
import { useHistory } from 'react-router';
import { getFormikInitialValues } from './initialValues';
import { useCreateClusterTemplate } from './useCreateClusterTemplate';

import TemplateDetailsStep from './Steps/TemplateDetailsStep/TemplateDetailsStep';
import getWizardValidationSchema from './wizardValidationSchema';
import { getErrorMessage } from '../../utils/utils';
import { getResourceUrl } from '../../utils/k8s';
import { clusterTemplateGVK } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import Loader from '../../helpers/Loader';
import ManageQuotasStep from './Steps/ManageQuotasStep/ManageQuotasStep';

const CustomFooter = () => {
  const history = useHistory();
  const { values, isSubmitting, errors, submitForm } = useFormikContext<WizardFormikValues>();
  const [submitError, setSubmitError] = React.useState();
  const [submitClicked, setSubmitClicked] = React.useState(false);
  const { activeStep, onBack, onNext } = React.useContext(WizardContext);
  const { t } = useTranslation();
  const invalid = !!errors[activeStep.id];
  const onClickSubmit = async () => {
    setSubmitError(undefined);
    if (invalid) {
      //call submitForm also when there are input errors, so errors will be visible to users
      //submitForm will set all the fields as touched
      submitForm();
      setSubmitClicked(true);
      return;
    }
    if (activeStep.id === 'review') {
      try {
        await submitForm();
      } catch (err) {
        setSubmitError(err);
        return;
      }
      history.push(getResourceUrl(clusterTemplateGVK, values.details.name));
    } else {
      setSubmitClicked(false);
      onNext();
    }
  };

  const onClickedBack = () => {
    setSubmitError(undefined);
    setSubmitClicked(false);
    onBack();
  };

  return (
    <>
      {submitError && (
        <Alert title={t('Failed to create the cluster template')} variant="danger" isInline>
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
          onClick={onClickSubmit}
          isLoading={isSubmitting}
          isDisabled={submitClicked && invalid}
        >
          {activeStep.id === StepId.REVIEW ? t('Create') : t('Next')}
        </Button>
        <Button
          variant="secondary"
          onClick={onClickedBack}
          isDisabled={activeStep.id === StepId.DETAILS}
        >
          {t('Back')}
        </Button>
        <Button variant="link" onClick={history.goBack}>
          {t('Cancel')}
        </Button>
      </WizardFooter>
    </>
  );
};

const _CreateClusterTemplateWizard = () => {
  const [createClusterTemplate, loaded] = useCreateClusterTemplate();
  const { t } = useTranslation();
  const reviewStep = (
    <Loader loaded={loaded}>
      <ReviewStep />
    </Loader>
  );
  const steps = [
    { name: t('Template details'), component: <TemplateDetailsStep />, id: StepId.DETAILS },
    { name: t('Manage quotas'), component: <ManageQuotasStep />, id: StepId.QUOTAS },
    { name: t('Review'), component: reviewStep, id: StepId.REVIEW },
  ];
  const title = 'Create cluster template';

  const onSubmit = async (values: WizardFormikValues) => {
    await createClusterTemplate(values);
  };

  const validationSchema = React.useMemo(() => getWizardValidationSchema(t), [t]);

  return (
    <Formik<WizardFormikValues>
      initialValues={getFormikInitialValues()}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      <Wizard
        title={title}
        navAriaLabel={`${title} steps`}
        mainAriaLabel={`${title} content`}
        steps={steps}
        footer={<CustomFooter />}
        hideClose
      />
    </Formik>
  );
};

const CreateClusterTemplateWizard = () => <_CreateClusterTemplateWizard />;

export default CreateClusterTemplateWizard;
