import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { namespaceGVK } from '../constants';
import { useK8sWatchResource } from './k8s';

export const useNamespaces = (): [string[], boolean, unknown] => {
  const [allNamespaces, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: namespaceGVK,
    isList: true,
  });
  const namespaceNames = React.useMemo(
    () => allNamespaces.map((ns) => ns.metadata?.name || ''),
    [allNamespaces],
  );
  return [namespaceNames, loaded, error];
};
