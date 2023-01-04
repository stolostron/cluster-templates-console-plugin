import { TFunction } from 'i18next';
import { number as numberSchema, object as objectSchema } from 'yup';
import { nameSchema } from '../../../utils/commonValidationSchemas';

const getNewQuotaValidationSchema = (t: TFunction, clusterTemplateCost: number) =>
  objectSchema().shape({
    name: nameSchema(t),
    namespace: nameSchema(t),
    budget: numberSchema().when('hasBudget', {
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

export default getNewQuotaValidationSchema;
