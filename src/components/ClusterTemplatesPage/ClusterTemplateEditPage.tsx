import * as React from 'react';
import ErrorBoundary from '../../helpers/ErrorBoundary';
import PageLoader from '../../helpers/PageLoader';
import { DeserializedClusterTemplate, ClusterTemplate } from '../../types/resourceTypes';
import { k8sGet, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK } from '../../constants';
import ClusterTemplateWizardPage from './ClusterTemplateWizardPage';
import useClusterTemplateDeserializer from '../../hooks/useClusterTemplateDeserializer';

const ClusterTemplateEditPage = ({ match }: { match: { params: { name: string } } }) => {
  const { name } = match.params;
  const [model, modelLoading] = useK8sModel(clusterTemplateGVK);
  const [clusterTemplate, setClusterTemplate] = React.useState<DeserializedClusterTemplate>();
  const [clusterTemplateLoading, setLoading] = React.useState(true);
  const [deserialize, deserializeLoaded, deseralizeLoadError] = useClusterTemplateDeserializer();
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    const fetchClusterTemplate = async () => {
      try {
        setLoading(true);
        const _clusterTemplate = await k8sGet<ClusterTemplate>({ model, name: name });
        const deserialized = deserialize(_clusterTemplate);
        setClusterTemplate(deserialized);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (name && !clusterTemplate && deserializeLoaded && !deseralizeLoadError) {
      void fetchClusterTemplate();
    }
  }, [
    name,
    clusterTemplate,
    model,
    clusterTemplateLoading,
    deserializeLoaded,
    deseralizeLoadError,
    deserialize,
  ]);
  return (
    <ErrorBoundary>
      <PageLoader
        loaded={!modelLoading && !clusterTemplateLoading && deserializeLoaded && !!clusterTemplate}
        error={error || deseralizeLoadError}
      >
        <ClusterTemplateWizardPage clusterTemplate={clusterTemplate} />
      </PageLoader>
    </ErrorBoundary>
  );
};

export default ClusterTemplateEditPage;
