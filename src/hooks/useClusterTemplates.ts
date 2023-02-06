import { clusterTemplateGVK } from '../constants';
import { ClusterTemplate } from '../types';
import { useK8sWatchResource } from './k8s';

export const useClusterTemplates = () =>
  useK8sWatchResource<ClusterTemplate[]>({
    groupVersionKind: clusterTemplateGVK,
    isList: true,
  });

export const useClusterTemplatesCount = () => {
  const [templates, loaded, error] = useClusterTemplates();
  return loaded && !error ? templates.length : undefined;
};

export const useClusterTemplate = (name: string): [ClusterTemplate, boolean, unknown] =>
  useK8sWatchResource<ClusterTemplate>({
    groupVersionKind: clusterTemplateGVK,
    name: name,
  });
