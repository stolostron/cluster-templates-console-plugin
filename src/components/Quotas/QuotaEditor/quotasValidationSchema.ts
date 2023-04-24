import React from 'react';
import {
  object as objectSchema,
  SchemaOf,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
} from 'yup';
import { useTranslation } from '../../../hooks/useTranslation';
import { AllowedTemplateFormValues, QuotaFormValues } from '../../../types/quotaFormTypes';
import { nameSchema, positiveIntegerSchema } from '../../../utils/commonValidationSchemas';

const useQuotasValidationSchema = (isCreateFlow: boolean): SchemaOf<QuotaFormValues> => {
  const { t } = useTranslation();

  const validationSchema: SchemaOf<QuotaFormValues> | undefined = React.useMemo(() => {
    const requiredMsg = t('Required');

    const allowedTemplateSchema: SchemaOf<AllowedTemplateFormValues> = objectSchema().shape({
      template: stringSchema().required(requiredMsg),
      cost: positiveIntegerSchema(t),
      count: positiveIntegerSchema(t),
      showCost: booleanSchema().required(),
      showCount: booleanSchema().required(),
    });

    return objectSchema().shape({
      name: isCreateFlow
        ? stringSchema().concat(nameSchema(t)).required(requiredMsg)
        : stringSchema().required(),
      limitByBudget: booleanSchema().required(),
      namespace: stringSchema().required(requiredMsg),
      budget: positiveIntegerSchema(t).optional(),
      templates: arraySchema().of(allowedTemplateSchema),
      isCreateFlow: booleanSchema().required(),
    });
  }, [t, isCreateFlow]);
  return validationSchema;
};

export default useQuotasValidationSchema;
