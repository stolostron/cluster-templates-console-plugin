import { Flex, FlexItem, Form, Stack, StackItem, Text } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from 'formik-pf';
import React from 'react';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { useTranslation } from '../../../../hooks/useTranslation';
import ArgocdNamespaceField from './ArgocdNamespaceField';
import '../styles.css';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';

const DetailsForm = () => {
  const { t } = useTranslation();
  const [{ value: isCreateFlow }] = useField('isCreateFlow');
  return (
    <Form>
      <InputField
        fieldId="details.name"
        isDisabled={!isCreateFlow}
        isRequired
        name="details.name"
        label={t('Cluster template name')}
        placeholder={t('Enter a name')}
      />
      <ArgocdNamespaceField />
      <Flex className="cluster-templates-cost-field">
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <InputField
            fieldId="details.cost"
            isRequired
            name="details.cost"
            label={t('Cost')}
            labelIcon={
              <PopoverHelpIcon
                helpText={t(
                  'Specify how much money to spend on each usage of this cluster template. You can use any type of currency.',
                )}
              />
            }
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
