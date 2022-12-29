import React from 'react';
import { useAlerts } from './AlertsContext';
import { getErrorMessage } from '../utils/utils';

export const useAddAlertOnError = (error: unknown, errorTitle: string) => {
  const { addAlert } = useAlerts();
  React.useEffect(() => {
    if (error) {
      console.error(error);
      addAlert({ title: errorTitle, message: getErrorMessage(error) });
    }
  }, [error, errorTitle]);
};
