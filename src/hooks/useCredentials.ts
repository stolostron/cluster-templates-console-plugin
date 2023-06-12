import { WatchK8sResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { secretGVK } from '../constants';
import { ClusterTemplateInstance, Secret } from '../types/resourceTypes';
import { getDecodedSecretData } from '../utils/secrets';
import { useK8sWatchResource } from './k8s';

export type CredentialsData = {
  username: string;
  password: string;
  serverUrl: string;
};

type UseCredentialsResult = [CredentialsData | null, boolean, unknown];

const useCredentials = (instance: ClusterTemplateInstance): UseCredentialsResult => {
  const initResource: WatchK8sResource | null = instance.status?.adminPassword?.name
    ? {
        groupVersionKind: secretGVK,
        name: instance.status?.adminPassword?.name,
        namespace: instance.metadata?.namespace || '',
      }
    : null;
  const [secret, secretLoaded, secretError] = useK8sWatchResource<Secret>(initResource);
  const result: [CredentialsData | null, boolean, unknown] =
    React.useMemo<UseCredentialsResult>(() => {
      if (!secretLoaded || secretError || !secret) {
        return [null, secretLoaded, secretError];
      }
      const credentials = getDecodedSecretData(secret.data) as unknown as CredentialsData;
      credentials.serverUrl = instance.status?.apiServerURL || '';
      return [credentials, true, null];
    }, [instance.status?.apiServerURL, secret, secretError, secretLoaded]);

  return result;
};

export default useCredentials;
