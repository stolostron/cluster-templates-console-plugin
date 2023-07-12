import { dump, load } from 'js-yaml';
import {
  InstanceParameter,
  isPrimitiveValue,
  SupportedJsonSchemaType,
  isSupportedJson7SchemaType,
} from '../types/instanceFormTypes';
import { JSONSchema7 } from 'json-schema';
import {
  ClusterTemplate,
  ClusterTemplateInstance,
  ClusterTemplateInstanceParameter,
  DeserializedClusterTemplate,
} from '../types/resourceTypes';
import { createDownloadFile } from './utils';
type ValuesObj = Record<string, unknown> | undefined;

const getParametersFromSchema = (
  schema: string,
  values: ValuesObj,
): {
  parameters: InstanceParameter[];
  hasUnsupportedParameters: boolean;
} => {
  const parameters: InstanceParameter[] = [];
  const jsonSchema = load(schema) as JSONSchema7;
  let hasUnsupportedParameters = false;
  for (const [key, paramSchema] of Object.entries(jsonSchema.properties || {})) {
    if (typeof paramSchema === 'boolean') {
      // there's no use case for this
      continue;
    }
    const value: unknown = values && values[key] ? values[key] : paramSchema.default;
    if (!isSupportedJson7SchemaType(paramSchema.type) || !isPrimitiveValue(value)) {
      hasUnsupportedParameters = true;
      continue;
    } else {
      parameters.push({
        name: key,
        value,
        required: jsonSchema.required?.includes(key) || false,
        type: paramSchema.type || SupportedJsonSchemaType.STRING,
        description: paramSchema.description,
        title: paramSchema.title || key,
        default: value,
      });
    }
  }
  return { parameters, hasUnsupportedParameters };
};

const getParametersFromValues = (
  values: ValuesObj,
): {
  parameters: InstanceParameter[];
  hasUnsupportedParameters: boolean;
} => {
  let hasUnsupportedParameters = false;
  if (!values) {
    return { parameters: [], hasUnsupportedParameters };
  }
  const parameters: InstanceParameter[] = [];
  for (const [name, value] of Object.entries(values)) {
    if (!isPrimitiveValue(value)) {
      hasUnsupportedParameters = true;
    } else {
      const type = typeof value as SupportedJsonSchemaType;
      parameters.push({ name, value, type, required: false, title: name, default: value });
    }
  }
  return {
    parameters: parameters.sort((param1, param2) => param1.name.localeCompare(param2.name)),
    hasUnsupportedParameters,
  };
};

export const getParameters = (
  valuesStr?: string,
  schemaStr?: string,
): {
  parameters: InstanceParameter[];
  hasUnsupportedParameters: boolean;
} => {
  const values = valuesStr ? (load(valuesStr) as Record<string, unknown>) : undefined;
  return schemaStr ? getParametersFromSchema(schemaStr, values) : getParametersFromValues(values);
};

export const toInstanceParameters = (
  formParameters: InstanceParameter[],
  clusterSetup?: string,
): ClusterTemplateInstanceParameter[] =>
  formParameters.map((param) => ({
    name: param.name,
    value: param.value?.toString(),
    clusterSetup,
  }));

export const getExampleInstance = (
  template: DeserializedClusterTemplate | ClusterTemplate,
): ClusterTemplateInstance => {
  const installationParameters = toInstanceParameters(
    getParameters(
      template.status?.clusterDefinition?.values,
      template.status?.clusterDefinition?.schema,
    ).parameters,
  );
  const parameters: ClusterTemplateInstanceParameter[] =
    template.status?.clusterSetup?.reduce<ClusterTemplateInstanceParameter[]>(
      (prevValue, { values, schema, name }) => [
        ...prevValue,
        ...toInstanceParameters(getParameters(values, schema).parameters, name),
      ],
      installationParameters,
    ) || [];
  return {
    metadata: {
      name: 'example',
      namespace: 'default',
    },
    spec: {
      clusterTemplateRef: template.metadata?.name || '',
      parameters,
    },
  };
};

export const downloadInstanceYaml = (
  clusterTemplate: DeserializedClusterTemplate | ClusterTemplate,
  instance: ClusterTemplateInstance,
) => {
  return createDownloadFile(
    `${clusterTemplate.metadata?.name || ''}_instance.yaml`,
    dump(instance),
  );
};

export const downloadExampleYaml = (
  clusterTemplate: DeserializedClusterTemplate | ClusterTemplate,
) => downloadInstanceYaml(clusterTemplate, getExampleInstance(clusterTemplate));
