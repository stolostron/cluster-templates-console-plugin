import {
  Page,
  Title,
  Text,
  PageSection,
  PageSectionVariants,
  Divider,
} from '@patternfly/react-core';
import * as React from 'react';

import QuotaForm from './QuotaForm';
import { Quota } from '../../../types/resourceTypes';
import ErrorBoundary from '../../../helpers/ErrorBoundary';
import WithBreadcrumb from '../../../helpers/WithBreadcrumb';
import { useNavigation } from '../../../hooks/useNavigation';
import { useTranslation } from '../../../hooks/useTranslation';

const PageHeader = ({ quota }: { quota?: Quota }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const createTitle = t('Create a new quota');
  const title = quota ? t('Edit ClusterTemplate') : createTitle;
  const activeItemText = quota ? quota?.metadata?.name || '' : createTitle;
  return (
    <WithBreadcrumb
      activeItemText={activeItemText}
      onBack={() => navigation.goToClusterTemplatesPage('quotas')}
      prevItemText={t('Cluster templates')}
    >
      <Title headingLevel="h1">{title}</Title>
      <Text>
        {t('A quota provides constraints that limit aggregate cluster consumption per namespace.')}
      </Text>
    </WithBreadcrumb>
  );
};

const QuotaFormPage = ({ quota }: { quota?: Quota }) => {
  return (
    <ErrorBoundary>
      <Page>
        <PageHeader quota={quota} />
        <Divider />
        <PageSection variant={PageSectionVariants.light}>
          <QuotaForm quota={quota} />
        </PageSection>
      </Page>
    </ErrorBoundary>
  );
};

export default QuotaFormPage;
