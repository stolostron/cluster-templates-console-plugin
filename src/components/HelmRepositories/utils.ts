import * as Yup from 'yup';
import { Secret } from '../../types';
import { TFunction } from 'react-i18next';

export const SECRET_TYPE = 'kubernetes.io/tls';
export const NAMESPACE = 'openshift-config';

export const getValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    name: Yup.string().required(t('Required.')),
    url: Yup.string()
      .url(t('URL must be a valid URL starting with "http://" or "https://"'))
      .required(t('Required.')),
    useCredentials: Yup.boolean(),
    username: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    password: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    // tlsClientCertData: Yup.string().when('useCredentials', {
    //   is: true,
    //   then: (schema) => schema.required(t('Required.')),
    // }),
    // tlsClientCertKey: Yup.string().when('useCredentials', {
    //   is: true,
    //   then: (schema) => schema.required(t('Required.')),
    // }),
  });

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
