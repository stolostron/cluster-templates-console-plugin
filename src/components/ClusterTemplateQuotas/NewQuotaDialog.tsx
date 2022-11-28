import {
  Alert,
  AlertVariant,
  Button,
  Flex,
  FlexItem,
  Form,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  ModalVariant,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import { CheckboxField, InputField, NumberSpinnerField } from 'formik-pf';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import useCreateQuota, { NewQuotaFormikValues } from './useCreateQuota';

const getInitialValues = (): NewQuotaFormikValues => ({
  name: '',
  namespace: '',
  access: [],
  hasBudget: false,
  budget: 0,
});

const NewQuotaForm = () => {
  const { t } = useTranslation();

  return (
    <>
      <InputField name="name" fieldId="new-quota-name" label="Quota name" isRequired />
      <InputField name="namespace" fieldId="new-quota-namespace" label="Namespace" isRequired />
      <Flex>
        <FlexItem>
          <CheckboxField
            name="hasBudget"
            label={t('Total cost of using this quota')}
            fieldId="new-quota-has-budget"
          />
        </FlexItem>
        <FlexItem>
          <NumberSpinnerField name="budget" fieldId="new-quota-budget" />
        </FlexItem>
      </Flex>
    </>
  );
};

const NewQuotaDialog = ({
  closeDialog,
  isOpen,
}: {
  closeDialog: (string?) => void;
  isOpen: boolean;
}) => {
  const { t } = useTranslation();
  const { create } = useCreateQuota();
  const [error, setError] = React.useState<unknown>();
  const onSubmit = async (values: NewQuotaFormikValues) => {
    try {
      await create(values);
      closeDialog(values.name);
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
      isOpen={isOpen}
      title={t('Add quota')}
      onClose={onClose}
      aria-label="Add quota"
      showClose
      hasNoBodyWrapper
    >
      <Formik<NewQuotaFormikValues> onSubmit={onSubmit} initialValues={getInitialValues()}>
        {({ isSubmitting, handleSubmit }) => (
          <ModalBoxBody>
            <Form>
              <NewQuotaForm />
              {!!error && (
                <Alert variant={AlertVariant.danger} title={t('Failed to create quota')} isInline>
                  {getErrorMessage(error)}
                </Alert>
              )}
              <ModalBoxFooter>
                <Button
                  key="confirm"
                  variant="primary"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  name="confirm"
                  onClick={() => handleSubmit()}
                >
                  {t('Add')}
                </Button>

                <Button key="cancel" variant="link" onClick={onClose} data-test="cancel">
                  {t('Cancel')}
                </Button>
              </ModalBoxFooter>
            </Form>
          </ModalBoxBody>
        )}
      </Formik>
    </Modal>
  );
};

export default NewQuotaDialog;
