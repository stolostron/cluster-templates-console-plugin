import * as React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export type AlertData = {
  title: string;
  message?: string;
};

export type AlertsContextData = {
  alerts: AlertData[];
  addAlert: (AlertData) => void;
};

const AlertsContext = React.createContext<AlertsContextData>(null);

export const AlertsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = React.useState<AlertData[]>([]);

  const addAlert = React.useCallback(
    (alert: AlertData) => {
      setAlerts([...alerts, alert]);
    },
    [alerts],
  );

  return <AlertsContext.Provider value={{ alerts, addAlert }}>{children}</AlertsContext.Provider>;
};

export const useAlerts = (): AlertsContextData => {
  const alertsContext = React.useContext(AlertsContext);
  const { t } = useTranslation();
  if (!alertsContext) {
    throw t('useAlerts can only be used within AlertsContext.Provider');
  }
  return alertsContext;
};
