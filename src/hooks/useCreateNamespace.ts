//handles creating a template if it doesn't exist.
//first checks in fetched namespaces, if not there doesn't create it
//if fails because template exists - doesn't throw an error
//doesn't handle error and loading of all namespaces - if it's not in list it tries to create it anyhow

import { k8sCreate, K8sResourceCommon, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { namespaceGVK } from '../constants';
import { isApiError } from '../types/errorTypes';
import { useNamespaces } from './useNamespaces';

const getNamespace = (name: string): K8sResourceCommon => {
  return {
    apiVersion: namespaceGVK.version,
    kind: namespaceGVK.kind,
    metadata: {
      name,
    },
  };
};

export const useCreateNamespace = (): [(name: string) => Promise<void>, boolean] => {
  //no need to handle loading and error, if fetching namespacing failed, it'll try to create it anyhow
  const [namespaces] = useNamespaces();
  const [nsModel, loading] = useK8sModel(namespaceGVK);
  const createNamespace = async (name: string) => {
    if (namespaces.includes(name)) {
      return;
    }
    try {
      await k8sCreate({ model: nsModel, data: getNamespace(name) });
    } catch (err) {
      if (isApiError(err)) {
        if (err.json.reason === 'AlreadyExists') return;
      }
      throw err;
    }
  };
  return [createNamespace, !loading];
};
