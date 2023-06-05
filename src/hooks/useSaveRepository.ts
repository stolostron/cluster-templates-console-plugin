import {
  k8sCreate,
  k8sPatch,
  k8sUpdate,
  useK8sModels,
} from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { secretGVK, ARGOCD_SECRET_LABELS } from '../constants';
import { ArgoCDSecretData, ConfigMap, DecodedSecret, Secret } from '../types/resourceTypes';
import useArgocdNamespace from './useArgocdNamespace';
import { useArgoCDCertificateAuthorityCM } from './useArgoCDSecrets';
import { useHelmChartRepositories } from './useHelmChartRepositories';
import URLParse from 'url-parse';
import { RepositoryFormValues } from '../components/Repositories/types';
const getRepoSecretStringData = (formValues: RepositoryFormValues): { [key: string]: string } => {
  const { name, url, type, useCredentials, username, password, allowSelfSignedCa } = formValues;

  const baseSecretData: { [key: string]: string } = {
    name,
    url,
    type,
  };

  baseSecretData.insecure = allowSelfSignedCa ? 'true' : 'false';

  const authenticatedSecretData = {
    username,
    password,
  };

  return useCredentials ? { ...baseSecretData, ...authenticatedSecretData } : baseSecretData;
};

export const useSaveCertificateAuthority = (): [
  (url: string, ca: string) => Promise<void>,
  boolean,
  unknown,
] => {
  const [configMap, configMapLoaded, configMapError] = useArgoCDCertificateAuthorityCM();
  const [{ ConfigMap: configMapModel }, modelsLoading] = useK8sModels();

  const save = React.useCallback(
    async (url: string, ca: string): Promise<void> => {
      const hostname = new URLParse(url).hostname;
      if (!hostname) {
        return Promise.reject(`Failed to extract hostname from URL ${url}`);
      }
      if (
        (configMap.data && configMap.data[hostname] === ca) ||
        (!configMap.data?.[hostname] && ca === '')
      ) {
        return Promise.resolve();
      }

      const newData = configMap.data || {};
      if (newData[hostname] && !ca) {
        delete newData[hostname];
      } else {
        newData[hostname] = ca;
      }
      await k8sUpdate<ConfigMap>({
        data: { ...configMap, data: newData },
        model: configMapModel,
      });
    },
    [configMap, configMapModel],
  );
  return [save, configMapLoaded && !modelsLoading, configMapError];
};

export const useUpdateRepository = (
  repo: DecodedSecret<ArgoCDSecretData>,
): [(formValues: RepositoryFormValues) => Promise<void>, boolean, unknown] => {
  const [{ Secret: secretModel }, modelsLoading] = useK8sModels();
  const [saveCa, saveCaLoaded, saveCaError] = useSaveCertificateAuthority();
  const { refetch } = useHelmChartRepositories();
  const save = React.useCallback(
    async (formValues: RepositoryFormValues): Promise<void> => {
      const { url, certificateAuthority, allowSelfSignedCa, type } = formValues;
      if (!allowSelfSignedCa) {
        await saveCa(url, certificateAuthority);
      }
      const stringData = getRepoSecretStringData(formValues);

      await k8sPatch<DecodedSecret<ArgoCDSecretData>>({
        model: secretModel,
        resource: repo,
        data: [
          {
            op: 'replace',
            path: '/stringData',
            value: stringData,
          },
        ],
      });
      if (type === 'helm') {
        void refetch();
      }
    },
    [refetch, repo, saveCa, secretModel],
  );
  return [save, !modelsLoading && saveCaLoaded, saveCaError];
};

export const useCreateRepository = (): [
  (formValues: RepositoryFormValues) => Promise<void>,
  boolean,
  unknown,
] => {
  const [namespace, namespaceLoaded, namespaceError] = useArgocdNamespace();
  const [{ Secret: secretModel }, modelsLoading] = useK8sModels();
  const [saveCa, saveCaLoaded, saveCaError] = useSaveCertificateAuthority();
  const { refetch } = useHelmChartRepositories();
  const save = React.useCallback(
    async (formValues: RepositoryFormValues): Promise<void> => {
      const { name, url, certificateAuthority, allowSelfSignedCa, type } = formValues;
      if (!allowSelfSignedCa && certificateAuthority) {
        await saveCa(url, certificateAuthority);
      }
      const stringData = getRepoSecretStringData(formValues);
      await k8sCreate<Secret>({
        model: secretModel,
        data: {
          apiVersion: secretGVK.version,
          kind: secretGVK.kind,
          metadata: {
            name,
            namespace,
            labels: ARGOCD_SECRET_LABELS,
          },
          stringData: stringData,
          type: 'Opaque',
        },
      });
      if (type === 'helm') {
        void refetch();
      }
    },
    [namespace, refetch, saveCa, secretModel],
  );
  return [save, saveCaLoaded && !modelsLoading && namespaceLoaded, saveCaError || namespaceError];
};
