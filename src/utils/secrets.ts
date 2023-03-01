import { Secret } from '../types/resourceTypes';
import { Buffer } from 'buffer';

export function getDecodedSecretData<T extends Record<string, unknown>>(
  secretData: Secret['data'] = {},
) {
  const decodedSecretData = Object.entries(secretData).reduce(
    (res, [key, value]) => ({
      ...res,
      [key]: Buffer.from(value, 'base64').toString('ascii'),
    }),
    {} as T,
  );
  return decodedSecretData;
}
