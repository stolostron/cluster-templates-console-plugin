import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { namespaceGVK } from '../constants';
import { CorrectWatchK8sResult } from '../types';

export const useNamespaces = (): [string[], boolean, unknown] => {
  const [allNamespaces, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: namespaceGVK,
    isList: true,
  }) as CorrectWatchK8sResult<K8sResourceCommon[]>;
  const namespaceNames = React.useMemo(
    () => allNamespaces.map((ns) => ns.metadata?.name || ''),
    [allNamespaces],
  );
  return [namespaceNames, loaded, error];
};
