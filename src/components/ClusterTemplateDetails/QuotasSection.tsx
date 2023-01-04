import { Alert, EmptyState, EmptyStateBody, Stack, StackItem, Title } from '@patternfly/react-core';
import React from 'react';
import ClusterTemplateQuotasTable from '../ClusterTemplateQuotas/ClusterTemplateQuotasTable';
import { ClusterTemplate, QuotaDetails } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useQuotas } from '../../hooks/useQuotas';
import TableLoader from '../../helpers/TableLoader';

const QuotasEmptyState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <EmptyState>
      <Title size="lg" headingLevel="h4">
        {t('No quota set yet')}
      </Title>
      <EmptyStateBody>
        {t(
          'Configure the template quota permissions to see here who uses this template and what cost has spent.',
        )}
      </EmptyStateBody>
    </EmptyState>
  );
};

const QuotasSection: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const [quotasData, loaded, error] = useQuotas();
  const quotasDetails = React.useMemo<QuotaDetails[]>(
    () => quotasData.getClusterTemplateQuotasDetails(clusterTemplate.metadata?.name),
    [quotasData, clusterTemplate],
  );
  return (
    <Stack hasGutter>
      <StackItem>
        <Alert
          variant="info"
          title={t(
            'This template may be accessible to more users than those listed below. Global permissions are granted to Kube-admin. Check out each namespace to know who can access this template. ',
          )}
          isInline
        />
      </StackItem>
      <StackItem>
        <TableLoader loaded={loaded} error={error}>
          {quotasDetails.length === 0 ? (
            <QuotasEmptyState />
          ) : (
            <ClusterTemplateQuotasTable quotaDetails={quotasDetails} />
          )}
        </TableLoader>
      </StackItem>
    </Stack>
  );
};

export default QuotasSection;
