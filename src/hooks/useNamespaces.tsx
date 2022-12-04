import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { namespaceGVK } from '../constants';

export const useNamespaces = (): [string[], boolean, unknown] => {
  const [allNamespaces, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: namespaceGVK,
    isList: true,
  });
  const namespaceNames = React.useMemo(
    () => allNamespaces.map((ns) => ns.metadata?.name || ''),
    [allNamespaces],
  );
  return [namespaceNames, loaded, loadError];
};
