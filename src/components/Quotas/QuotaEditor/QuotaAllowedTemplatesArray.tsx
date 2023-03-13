import React from 'react';

import { Button } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import AllowedTemplateFormFields from './AllowedTemplateFormFields';
import { useTranslation } from '../../../hooks/useTranslation';
import { WithRemoveButton } from '../../../helpers/WithRemoveButton';
import { AllowedTemplateFormValues } from '../../../types/quotaFormTypes';
import { getNewAllowedTemplate } from '../../../hooks/useQuotaFormValues';

const fieldName = 'templates';

const _QuotaAllowedTemplatesArray = ({ push, remove }: FieldArrayRenderProps) => {
  const [field] = useField<AllowedTemplateFormValues[]>({
    name: fieldName,
  });
  const [{ value: budget }] = useField<number | undefined>('budget');
  const { t } = useTranslation();
  const onAddTemplate = () => {
    push(getNewAllowedTemplate(budget));
  };

  return (
    <>
      {field.value.map((data, templateIdx) => {
        return (
          <WithRemoveButton
            key={templateIdx}
            onRemove={() => remove(templateIdx)}
            isRemoveDisabled={field.value.length === 1}
            ariaLabel={t('Remove template')}
          >
            <AllowedTemplateFormFields
              fieldName={`${fieldName}[${templateIdx}]`}
              idx={templateIdx}
            />
          </WithRemoveButton>
        );
      })}
      <Button
        isInline
        variant="link"
        onClick={onAddTemplate}
        data-testid="add-quota"
        icon={<PlusIcon />}
      >
        {t('Add another template to this quota')}
      </Button>
    </>
  );
};

const QuotaAllowedTemplatesArray = () => {
  return (
    <FieldArray
      name={fieldName}
      component={_QuotaAllowedTemplatesArray as React.ComponentType<FieldArrayRenderProps | void>}
    />
  );
};

export default QuotaAllowedTemplatesArray;
