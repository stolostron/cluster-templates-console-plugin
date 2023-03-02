import { configMapGVK } from '../constants';
import { ConfigMap } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';
import { useTranslation } from './useTranslation';

const useArgocdNamespace = (): [string | undefined, boolean, unknown] => {
  const { t } = useTranslation();
  const [configMap, loaded, error] = useK8sWatchResource<ConfigMap>({
    groupVersionKind: configMapGVK,
    name: 'claas-config',
    namespace: 'cluster-aas-operator',
  });
  if (!loaded || error) {
    return [undefined, loaded, error];
  }
  if (!configMap.data || !configMap.data['argocd-ns']) {
    return [
      undefined,
      true,
      new Error(t('Failed to find argocd namespace in ConfigMap claas-config')),
    ];
  }
  return [configMap.data['argocd-ns'], true, undefined];
};

export default useArgocdNamespace;
