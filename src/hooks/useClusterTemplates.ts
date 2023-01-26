import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateGVK } from '../constants';
import { ClusterTemplate, CorrectWatchK8sResult } from '../types';

export const useClusterTemplates = () =>
  useK8sWatchResource<ClusterTemplate[]>({
    groupVersionKind: clusterTemplateGVK,
    isList: true,
  }) as CorrectWatchK8sResult<ClusterTemplate[]>;

export const useClusterTemplatesCount = () => {
  const [templates, loaded, error] = useClusterTemplates();
  return loaded && !error ? templates.length : undefined;
};

export const useClusterTemplate = (name: string): [ClusterTemplate, boolean, unknown] =>
  useK8sWatchResource<ClusterTemplate>({
    groupVersionKind: clusterTemplateGVK,
    name: name,
  });
