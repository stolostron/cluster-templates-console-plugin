import { TextInputTypes, Text } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from 'formik-pf';
import React from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from '../../../hooks/useTranslation';
import WithCheckboxField from '../../sharedFields/WithCheckboxField';

const HelpText = () => (
  <Trans ns="plugin__clustertemplates-plugin">
    <Text>
      Give this namespace a consumption limit. All templates added to this quota will be limited to
      this maximum.
    </Text>
    <Text className="pf-u-font-weight-bold">
      As an example, use it to define small and big clusters and limit the consumption of them, such
      as:
      <br />
      Consumption limit = 100
      <br />
      Template 1 consumption = 20
      <br />
      Template 2 consumption = 40
    </Text>
  </Trans>
);

const BudgetField = () => {
  const { t } = useTranslation();
  const [, , { setValue: setBudget }] = useField<number | undefined>('budget');

  return (
    <WithCheckboxField
      checkboxFieldName="limitByBudget"
      label={t('Consumption limit')}
      onChange={() => setBudget(undefined)}
      popoverHelpText={<HelpText />}
    >
      <InputField name="budget" fieldId="budget" type={TextInputTypes.number} />
    </WithCheckboxField>
  );
};

export default BudgetField;
