import { TFunction } from 'i18next';
import {
  object as objectSchema,
  boolean as booleanSchema,
  number as numberSchema,
  array as arraySchema,
  SchemaOf,
} from 'yup';
import { nameSchema, requiredSchema } from '../../utils/commonValidationSchemas';
import { DetailsFormikValues, QuotaFormikValues, WizardFormikValues } from './types';

const getQuotaValidationSchema = (t: TFunction): SchemaOf<QuotaFormikValues> =>
  objectSchema().shape({
    quota: objectSchema().shape({
      name: requiredSchema(t),
      namespace: requiredSchema(t),
      toString: objectSchema(),
      compareTo: objectSchema().optional(),
    }),
    limitAllowed: booleanSchema(),
    numAllowed: numberSchema().when('limitAllowed', {
      is: true,
      then: (schema) => schema.min(0, t(`Value can't be negative`)),
      otherwise: (schema) => schema.optional(),
    }),
  });

const getDetailsValidationSchema = (t: TFunction): SchemaOf<DetailsFormikValues> =>
  objectSchema().shape({
    name: nameSchema(t),
    helmChart: nameSchema(t),
    helmRepo: nameSchema(t),
    cost: numberSchema(),
  });

const getWizardValidationSchema = (t: TFunction): SchemaOf<WizardFormikValues> =>
  objectSchema().shape({
    details: getDetailsValidationSchema(t),
    quotas: arraySchema().of(getQuotaValidationSchema(t)),
  });

export default getWizardValidationSchema;
