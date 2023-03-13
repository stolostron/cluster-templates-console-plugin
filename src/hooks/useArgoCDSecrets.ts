import * as React from 'react';
import { secretGVK } from '../constants';
import { ArgoCDSecretData, DecodedSecret, Secret } from '../types/resourceTypes';
import { getDecodedSecretData } from '../utils/secrets';
import { useK8sWatchResource } from './k8s';
import useArgocdNamespace from './useArgocdNamespace';

const initResource = (namespace: string | undefined) =>
  namespace
    ? {
        groupVersionKind: secretGVK,
        isList: true,
        namespace,
        selector: { matchLabels: { 'argocd.argoproj.io/secret-type': 'repository' } },
      }
    : null;

export const useArgoCDSecrets = (): ReturnType<
  typeof useK8sWatchResource<DecodedSecret<ArgoCDSecretData>[]>
> => {
  const [namespace, namespaceLoaded, namespaceError] = useArgocdNamespace();
  const [secrets, loaded, loadError] = useK8sWatchResource<Secret[]>(initResource(namespace));
  const decodedSecrets = secrets
    ? secrets.map((secret) => ({
        ...secret,
        data: getDecodedSecretData<ArgoCDSecretData>(secret.data),
      }))
    : [];
  return [decodedSecrets, loaded && namespaceLoaded, loadError || namespaceError];
};

export const useArgoCDSecretsCount = () => {
  const [secrets, loaded, loadError] = useArgoCDSecrets();
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
