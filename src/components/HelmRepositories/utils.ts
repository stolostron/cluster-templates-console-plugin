import React from 'react';
import * as Yup from 'yup';
import { FormikProps } from 'formik';
import { HelmRepositoryFormValues } from './types';
import { ConfigMap, HelmChartRepository, Secret } from '../../types';
import { TFunction } from 'react-i18next';
import { k8sCreate, k8sDelete, K8sModel, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { configMapGVK, secretGVK } from '../../constants';

export const SECRET_TYPE = 'kubernetes.io/tls';
export const NAMESPACE = 'openshift-config';

export const getValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    name: Yup.string().required(t('Required.')),
    url: Yup.string()
      .url(t('URL must be a valid URL starting with "http://" or "https://"'))
      .required(t('Required.')),
    useCredentials: Yup.boolean(),
    caCertificate: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    tlsClientCert: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    tlsClientKey: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
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

const setTlsConfigValues = async (
  value: HelmRepositoryFormValues['existingSecretName'],
  { setFieldTouched, setFieldValue }: FormikProps<HelmRepositoryFormValues>,
  availableTlsSecrets: Secret[],
) => {
  const { tlsClientCert, tlsClientKey } = getDecodedSecretData(
    availableTlsSecrets.find((secret) => secret.metadata?.name === value)?.data,
  );
  await setFieldValue('tlsClientCert', tlsClientCert || '', true);
  setFieldTouched('tlsClientCert', true, false);
  await setFieldValue('tlsClientKey', tlsClientKey || '', true);
  setFieldTouched('tlsClientKey', true, false);
};

const setCaCertificateValue = async (
  value: HelmRepositoryFormValues['existingConfigMapName'],
  { setFieldTouched, setFieldValue }: FormikProps<HelmRepositoryFormValues>,
  configMaps: ConfigMap[],
) => {
  await setFieldValue(
    'caCertificate',
    configMaps.find((cm) => cm.metadata?.name === value)?.data?.['ca-bundle.crt'] || '',
    true,
  );
  setFieldTouched('caCertificate', true, false);
};

export const useFieldChangeHandlers = (
  formikProps: FormikProps<HelmRepositoryFormValues>,
  configMaps: ConfigMap[],
  availableTlsSecrets: Secret[],
) => {
  const { values } = formikProps;

  const isInitialRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (!isInitialRenderRef.current)
      setCaCertificateValue(values.existingConfigMapName, formikProps, configMaps);
  }, [values.existingConfigMapName]);

  React.useEffect(() => {
    if (!isInitialRenderRef.current)
      setTlsConfigValues(values.existingSecretName, formikProps, availableTlsSecrets);
  }, [values.existingSecretName]);

  React.useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);
};

export const getHelmRepoConnectionConfigPatch = ({
  url,
  useCredentials,
  secretName,
  configMapName,
}: {
  url: string;
  useCredentials: boolean;
  secretName: string;
  configMapName: string;
}): HelmChartRepository['spec']['connectionConfig'] => {
  if (useCredentials) {
    return {
      url,
      tlsClientConfig: { name: secretName },
      ca: { name: configMapName },
    };
  }
  return { url };
};

export const getCommonPromises = ({
  secrets,
  configMaps,
  secretModel,
  configMapModel,
  configMapName,
  secretName,
  helmChartRepository,
  formValues: { useCredentials, tlsClientCert, tlsClientKey, caCertificate, name },
}: {
  secretModel: K8sModel;
  configMapModel: K8sModel;
  configMaps: ConfigMap[];
  secrets: Secret[];
  configMapName: string;
  secretName: string;
  formValues: HelmRepositoryFormValues;
  helmChartRepository?: HelmChartRepository;
}) => {
  const configMapToUpdate = configMaps.find((cm) => cm.metadata?.name === configMapName);
  const secretToUpdate = secrets.find((s) => s.metadata?.name === secretName);
  const helmChartRepositoryName = helmChartRepository?.metadata?.name || name;

  const promises = [];

  if (!secretToUpdate && useCredentials) {
    promises.push(
      k8sCreate<Secret>({
        model: secretModel,
        data: {
          apiVersion: secretGVK.version,
          kind: secretGVK.kind,
          metadata: {
            name: secretName,
            namespace: NAMESPACE,
            // labels: { },
          },
          data: {
            ['tls.crt']: Buffer.from(tlsClientCert, 'ascii').toString('base64'),
            ['tls.key']: Buffer.from(tlsClientKey, 'ascii').toString('base64'),
          },
          type: SECRET_TYPE,
        },
      }),
    );
  }
  if (!configMapToUpdate && useCredentials) {
    promises.push(
      k8sCreate<ConfigMap>({
        model: configMapModel,
        data: {
          apiVersion: configMapGVK.version,
          kind: configMapGVK.kind,
          metadata: {
            name: configMapName,
            namespace: NAMESPACE,
          },
          data: {
            ['ca-bundle.crt']: caCertificate,
          },
        },
      }),
    );
  }
  if (secretToUpdate && useCredentials) {
    promises.push(
      k8sPatch<Secret>({
        model: secretModel,
        resource: secretToUpdate,
        data: [
          {
            op: 'add',
            path: '/data/tls.crt',
            value: Buffer.from(tlsClientCert, 'ascii').toString('base64'),
          },
          {
            op: 'add',
            path: '/data/tls.key',
            value: Buffer.from(tlsClientKey, 'ascii').toString('base64'),
          },
        ],
      }),
    );
  }
  if (configMapToUpdate && useCredentials) {
    promises.push(
      k8sPatch<ConfigMap>({
        model: configMapModel,
        resource: configMapToUpdate,
        data: [
          {
            op: 'add',
            path: '/data/ca-bundle.crt',
            value: caCertificate,
          },
        ],
      }),
    );
  }
  if (
    secretToUpdate &&
    !useCredentials &&
    secretToUpdate.metadata?.name === getDefaultSecretName(helmChartRepositoryName)
  ) {
    promises.push(k8sDelete<Secret>({ model: secretModel, resource: secretToUpdate }));
  }
  if (
    configMapToUpdate &&
    !useCredentials &&
    configMapToUpdate.metadata?.name === getDefaultConfigMapName(helmChartRepositoryName)
  ) {
    promises.push(
      k8sDelete<ConfigMap>({
        model: configMapModel,
        resource: configMapToUpdate,
      }),
    );
  }

  return promises;
};
