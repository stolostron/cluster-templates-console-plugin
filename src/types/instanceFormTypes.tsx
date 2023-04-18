import { ArgoCDSpec } from './resourceTypes';
import { JSONSchema7 } from 'json-schema';

export enum SupportedJsonSchemaType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  INTEGER = 'integer',
}

export const isSupportedJson7SchemaType = (
  type?: JSONSchema7['type'],
): type is SupportedJsonSchemaType => {
  if (type === undefined) {
    return true;
  } else if (typeof type !== 'string') {
    return false;
  } else {
    return ['string', 'boolean', 'number', 'integer'].includes(type);
  }
};

export type PrimitiveValue = string | boolean | number | undefined | null;

export const isPrimitiveValue = (value: unknown): value is PrimitiveValue => {
  return (
    value === undefined || value === null || ['string', 'boolean', 'number'].includes(typeof value)
  );
};

export type InstanceParameter = {
  name: string;
  value: PrimitiveValue;
  required: boolean;
  type: SupportedJsonSchemaType;
  description?: string;
  title?: string;
  default: PrimitiveValue;
};

export type InstanceParametersFormValues = {
  name: string;
  argoSpec: ArgoCDSpec;
  parameters: InstanceParameter[];
};

export type InstanceFormValues = {
  name: string;
  namespace: string;
  installation: Omit<InstanceParametersFormValues, 'name'>;
  postInstallation: InstanceParametersFormValues[];
  hasUnsupportedParameters: boolean;
};
