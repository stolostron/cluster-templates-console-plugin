import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { namespaceGVK } from '../../../../constants';

import DefaultLoader from '../../../../helpers/DefaultLoader';
import { useAllQuotas } from '../../../../hooks/useQuotas';

import { useTranslation } from '../../../../hooks/useTranslation';

export type NamespaceContextData = string[];

const NamespacesContext = React.createContext<NamespaceContextData | null>(null);

export const useAllNamespaces = () => {
  return useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: namespaceGVK,
    isList: true,
  });
};

export const NamespacesContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [allNamespaces, loaded, loadError] = useAllQuotas();

  const data = allNamespaces.map((namespace) => namespace.metadata?.name);

  return (
    <DefaultLoader loaded={loaded} error={loadError}>
      <NamespacesContext.Provider value={data}>{children}</NamespacesContext.Provider>
    </DefaultLoader>
  );
};

export const useNamespaceContext = (): NamespaceContextData => {
  const context = React.useContext(NamespacesContext);

  const { t } = useTranslation();
  if (!context) {
    throw new Error(t('useNamespaces must be used within NamespacesContextProvider.'));
  }
  return context;
};
