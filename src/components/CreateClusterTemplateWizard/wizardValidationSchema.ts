import { TFunction } from 'i18next';
import {
  object as objectSchema,
  boolean as booleanSchema,
  number as numberSchema,
  array as arraySchema,
  string as stringSchema,
  SchemaOf,
} from 'yup';
import { nameSchema } from '../../utils/commonValidationSchemas';
import { DetailsFormikValues, QuotaFormikValues, WizardFormikValues } from './types';
import { ArgoCDSpecFormikValues } from './types';

const getArgoCDSpecValidationSchema = (t: TFunction): SchemaOf<ArgoCDSpecFormikValues> =>
  objectSchema().shape({
    repoURL: stringSchema().required(t('Required')),
    chart: stringSchema().required(t('Required')),
    version: stringSchema(),
    destinationNamespace: nameSchema(t).optional(),
  });

const getQuotaValidationSchema = (t: TFunction): SchemaOf<QuotaFormikValues> =>
  objectSchema().shape({
    quota: objectSchema().shape({
      name: stringSchema().required(t('Required')),
      namespace: stringSchema().required(t('Required')),
      toString: objectSchema(),
      compareTo: objectSchema().optional(),
    }),
    limitAllowed: booleanSchema(),
    numAllowed: numberSchema()
      .integer()
      .when('limitAllowed', {
        is: true,
        then: (schema) => schema.min(0, t(`Please enter a positive value`)),
        otherwise: (schema) => schema.optional(),
      }),
  });

const getDetailsValidationSchema = (t: TFunction): SchemaOf<DetailsFormikValues> =>
  objectSchema().shape({
    name: nameSchema(t),
    cost: numberSchema().min(0, t(`Please enter a positive value`)).required(t('Required')),
    argocdNamespace: stringSchema().required(t('Required')),
  });

const getWizardValidationSchema = (t: TFunction): SchemaOf<WizardFormikValues> =>
  objectSchema().shape({
    details: getDetailsValidationSchema(t),
    quotas: arraySchema().of(getQuotaValidationSchema(t)),
    installation: getArgoCDSpecValidationSchema(t),
    postInstallation: arraySchema().of(getArgoCDSpecValidationSchema(t)),
  });

export default getWizardValidationSchema;
