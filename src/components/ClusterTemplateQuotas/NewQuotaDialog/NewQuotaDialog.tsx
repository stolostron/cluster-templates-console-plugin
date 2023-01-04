import {
  Alert,
  AlertVariant,
  Button,
  Form,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  ModalVariant,
  Text,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import { InputField } from 'formik-pf';
import { TFunction } from 'i18next';
import React from 'react';
import { WithHelpIcon } from '../../../helpers/PopoverHelpIcon';
import { useTranslation } from '../../../hooks/useTranslation';
import { getErrorMessage } from '../../../utils/utils';
import QuotaHelpText from '../QuotaHelpTexts';
import { NewQuotaFormikValues } from '../types';
import { UsersField, GroupsField } from './AccessFields';
import getNewQuotaValidationSchema from './newQuotaValidationSchema';
import BudgetField from './BudgetField';
import Loader from '../../../helpers/Loader';
import useCreateQuota from './useCreateQuota';
import { AlertsContextProvider } from '../../../alerts/AlertsContext';
import Alerts from '../../../alerts/Alerts';
import QuotaNamespaceField from './QuotaNamespaceField';

const getTitleText = (t: TFunction) => t('Create a new quota');

const Header = () => {
  const { t } = useTranslation();
  return (
    <WithHelpIcon helpText={<QuotaHelpText />}>
      <Text component="h2">{getTitleText(t)}</Text>
    </WithHelpIcon>
  );
};

const getInitialValues = (): NewQuotaFormikValues => ({
  name: '',
  namespace: '',
  users: [],
  groups: [],
  hasBudget: false,
});

const NewQuotaFormFields = ({ clusterTemplateCost }: { clusterTemplateCost: number }) => {
  const { t } = useTranslation();
  const budgetHelpText = t(
    'Enter the amount you wish to limit for this user/group. The amount specified in the previous step is {{cost}} and is the minimum to enter here.',
    { cost: clusterTemplateCost },
  );
  return (
    <Form>
      <InputField name="name" fieldId="new-quota-name" label={t('Quota name')} isRequired />
      <QuotaNamespaceField />
      <UsersField />
      <GroupsField />
      <BudgetField
        budgetFieldName="budget"
        hasBudgetFieldName="hasBudget"
        label={t('Total budget of cluster consumption')}
        popoverHelpText={budgetHelpText}
      />
    </Form>
  );
};

const NewQuotaDialog = ({
  closeDialog,
  clusterTemplateCost,
  isOpen,
}: {
  closeDialog: (quota?: { name: string; namespace: string }) => void;
  clusterTemplateCost: number;
  isOpen: boolean;
}) => {
  const { t } = useTranslation();
  const [createQuota, loaded, createQuotaError] = useCreateQuota();

  const [error, setError] = React.useState<unknown>();
  const onSubmit = async (values: NewQuotaFormikValues) => {
    try {
      await createQuota(values);
      closeDialog({ name: values.name, namespace: values.namespace });
    } catch (err) {
      setError(err);
    }
  };

  const onClose = () => {
    closeDialog();
  };
  return (
    <Modal
      variant={ModalVariant.medium}
      onClose={onClose}
      header={<Header />}
      aria-label={getTitleText(t)}
      showClose
      hasNoBodyWrapper
      isOpen={isOpen}
    >
      <AlertsContextProvider>
        <Formik<NewQuotaFormikValues>
          onSubmit={onSubmit}
          initialValues={getInitialValues()}
          validationSchema={getNewQuotaValidationSchema(t, clusterTemplateCost)}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Loader loaded={loaded} error={createQuotaError}>
              <ModalBoxBody>
                <NewQuotaFormFields clusterTemplateCost={clusterTemplateCost} />
                <Alerts />
                {!!error && (
                  <Alert variant={AlertVariant.danger} title={t('Failed to create quota')} isInline>
                    {getErrorMessage(error)}
                  </Alert>
                )}
              </ModalBoxBody>
              <ModalBoxFooter>
                <Button
                  key="confirm"
                  variant="primary"
                  isLoading={isSubmitting}
                  name="confirm"
                  onClick={() => handleSubmit()}
                  type="submit"
                >
                  {t('Create')}
                </Button>

                <Button key="cancel" variant="link" onClick={onClose} data-test="cancel">
                  {t('Cancel')}
                </Button>
              </ModalBoxFooter>
            </Loader>
          )}
        </Formik>
      </AlertsContextProvider>
    </Modal>
  );
};

export default NewQuotaDialog;
