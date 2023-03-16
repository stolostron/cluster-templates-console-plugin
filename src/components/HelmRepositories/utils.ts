import { Secret } from '../../types/resourceTypes';

export const SECRET_TYPE = 'kubernetes.io/tls';
export const NAMESPACE = 'openshift-config';

export function getDecodedSecretData(secretData: Secret['data'] = {}) {
  const decodedSecretData = Object.entries(secretData).reduce<{
    ['tls.crt']?: string;
    ['tls.key']?: string;
  }>(
    (res, [key, value]) => ({
      ...res,
      [key]: Buffer.from(value, 'base64').toString('ascii'),
    }),
    {},
  );
  const tlsClientCert = decodedSecretData['tls.crt'];
  const tlsClientKey = decodedSecretData['tls.key'];
  return { tlsClientCert, tlsClientKey };
}

export const getDefaultSecretName = (helmChartRepositoryName?: string) =>
  `${helmChartRepositoryName || 'unknown'}-tls-configs`;
export const getDefaultConfigMapName = (helmChartRepositoryName?: string) =>
  `${helmChartRepositoryName || 'unknown'}-ca-certificate`;
