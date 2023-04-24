import React from 'react';
import {
  object as objectSchema,
  SchemaOf,
  array as arraySchema,
  string as stringSchema,
  boolean as booleanSchema,
  mixed as mixedSchema,
} from 'yup';
import { useTranslation } from '../../hooks/useTranslation';
import { InstanceFormValues, InstanceParameter } from '../../types/instanceFormTypes';
import { nameSchema } from '../../utils/commonValidationSchemas';

const useInstanceValidationSchema = (): SchemaOf<InstanceFormValues> => {
  const { t } = useTranslation();

  const validationSchema: SchemaOf<InstanceFormValues> | undefined = React.useMemo(() => {
    const requiredMsg = t('Required');

    const parametersSchema: SchemaOf<InstanceParameter[]> = arraySchema().of(
      objectSchema().shape({
        name: stringSchema().required(requiredMsg),
        value: mixedSchema().when('required', {
          is: true,
          then: (schema) => schema.required(requiredMsg),
        }),
        required: booleanSchema().required(),
        title: stringSchema().required(),
        description: stringSchema(),
        type: mixedSchema(),
        default: mixedSchema(),
      }),
    );

    return objectSchema().shape({
      name: nameSchema(t).required(requiredMsg),
      namespace: stringSchema().required(requiredMsg),
      installation: objectSchema().shape({
        name: stringSchema().required(),
        parameters: parametersSchema,
      }),
      postInstallation: arraySchema().of(
        objectSchema().shape({
          name: stringSchema().required(),
          parameters: parametersSchema,
        }),
      ),
      hasUnsupportedParameters: booleanSchema().required(),
    });
  }, [t]);
  return validationSchema;
};

export default useInstanceValidationSchema;
