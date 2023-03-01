import React from 'react';
import { RouteComponentProps } from 'react-router';
import PageLoader from '../../../helpers/PageLoader';
import { useQuota } from '../../../hooks/useQuotas';
import QuotaFormPage from './QuotaFormPage';

const EditQuotaPage = ({
  match,
}: RouteComponentProps<{
  name: string;
  ns: string;
}>) => {
  const { name, ns } = match.params;
  const [quota, loaded, error] = useQuota(name, ns);
  return (
    <PageLoader loaded={loaded} error={error}>
      <QuotaFormPage quota={quota} />
    </PageLoader>
  );
};

export default EditQuotaPage;
