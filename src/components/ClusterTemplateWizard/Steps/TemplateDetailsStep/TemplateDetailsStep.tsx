import { Form, Stack, StackItem, Text } from '@patternfly/react-core';
import { useField } from 'formik';
import React from 'react';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { useTranslation } from '../../../../hooks/useTranslation';
import DescriptionField from './DescriptionField';
import NameField from '../../../sharedFields/NameField';
import LabelsField from '../../../Labels/LabelsField';

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
      <LabelsField
        name={'details.labels'}
        label={t('Labels')}
        helperText={t(`Apply labels to the ManagedClusters created from this template.`)}
      />
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
