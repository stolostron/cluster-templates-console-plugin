import { Button, Card, Toolbar, ToolbarContent } from '@patternfly/react-core';
import React from 'react';
import EmptyPageState from '../../helpers/EmptyPageState';
import TableLoader from '../../helpers/TableLoader';
import { useNavigation } from '../../hooks/useNavigation';
import { useAllQuotas } from '../../hooks/useQuotas';
import { useTranslation } from '../../hooks/useTranslation';
import QuotasTable from '../Quotas/QuotasTable';

const CreateQuotaButton = () => {
  const navigaton = useNavigation();
  const { t } = useTranslation();
  return (
    <Button variant="primary" onClick={() => navigaton.goToQuotaCreatePage()}>
      {t('Create a quota')}
    </Button>
  );
};

const QuotasToolbar = () => {
  return (
    <Toolbar>
      <ToolbarContent>
        <CreateQuotaButton />
      </ToolbarContent>
    </Toolbar>
  );
};

const QuotasTab = () => {
  const { t } = useTranslation();
  const [quotas, loaded, error] = useAllQuotas();

  return (
    <TableLoader loaded={loaded} error={error} errorTitle={t('The Quotas could not be loaded.')}>
      {quotas.length > 0 ? (
        <>
          <QuotasToolbar />
          <QuotasTable quotas={quotas} />
        </>
      ) : (
        <Card>
          <EmptyPageState
            title={t('You have no quota')}
            message={t('Click Create a quota to add the first one')}
            action={<CreateQuotaButton />}
          />
        </Card>
      )}
    </TableLoader>
  );
};

export default QuotasTab;
