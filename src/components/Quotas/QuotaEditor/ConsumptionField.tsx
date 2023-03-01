import { Flex, FlexItem, TextInputTypes } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import React from 'react';
import { Trans } from 'react-i18next';
import { useTranslation } from '../../../hooks/useTranslation';
import { QuotaFormValues } from '../../../types/quotaFormTypes';
import WithCheckboxField from '../../sharedFields/WithCheckboxField';
import get from 'lodash/get';
import { InputField } from 'formik-pf';

const ConsumptionField = ({ fieldNamePrefix }: { fieldNamePrefix: string }) => {
  const { t } = useTranslation();
  const fieldName = `${fieldNamePrefix}.cost`;
  const { values, setFieldValue } = useFormikContext<QuotaFormValues>();
  const checkboxFieldName = `${fieldNamePrefix}.showCost`;
  const budget = values.budget;
  const showCost = get(values, checkboxFieldName) as boolean;
  React.useEffect(() => {
    if (budget && !showCost) {
      setFieldValue(checkboxFieldName, true);
    }
  }, [budget, checkboxFieldName, setFieldValue, showCost]);
  return (
    <WithCheckboxField
      checkboxFieldName={checkboxFieldName}
      label={t('Consumption')}
      popoverHelpText={t(
        'The consumption of the template is in relation to the total consumption limit',
      )}
      isDisabled={!budget}
    >
      <Flex>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <InputField name={fieldName} fieldId={fieldName} type={TextInputTypes.number} />
        </FlexItem>
        <FlexItem>
          <Trans ns="plugin__clustertemplates-plugin">
            {t('/ {{budget}} per instance', { budget })}
          </Trans>
        </FlexItem>
      </Flex>
    </WithCheckboxField>
  );
};

export default ConsumptionField;
