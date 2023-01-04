import { Flex, FlexItem, Form, Stack, StackItem, Text } from '@patternfly/react-core';
import { InputField } from 'formik-pf';
import React from 'react';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { useTranslation } from '../../../../hooks/useTranslation';
import NamespaceField from '../../../fields/NamespaceField';
import '../styles.css';

const DetailsForm = () => {
  const { t } = useTranslation();
  return (
    <Form>
      <InputField
        fieldId="details.name"
        isRequired
        name="details.name"
        label={t('Cluster template name')}
        placeholder={t('Enter a name')}
      />
      <NamespaceField
        isRequired
        name="details.argocdNamespace"
        label={t('Argocd namespace')}
        popoverHelpText={t('Select a namespace where ArgoCD Application resource will be created.')}
      />
      <Flex className="cluster-templates-cost-field">
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <InputField
            fieldId="details.cost"
            isRequired
            name="details.cost"
            label={t('Cost')}
            labelIcon={t(
              'Specify how much money to spend on each usage of this cluster template. You can use any type of currency.',
            )}
          />
        </FlexItem>
        <FlexItem>
          <Text component="p">{t('Per use')}</Text>
        </FlexItem>
      </Flex>
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
