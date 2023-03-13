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
        helperText={t(
          `Use labels to organize and place application subscriptions and policies on this cluster. The placement of resources are controlled by label selectors. If your cluster has the labels that match the resource placement’s label selector, the resource will be installed on your cluster after creation`,
        )}
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
