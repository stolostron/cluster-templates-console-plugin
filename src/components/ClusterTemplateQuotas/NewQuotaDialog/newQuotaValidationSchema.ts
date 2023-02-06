import { useAllQuotas } from '../../../hooks/useQuotas';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  integerSchema,
  nameSchema,
  NameValidationType,
} from '../../../utils/commonValidationSchemas';
import { object as objectSchema } from 'yup';
import React from 'react';

const useNewQuotaValidationSchema = (clusterTemplateCost: number) => {
  const { t } = useTranslation();
  //Chose to not handle loading and error of useAllQuotas
  //It's used for testing unique names, if it fails or not loaded yet, the backend will block the creation
  const [allQuotas] = useAllQuotas();
  const usedQuotaNames = React.useMemo(
    () =>
      allQuotas.reduce<string[]>(
        (res, quota) => (quota.metadata?.name ? [...res, quota.metadata?.name] : res),
        [],
      ),
    [allQuotas],
  );

  const validationSchema = React.useMemo(() => {
    const getNewQuotaValidationSchema = () =>
      objectSchema().shape({
        name: nameSchema(t, usedQuotaNames).required(t('Required')),
        namespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL).required(t('Required')),
        budget: integerSchema(t).when('hasBudget', {
          is: true,
          then: (schema) =>
            schema.min(
              clusterTemplateCost,
              t(`The budget must exceed the cost of the cluster template: {{cost}}`, {
                cost: clusterTemplateCost,
              }),
            ),
          otherwise: (schema) => schema.optional(),
        }),
      });

    return getNewQuotaValidationSchema();
  }, [clusterTemplateCost, t, usedQuotaNames]);
  return validationSchema;
};

export default useNewQuotaValidationSchema;
