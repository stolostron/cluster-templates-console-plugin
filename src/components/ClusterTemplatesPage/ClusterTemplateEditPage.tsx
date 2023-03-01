import * as React from 'react';
import ErrorBoundary from '../../helpers/ErrorBoundary';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PageLoader from '../../helpers/PageLoader';
import { ClusterTemplate } from '../../types/resourceTypes';
import { k8sGet, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK } from '../../constants';
import ClusterTemplateWizardPage from './ClusterTemplateWizardPage';

const ClusterTemplateEditPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [model, modelLoading] = useK8sModel(clusterTemplateGVK);
  const [clusterTemplate, setClusterTemplate] = React.useState<ClusterTemplate>();
  const [clusterTemplateLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    if (name && !clusterTemplate) {
      setLoading(true);
      k8sGet<ClusterTemplate>({ model, name: name })
        .then((template) => {
          setLoading(false);
          setClusterTemplate(template);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [name, clusterTemplate, model]);
  return (
    <ErrorBoundary>
      <PageLoader
        loaded={!modelLoading && !clusterTemplateLoading && !!clusterTemplate}
        error={error}
      >
        <ClusterTemplateWizardPage clusterTemplate={clusterTemplate} />
      </PageLoader>
    </ErrorBoundary>
  );
};

export default ClusterTemplateEditPage;
