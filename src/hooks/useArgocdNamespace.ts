import { configGVK } from '../constants';
import { isApiError } from '../types/errorTypes';
import { ClaasConfig } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';

const OPERATOR_NAMESPACE = 'cluster-aas-operator';

const isNotFoundError = (error: unknown) => error && isApiError(error) && error.code === 404;

const useArgocdNamespace = (): [string, boolean, unknown] => {
  const [config, loaded, error] = useK8sWatchResource<ClaasConfig>({
    groupVersionKind: configGVK,
    name: 'config',
  });
  if (!loaded) {
    return ['', false, null];
  } else if (error && !isNotFoundError(error)) {
    return ['', true, error];
  } else if (config && config.spec && config.spec.argoCDNamespace) {
    return [config.spec.argoCDNamespace, true, null];
  } else {
    return [OPERATOR_NAMESPACE, true, null];
  }
};

export default useArgocdNamespace;
