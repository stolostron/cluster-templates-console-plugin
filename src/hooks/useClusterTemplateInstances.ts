import { clusterTemplateInstanceGVK } from '../constants';
import { ClusterTemplateInstance } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';

export const useAllClusterTemplateInstances = () =>
  useK8sWatchResource<ClusterTemplateInstance[]>({
    groupVersionKind: clusterTemplateInstanceGVK,
    isList: true,
  });

export const useClusterTemplateInstances = (
  clusterTemplateName?: string,
): [ClusterTemplateInstance[], boolean, unknown] => {
  const [allInstances, loaded, error] = useAllClusterTemplateInstances();
  if (!loaded || error) {
    return [[], loaded, error];
  }
  const instances = allInstances.filter(
    (instance) => instance.spec?.clusterTemplateRef === clusterTemplateName,
  );
  return [instances, true, null];
};

export const useClusterTemplateInstancesCount = (clusterTemplateName: string | undefined) => {
  const [templates, loaded, error] = useClusterTemplateInstances(clusterTemplateName);
  return loaded && !error ? templates.length : undefined;
};
