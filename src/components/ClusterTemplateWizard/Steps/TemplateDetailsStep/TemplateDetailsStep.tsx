import { Form, Stack, StackItem, Text } from '@patternfly/react-core';
import { useField } from 'formik';
import React from 'react';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { useTranslation } from '../../../../hooks/useTranslation';
import '../styles.css';
import DescriptionField from './DescriptionField';
import CostField from './CostField';
import NameField from '../../../sharedFields/NameField';

const DetailsForm = () => {
  const { t } = useTranslation();
  const [{ value: isCreateFlow }] = useField<boolean>('isCreateFlow');
  return (
    <Form>
      <NameField
        isDisabled={!isCreateFlow}
        name={'details.name'}
        label={t('Cluster template name')}
      />
      <DescriptionField />
      <CostField />
    </Form>
  );
};

const TemplateDetailsStep = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Stack hasGutter>
        <StackItem>
          <Text component="h2">{t('Details')}</Text>
        </StackItem>
        <StackItem>
          <DetailsForm />
        </StackItem>
      </Stack>
    </ErrorBoundary>
  );
};
export default TemplateDetailsStep;
