import { k8sGet, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  object as objectSchema,
  boolean as booleanSchema,
  number as numberSchema,
  array as arraySchema,
  string as stringSchema,
  SchemaOf,
} from 'yup';
import { clusterTemplateGVK } from '../../constants';
import { nameSchema } from '../../utils/commonValidationSchemas';
import {
  ArgoCDSpecFormikValues,
  DetailsFormikValues,
  InstallationFormikValues,
  QuotaFormikValues,
  WizardFormikValues,
} from './types';

const useWizardValidationSchema = (
  isEditFlow: boolean,
): [SchemaOf<WizardFormikValues> | undefined, boolean] => {
  const [clusterTemplatesModel, loading] = useK8sModel(clusterTemplateGVK);
  const { t } = useTranslation();

  const getHelmValidationSchema = (): SchemaOf<ArgoCDSpecFormikValues> =>
    objectSchema().shape({
      repo: objectSchema().shape({
        resourceName: stringSchema().required(t('Required')),
        url: stringSchema().required(t('Required')),
        toString: objectSchema(),
        compareTo: objectSchema().optional(),
      }),
      chart: stringSchema().required(t('Required')),
      version: stringSchema(),
      destinationNamespace: nameSchema(t),
    });

  const getQuotaValidationSchema = (): SchemaOf<QuotaFormikValues> =>
    objectSchema().shape({
      quota: objectSchema().shape({
        name: stringSchema().required(t('Required')),
        namespace: stringSchema().required(t('Required')),
        toString: objectSchema(),
        compareTo: objectSchema().optional(),
      }),
      limitAllowed: booleanSchema(),
      numAllowed: numberSchema()
        .integer('Please enter a whole number')
        .when('limitAllowed', {
          is: true,
          then: (schema) => schema.min(0, t(`Please enter a positive value`)),
          otherwise: (schema) => schema.optional(),
        }),
    });

  const getNameValidationSchema = () => {
    if (isEditFlow) {
      return stringSchema();
    }
    const conflictErrorMsg = t('Cluster template already exists');
    return nameSchema(t)
      .required(t('Required'))
      .test('cluster-template-exists', conflictErrorMsg, async (value) => {
        if (!value) {
          return true;
        }
        try {
          await k8sGet({ model: clusterTemplatesModel, name: value });
          return false;
        } catch (err) {
          return true;
        }
      });
  };

  const getDetailsValidationSchema = (): SchemaOf<DetailsFormikValues> =>
    objectSchema().shape({
      name: getNameValidationSchema(),
      cost: numberSchema().min(0, t(`Please enter a positive value`)).required(t('Required')),
      argocdNamespace: stringSchema().required(t('Required')),
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
    if (loading) {
      return undefined;
    }
    return getWizardValidationSchema();
  }, [loading]);
  return [validationSchema, !loading];
};

export default useWizardValidationSchema;
