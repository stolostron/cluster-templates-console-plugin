import { configMapGVK } from '../constants';
import { ConfigMap } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';

const OPERATOR_NAMESPACE = 'cluster-aas-operator';
const useArgocdNamespace = (): [string, boolean, unknown] => {
  const [configMap, loaded, error] = useK8sWatchResource<ConfigMap>({
    groupVersionKind: configMapGVK,
    name: 'claas-config',
    namespace: OPERATOR_NAMESPACE,
  });
  if (!loaded || error) {
    return ['', loaded, error];
  }
  if (!configMap.data || !configMap.data['argocd-ns']) {
    return [OPERATOR_NAMESPACE, true, ''];
  }
  return [configMap.data['argocd-ns'], true, ''];
};

export default useArgocdNamespace;
