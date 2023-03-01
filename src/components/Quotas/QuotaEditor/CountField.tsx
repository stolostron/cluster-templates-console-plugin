import { Flex, FlexItem, TextInputTypes } from '@patternfly/react-core';
import { InputField } from 'formik-pf';
import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import WithCheckboxField from '../../sharedFields/WithCheckboxField';

const ConsumptionField = ({ fieldNamePrefix }: { fieldNamePrefix: string }) => {
  const { t } = useTranslation();
  const countFieldName = `${fieldNamePrefix}.count`;

  return (
    <WithCheckboxField
      checkboxFieldName={`${fieldNamePrefix}.showCount`}
      label={t('Limit number of clusters')}
    >
      <Flex>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <InputField name={countFieldName} fieldId={countFieldName} type={TextInputTypes.number} />
        </FlexItem>
        <FlexItem>{t('Instances')}</FlexItem>
      </Flex>
    </WithCheckboxField>
  );
};

export default ConsumptionField;
