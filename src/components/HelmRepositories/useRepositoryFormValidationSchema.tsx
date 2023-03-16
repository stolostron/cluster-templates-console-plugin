import { nameSchema } from '../../utils/commonValidationSchemas';
import {
  string as stringSchema,
  boolean as booleanSchema,
  object as objectSchema,
  SchemaOf,
} from 'yup';
import { useTranslation } from '../../hooks/useTranslation';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import { RepositoryFormValues } from './types';
import React from 'react';

const useRepositoryFormValidationSchema = (
  isCreateFlow: boolean,
): [SchemaOf<RepositoryFormValues>, boolean, unknown] => {
  const { t } = useTranslation();
  const [secrets, loaded, error] = useArgoCDSecrets();

  const validationSchema = React.useMemo(() => {
    const usedSecretNames = secrets.map((secret) => secret.data?.name);
    const requiredMsg = t('Required');
    return objectSchema().shape({
      name: isCreateFlow
        ? nameSchema(t, usedSecretNames as string[]).required(requiredMsg)
        : stringSchema(),
      url: stringSchema().url().required(requiredMsg),
      useCredentials: booleanSchema(),
      username: stringSchema().when('useCredentials', {
        is: true,
        then: (schema) => schema.required(requiredMsg),
      }),
      password: stringSchema().when('useCredentials', {
        is: true,
        then: (schema) => schema.required(requiredMsg),
      }),
      type: stringSchema().required(),
    });
  }, [isCreateFlow, secrets, t]);
  return [validationSchema as SchemaOf<RepositoryFormValues>, loaded, error];
};

export default useRepositoryFormValidationSchema;
