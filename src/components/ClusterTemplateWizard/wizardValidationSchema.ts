import React from 'react';
import {
  object as objectSchema,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
  mixed as mixedSchema,
} from 'yup';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { useTranslation } from '../../hooks/useTranslation';
import {
  nameSchema,
  NameValidationType,
  positiveIntegerSchema,
} from '../../utils/commonValidationSchemas';
import { QuotaOptionObject } from './types';

const useWizardValidationSchema = (isCreateFlow: boolean) => {
  //Chose to not handle loading and error of useClusterTemplates
  //It's used for testing unique names, if it fails or not loaded yet, the backend will block the creation
  const [clusterTemplates] = useClusterTemplates();
  const usedTemplateNames = React.useMemo(
    () => clusterTemplates.map((template) => template.metadata?.name).filter(Boolean) as string[],
    [clusterTemplates],
  );
  const { t } = useTranslation();

  const requiredMsg = t('Required');

  const helmValidationSchema = objectSchema().shape({
    url: stringSchema().required(requiredMsg),
    chart: stringSchema().required(requiredMsg),
    version: stringSchema().required(requiredMsg),
    destinationNamespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL),
  });

  const quotaValidationSchema = mixedSchema().test({
    name: 'quota-required',
    message: requiredMsg,
    test: (quota: QuotaOptionObject) => !!quota.name,
  });

  const quotaOptionsValidationSchema = objectSchema({
    quota: quotaValidationSchema,
    limitAllowed: booleanSchema(),
    numAllowed: positiveIntegerSchema(t).when('limitAllowed', {
      is: true,
      then: (schema) => schema.required(requiredMsg),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const detailsValidationSchema = objectSchema().shape({
    name: isCreateFlow
      ? stringSchema().required(requiredMsg).concat(nameSchema(t, usedTemplateNames))
      : stringSchema(),
    cost: positiveIntegerSchema(t).required(requiredMsg),
    description: stringSchema().optional(),
  });

  const installationValidationSchema = objectSchema().shape({
    spec: helmValidationSchema,
    useInstanceNamespace: booleanSchema(),
  });

  const getWizardValidationSchema = React.useCallback(
    () =>
      objectSchema().shape({
        details: detailsValidationSchema,
        quotas: arraySchema().of(quotaOptionsValidationSchema),
        installation: installationValidationSchema,
        postInstallation: arraySchema().of(helmValidationSchema),
        isCreateFlow: booleanSchema(),
      }),
    [
      detailsValidationSchema,
      helmValidationSchema,
      installationValidationSchema,
      quotaOptionsValidationSchema,
    ],
  );

  const validationSchema = React.useMemo(() => {
    return getWizardValidationSchema();
  }, [getWizardValidationSchema]);

  return validationSchema;
};

export default useWizardValidationSchema;
