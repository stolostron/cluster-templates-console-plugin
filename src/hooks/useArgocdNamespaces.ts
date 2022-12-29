import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { argoCDGVK } from '../constants';

const useArgocdNamespaces = (): [string[], boolean, unknown] => {
  const [argoCdInsts, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: argoCDGVK,
    isList: true,
  });
  const namespaces = React.useMemo(() => {
    if (!loaded || error) {
      return [];
    }
    return argoCdInsts.map((inst) => inst.metadata?.namespace);
  }, [argoCdInsts]);
  return [namespaces, loaded, error];
};

export default useArgocdNamespaces;
