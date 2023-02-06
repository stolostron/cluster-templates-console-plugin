import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { argoCDGVK } from '../constants';
import { useK8sWatchResource } from './k8s';

const useArgocdNamespaces = (): [string[], boolean, unknown] => {
  const [argoCdInsts, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: argoCDGVK,
    isList: true,
  });
  const namespaces = React.useMemo(() => {
    if (!loaded || error) {
      return [];
    }
    return argoCdInsts.map((inst) => inst.metadata?.namespace || '');
  }, [argoCdInsts, error, loaded]);
  return [namespaces, loaded, error];
};

export default useArgocdNamespaces;
