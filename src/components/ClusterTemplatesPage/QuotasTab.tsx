import { Page, PageSection, Card, Button } from '@patternfly/react-core';
import React from 'react';
import EmptyPageState from '../../helpers/EmptyPageState';
import TableLoader from '../../helpers/TableLoader';
import { useNavigation } from '../../hooks/useNavigation';
import { useAllQuotas } from '../../hooks/useQuotas';
import { useTranslation } from '../../hooks/useTranslation';
import QuotasTable from '../Quotas/QuotasTable';

const QuotasTab = () => {
  const { t } = useTranslation();
  const navigaton = useNavigation();
  const [quotas, loaded, error] = useAllQuotas();

  return (
    <Page>
      <PageSection>
        <TableLoader
          loaded={loaded}
          error={error}
          errorId="templates-load-error"
          errorMessage={t('The cluster templates could not be loaded.')}
        >
          {quotas.length > 0 ? (
            <QuotasTable quotas={quotas} />
          ) : (
            <Card>
              <EmptyPageState
                title={t('You have no quota')}
                message={t('Click Create a quota to add the first one')}
                action={
                  <Button variant="primary" onClick={navigaton.goToQuotaCreatePage}>
                    {t('Create a quota')}
                  </Button>
                }
              />
            </Card>
          )}
        </TableLoader>
      </PageSection>
    </Page>
  );
};

export default QuotasTab;
