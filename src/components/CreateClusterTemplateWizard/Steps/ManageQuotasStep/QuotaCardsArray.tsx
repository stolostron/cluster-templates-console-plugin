import React from 'react';

import { Button, Divider, Stack, StackItem } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import { QuotaFormikValues } from '../../types';
import { getQuotaFormikInitialValues } from '../../initialValues';
import QuotaCard from './QuotaCard';
import { useTranslation } from '../../../../hooks/useTranslation';
import { WithRemoveButton } from '../../../../helpers/WithRemoveButton';
import '../styles.css';

const fieldName = 'quotas';

const _QuotaCardsArray = ({ push, remove }: FieldArrayRenderProps) => {
  const [field] = useField<QuotaFormikValues[]>({
    name: fieldName,
  });

  const { t } = useTranslation();
  const onAddQuota = () => {
    push(getQuotaFormikInitialValues());
  };

  return (
    <Stack hasGutter>
      {field.value.map((data, quotaIdx) => {
        return (
          <Stack hasGutter key={quotaIdx}>
            <StackItem>
              <WithRemoveButton
                onRemove={() => remove(quotaIdx)}
                isRemoveDisabled={field.value.length === 1}
                ariaLabel={t('Remove quota')}
              >
                <QuotaCard quotaIdx={quotaIdx} fieldName={`${fieldName}[${quotaIdx}]`} />
              </WithRemoveButton>
            </StackItem>
            <StackItem>
              <Divider />
            </StackItem>
          </Stack>
        );
      })}
      <StackItem>
        <Button
          variant="link"
          onClick={onAddQuota}
          data-testid="add-quota"
          icon={<PlusIcon />}
          className="cluster-templates-field-array__btn"
        >
          {t('Add more')}
        </Button>
      </StackItem>
    </Stack>
  );
};

const QuotaCardsArray = () => {
  return <FieldArray name={fieldName} component={_QuotaCardsArray} />;
};

export default QuotaCardsArray;
