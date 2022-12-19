import { Alert } from '@patternfly/react-core';
import React from 'react';
import { useAlerts } from './AlertsContext';

const Alerts = () => {
  const { alerts } = useAlerts();
  return (
    <>
      {alerts.map((alert, idx) => (
        <Alert variant="danger" isInline title={alert.title} key={idx}>
          {alert.message}
        </Alert>
      ))}
    </>
  );
};

export default Alerts;
