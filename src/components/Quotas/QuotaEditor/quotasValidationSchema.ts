import React from 'react';
import {
  object as objectSchema,
  SchemaOf,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
} from 'yup';
import { useAllQuotas } from '../../../hooks/useQuotas';
import { useTranslation } from '../../../hooks/useTranslation';
import { AllowedTemplateFormValues, QuotaFormValues } from '../../../types/quotaFormTypes';
import { nameSchema, positiveIntegerSchema } from '../../../utils/commonValidationSchemas';

const useQuotasValidationSchema = (
  isCreateFlow: boolean,
): [SchemaOf<QuotaFormValues> | undefined, boolean, unknown] => {
  const { t } = useTranslation();
  const [allTemplates, loaded, error] = useAllQuotas();

  const validationSchema: SchemaOf<QuotaFormValues> | undefined = React.useMemo(() => {
    if (!loaded || error) {
      return undefined;
    }
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
        ? stringSchema()
            .concat(
              nameSchema(
                t,
                allTemplates.map((template) => template.metadata?.name || ''),
              ),
            )
            .required(requiredMsg)
        : stringSchema().required(),
      limitByBudget: booleanSchema().required(),
      namespace: stringSchema().required(requiredMsg),
      budget: positiveIntegerSchema(t).optional(),
      templates: arraySchema().of(allowedTemplateSchema),
      isCreateFlow: booleanSchema().required(),
    });
  }, [allTemplates, loaded, error, t, isCreateFlow]);
  return [validationSchema, loaded, error];
};

export default useQuotasValidationSchema;
