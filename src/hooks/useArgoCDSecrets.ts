import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import * as React from 'react';
import { ARGOCD_NAMESPACE, secretGVK } from '../constants';
import { ArgoCDSecretData, CorrectWatchK8sResult, DecodedSecret, Secret } from '../types';
import { getDecodedSecretData } from '../utils/secrets';

const initResource = {
  groupVersionKind: secretGVK,
  isList: true,
  namespace: ARGOCD_NAMESPACE,
  selector: { matchLabels: { 'argocd.argoproj.io/secret-type': 'repository' } },
};

export const useArgoCDSecrets = (): CorrectWatchK8sResult<DecodedSecret<ArgoCDSecretData>[]> => {
  const [secrets, loaded, loadError] = useK8sWatchResource<Secret[]>(
    initResource,
  ) as CorrectWatchK8sResult<Secret[]>;

  const decodedSecrets = secrets.map((secret) => ({
    ...secret,
    data: getDecodedSecretData<ArgoCDSecretData>(secret.data),
  }));
  const helmTypeSecrets = decodedSecrets.filter((secret) => secret.data.type === 'helm');
  return [helmTypeSecrets, loaded, loadError];
};

export const useArgoCDSecretsCount = () => {
  const [secrets, loaded, loadError] = useK8sWatchResource<Secret[]>(
    initResource,
  ) as CorrectWatchK8sResult<Secret[]>;
  return loaded && !loadError ? secrets.length : undefined;
};

export const useArgoCDSecretByRepoUrl = (
  repoUrl: string,
): [DecodedSecret<ArgoCDSecretData> | undefined, boolean, unknown] => {
  const [secrets, loaded, loadError] = useArgoCDSecrets();
  const secret = React.useMemo(
    () => secrets.find((secret) => secret.data?.url === repoUrl),
    [secrets, repoUrl],
  );
  return [secret, loaded, loadError];
};
