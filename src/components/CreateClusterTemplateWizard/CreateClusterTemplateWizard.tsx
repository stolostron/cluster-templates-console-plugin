import * as React from 'react';
import { Alert, Button, Wizard, WizardContext, WizardFooter } from '@patternfly/react-core';
import { Formik, useFormikContext } from 'formik';
import ManageAccessStep from './Steps/ManageAccessStep/ManageAccessStep';
import ReviewStep from './Steps/ReviewStep/ReviewStep';
import { WizardFormikValues } from './formikTypes';
import { useHistory } from 'react-router';
import { getFormikInitialValues } from './initialValues';
import { useCreateClusterTemplate } from './useCreateClusterTemplate';
import { getErrorMessage } from '../../utils/utils';
import { AccessContextProvider } from './Steps/ManageAccessStep/AccessContextProvider';
import { NamespacesContextProvider } from './Steps/ManageAccessStep/NamespaceContextProvider';

import TemplateDetailsStep from './Steps/TemplateDetailsStep/TemplateDetailsStep';

const CustomFooter = ({ error }: { error: unknown }) => {
  const history = useHistory();
  const { submitForm, isSubmitting } = useFormikContext();
  const { activeStep, onNext, onBack } = React.useContext(WizardContext);
  return (
    <>
      {error && (
        <Alert title="Failed to create the cluster template" variant="danger" isInline>
          {getErrorMessage(error)}
        </Alert>
      )}
      <WizardFooter>
        <Button
          variant="primary"
          type="submit"
          onClick={activeStep.name === 'Review' ? submitForm : onNext}
          isLoading={isSubmitting}
        >
          {activeStep.name === 'Review' ? 'Create' : 'Next'}
        </Button>
        <Button
          variant="secondary"
          onClick={onBack}
          isDisabled={activeStep.name === 'Template details'}
        >
          Back
        </Button>
        <Button variant="link" onClick={history.goBack}>
          Cancel
        </Button>
      </WizardFooter>
    </>
  );
};

const _CreateClusterTemplateWizard = () => {
  const { createClusterTemplate } = useCreateClusterTemplate();
  const [error, setError] = React.useState();
  const steps = [
    { name: 'Template details', component: <TemplateDetailsStep /> },
    { name: 'Manage access', component: <ManageAccessStep /> },
    { name: 'Review', component: <ReviewStep /> },
  ];
  const title = 'Create cluster template';

  const onSubmit = async (values: WizardFormikValues) => {
    try {
      await createClusterTemplate(values);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Formik<WizardFormikValues> initialValues={getFormikInitialValues()} onSubmit={onSubmit}>
      <Wizard
        title={title}
        navAriaLabel={`${title} steps`}
        mainAriaLabel={`${title} content`}
        steps={steps}
        footer={<CustomFooter error={error} />}
        hideClose
      />
    </Formik>
  );
};

const CreateClusterTemplateWizard = () => (
  <NamespacesContextProvider>
    <AccessContextProvider>
      <_CreateClusterTemplateWizard />
    </AccessContextProvider>
  </NamespacesContextProvider>
);

export default CreateClusterTemplateWizard;
