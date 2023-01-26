import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { argoCDGVK } from '../constants';
import { CorrectWatchK8sResult } from '../types';

const useArgocdNamespaces = (): [string[], boolean, unknown] => {
  const [argoCdInsts, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: argoCDGVK,
    isList: true,
  }) as CorrectWatchK8sResult<K8sResourceCommon[]>;
  const namespaces = React.useMemo(() => {
    if (!loaded || error) {
      return [];
    }
    return argoCdInsts.map((inst) => inst.metadata?.namespace || '');
  }, [argoCdInsts, error, loaded]);
  return [namespaces, loaded, error];
};

export default useArgocdNamespaces;
