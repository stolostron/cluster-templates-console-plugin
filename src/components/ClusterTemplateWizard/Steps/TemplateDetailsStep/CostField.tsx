import { Flex, FlexItem, FormGroup, TextInput, TextInputTypes, Text } from '@patternfly/react-core';
import { useField } from 'formik';
import React from 'react';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import { useTranslation } from '../../../../hooks/useTranslation';

const CostField = () => {
  const { t } = useTranslation();
  const [field, { error, touched, value }] = useField<number>('details.cost');
  const isValid = !touched || !error;
  const fieldName = 'details.cost';
  return (
    <FormGroup
      fieldId={fieldName}
      isRequired
      label={t('Cost of using this template')}
      labelIcon={
        <PopoverHelpIcon
          helpText={t(
            'Specify how much money to spend on each usage of this cluster template. You can use any type of currency.',
          )}
        />
      }
      helperTextInvalid={error}
      validated={isValid ? 'default' : 'error'}
    >
      <Flex>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <TextInput
            name={fieldName}
            autoComplete="off"
            type={TextInputTypes.number}
            value={value}
            onChange={(value, event) => {
              field.onChange(event);
            }}
            onBlur={field.onBlur}
            aria-label={t('Cost field')}
            validated={isValid ? 'default' : 'error'}
          />
        </FlexItem>
        <FlexItem>
          <Text>{t('Per instance')}</Text>
        </FlexItem>
      </Flex>
    </FormGroup>
  );
};

export default CostField;
