import React from 'react';
import {
  object as objectSchema,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
  SchemaOf,
} from 'yup';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { useTranslation } from '../../hooks/useTranslation';
import {
  nameSchema,
  NameValidationType,
  positiveIntegerSchema,
} from '../../utils/commonValidationSchemas';
import {
  ArgoCDSpecFormikValues,
  DetailsFormikValues,
  InstallationFormikValues,
  QuotaFormikValues,
  WizardFormikValues,
} from './types';

const useWizardValidationSchema = (isCreateFlow): SchemaOf<WizardFormikValues> => {
  //Chose to not handle loading and error of useClusterTemplates
  //It's used for testing unique names, if it fails or not loaded yet, the backend will block the creation
  const [clusterTemplates] = useClusterTemplates();
  const usedTemplateNames = React.useMemo(
    () => clusterTemplates.map((template) => template.metadata?.name),
    [clusterTemplates],
  );
  const { t } = useTranslation();

  const requiredMsg = t('Required');

  const getHelmValidationSchema = (): SchemaOf<ArgoCDSpecFormikValues> =>
    objectSchema().shape({
      repo: objectSchema().shape({
        resourceName: stringSchema().required(requiredMsg),
        url: stringSchema().required(requiredMsg),
        toString: objectSchema(),
        compareTo: objectSchema().optional(),
      }),
      chart: stringSchema().required(requiredMsg),
      version: stringSchema(),
      destinationNamespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL),
    });

  const getQuotaValidationSchema = (): SchemaOf<QuotaFormikValues> =>
    objectSchema().shape({
      quota: objectSchema().shape({
        name: stringSchema().required(requiredMsg),
        namespace: stringSchema().required(requiredMsg),
        toString: objectSchema(),
        compareTo: objectSchema().optional(),
      }),
      limitAllowed: booleanSchema(),
      numAllowed: positiveIntegerSchema(t).when('limitAllowed', {
        is: true,
        then: (schema) => schema.required(requiredMsg),
        otherwise: (schema) => schema.optional(),
      }),
    });

  const getDetailsValidationSchema = (): SchemaOf<DetailsFormikValues> =>
    objectSchema().shape({
      name: isCreateFlow ? nameSchema(t, usedTemplateNames) : stringSchema(),
      cost: positiveIntegerSchema(t).required(requiredMsg),
      description: stringSchema().optional(),
    });

  const getInstallationValidationSchema = (): SchemaOf<InstallationFormikValues> =>
    objectSchema().shape({
      spec: getHelmValidationSchema(),
      useInstanceNamespace: booleanSchema(),
    });

  const getWizardValidationSchema = (): SchemaOf<WizardFormikValues> =>
    objectSchema().shape({
      details: getDetailsValidationSchema(),
      quotas: arraySchema().of(getQuotaValidationSchema()),
      installation: getInstallationValidationSchema(),
      postInstallation: arraySchema().of(getHelmValidationSchema()),
      isCreateFlow: booleanSchema(),
    });

  const validationSchema = React.useMemo(() => {
    return getWizardValidationSchema();
  }, [clusterTemplates]);

  return validationSchema;
};

export default useWizardValidationSchema;
