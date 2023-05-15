import React from 'react';
import {
  QuickStartContextProvider,
  QuickStartDrawer,
  QuickStart,
  AllQuickStartStates,
  QuickStartContextValues,
} from '@patternfly/quickstarts';

export const WithQuickStarts = ({
  quickStarts,
  quickStartsLoading,
  children,
}: {
  quickStarts: QuickStart[];
  quickStartsLoading: boolean;
  children: React.ReactNode;
}) => {
  const [activeQuickStartID, setActiveQuickStartID] = React.useState<string>('');
  const [allQuickStartStates, setAllQuickStartStates] = React.useState<AllQuickStartStates>({});
  const language = 'en';

  const valuesForQuickstartContext: QuickStartContextValues = {
    allQuickStarts: quickStarts,
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates,
    language,
    loading: quickStartsLoading,
    useQueryParams: false,
  };

  return (
    <QuickStartContextProvider value={valuesForQuickstartContext}>
      <QuickStartDrawer>{children}</QuickStartDrawer>
    </QuickStartContextProvider>
  );
};

export default WithQuickStarts;
