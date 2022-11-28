import React from 'react';

import DefaultLoader from '../../../../helpers/DefaultLoader';
import { useAllQuotas } from '../../../../hooks/useQuotas';

import { useTranslation } from '../../../../hooks/useTranslation';
import { ClusterTemplateQuota } from '../../../../types';

export type AccessContextData = ClusterTemplateQuota[];
const AccesssContext = React.createContext<AccessContextData | null>(null);

export const AccessContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [allQuotas, loaded, loadError] = useAllQuotas();

  return (
    <DefaultLoader loaded={loaded} error={loadError}>
      <AccesssContext.Provider value={allQuotas}>{children}</AccesssContext.Provider>
    </DefaultLoader>
  );
};

export const useAccessContext = (): AccessContextData => {
  const context = React.useContext(AccesssContext);

  const { t } = useTranslation();
  if (!context) {
    throw new Error(t('useAccesss must be used within AccesssContextProvider.'));
  }
  return context;
};
