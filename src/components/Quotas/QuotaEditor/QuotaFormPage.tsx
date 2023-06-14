import { Page, Title, PageSection, PageSectionVariants, Divider } from '@patternfly/react-core';
import * as React from 'react';

import QuotaForm from './QuotaForm';
import { Quota } from '../../../types/resourceTypes';
import ErrorBoundary from '../../../helpers/ErrorBoundary';
import WithBreadcrumb from '../../../helpers/WithBreadcrumb';
import { getClusterTemplatesPageUrl } from '../../../hooks/useNavigation';
import { useTranslation } from '../../../hooks/useTranslation';
import { AlertsContextProvider } from '../../../alerts/AlertsContext';
import Alerts from '../../../alerts/Alerts';
import WithClusterTemplateQuickStarts from '../../ClusterTemplatesGettingStarted/WithClusterTemplateQuickStarts';

const PageHeader = ({ quota }: { quota?: Quota }) => {
  const { t } = useTranslation();
  const createTitle = t('Create a new quota');
  const title = quota ? t('Edit ClusterTemplate') : createTitle;
  const activeItemText = quota ? quota?.metadata?.name || '' : createTitle;
  return (
    <>
      <WithBreadcrumb
        breadcrumb={[
          { to: getClusterTemplatesPageUrl('quotas'), text: t('Cluster Templates') },
          { text: activeItemText },
        ]}
      >
        <Title headingLevel="h1">{title}</Title>
      </WithBreadcrumb>
      <PageSection variant="light" style={{ paddingTop: 'var(--pf-global--spacer--sm)' }}>
        {t('A quota provides constraints that limit aggregate cluster consumption per namespace.')}
      </PageSection>
    </>
  );
};

const QuotaFormPage = ({ quota }: { quota?: Quota }) => {
  return (
    <ErrorBoundary>
      <AlertsContextProvider>
        <WithClusterTemplateQuickStarts>
          <Page>
            <PageHeader quota={quota} />
            <Divider />
            <Alerts />
            <PageSection variant={PageSectionVariants.light}>
              <QuotaForm quota={quota} />
            </PageSection>
          </Page>
        </WithClusterTemplateQuickStarts>
      </AlertsContextProvider>
    </ErrorBoundary>
  );
};

export default QuotaFormPage;
