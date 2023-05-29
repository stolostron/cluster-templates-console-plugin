import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import WithQuickStarts from '../../helpers/GettingStarted/WithQuickStarts';
import { useK8sWatchResource } from '../../hooks/k8s';
import { QuickStart } from '@patternfly/quickstarts';
import { useAlerts } from '../../alerts/AlertsContext';
import { QuickStartKey, quickStartsData } from './quickStartConstants';
import { quickStartGVK } from '../../constants';

//t('Failed to load quick starts')
const quickStartLoadErrMessage = 'Failed to load quick starts';

const WithClusterTemplateQuickStarts = ({ children }: { children: React.ReactNode }) => {
  const { addAlert } = useAlerts();
  const [quickStarts, quickStartsLoaded, quickStartsError] = useK8sWatchResource<QuickStart[]>({
    groupVersionKind: quickStartGVK,
    isList: true,
  });
  React.useEffect(() => {
    if (!quickStartsLoaded || quickStartsError) {
      return;
    }

    const missingQuickStarts = (Object.keys(quickStartsData) as QuickStartKey[]).reduce<string[]>(
      (prev, quickStartKey) => {
        if (
          !quickStarts.find(
            (quickStart) => quickStart.metadata?.name === quickStartsData[quickStartKey].name,
          )
        ) {
          return [...prev, `'${quickStartsData[quickStartKey].title}'`];
        }
        return prev;
      },
      [],
    );

    if (missingQuickStarts.length > 0) {
      addAlert({
        title: quickStartLoadErrMessage,
        message: `Quick starts: ${missingQuickStarts.join(', ')} do not exist`,
      });
    }
  }, [quickStarts, quickStartsLoaded, quickStartsError, addAlert]);
  //t('Failed to load quick starts')
  useAddAlertOnError(quickStartsError, quickStartLoadErrMessage);
  return (
    <WithQuickStarts quickStarts={quickStarts} quickStartsLoading={!quickStartsLoaded}>
      {children}
    </WithQuickStarts>
  );
};

export default WithClusterTemplateQuickStarts;
