import { Alert } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAlerts } from './AlertsContext';

const Alerts = () => {
  const { alerts } = useAlerts();
  const { t } = useTranslation();
  return (
    <>
      {alerts.map((alert, idx) => (
        <Alert variant="danger" isInline title={t(alert.title)} key={idx}>
          {alert.message}
        </Alert>
      ))}
    </>
  );
};

export default Alerts;
