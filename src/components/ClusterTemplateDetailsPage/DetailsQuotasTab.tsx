import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import { Card, Button } from '@patternfly/react-core';

import TableLoader from '../../helpers/TableLoader';
import { useTranslation } from '../../hooks/useTranslation';
import QuotasTable from '../Quotas/QuotasTable';
import { useClusterTemplateQuotas } from '../../hooks/useQuotas';
import EmptyPageState from '../../helpers/EmptyPageState';
import { useNavigation } from '../../hooks/useNavigation';

const QuotasEmptyState: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Card>
      <EmptyPageState
        title={t('No quotas set for this template')}
        message={t('You can limit the use of this template using quotas')}
        action={
          <Button variant="link" onClick={() => navigation.goToClusterTemplatesPage('quotas')}>
            {t('Manage quotas')}
          </Button>
        }
      />
    </Card>
  );
};

const DetailsQuotasTab = ({ clusterTemplate }: { clusterTemplate: ClusterTemplate }) => {
  const [quotas, loaded, error] = useClusterTemplateQuotas(clusterTemplate.metadata?.name || '');

  return (
    <TableLoader loaded={loaded} error={error}>
      {quotas.length === 0 ? <QuotasEmptyState /> : <QuotasTable quotas={quotas} />}
    </TableLoader>
  );
};

export default DetailsQuotasTab;
