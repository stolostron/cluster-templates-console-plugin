import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import { quickStartGVK } from '../../constants';
import WithQuickStarts from '../../helpers/GettingStarted/WithQuickStarts';
import { useK8sWatchResource } from '../../hooks/k8s';
import { QuickStart } from '@patternfly/quickstarts';
import { Operator } from '@openshift-console/dynamic-plugin-sdk';

const WithClusterTemplateQuickStarts = ({ children }: { children: React.ReactNode }) => {
  const [quickStarts, quickStartsLoading, quickStartsError] = useK8sWatchResource<QuickStart[]>({
    groupVersionKind: quickStartGVK,
    selector: {
      matchExpressions: [
        {
          key: 'cluster-templates-quick-start',
          operator: Operator.Exists,
        },
      ],
    },
  });
  //t('Failed to load quick starts')
  useAddAlertOnError(quickStartsError, 'Failed to load quick starts');
  return (
    <WithQuickStarts quickStarts={quickStarts} quickStartsLoading={quickStartsLoading}>
      {children}
    </WithQuickStarts>
  );
};

export default WithClusterTemplateQuickStarts;
