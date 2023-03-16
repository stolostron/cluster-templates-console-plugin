import React from 'react';
import { clusterTemplateGVK } from '../constants';
import { ClusterTemplate } from '../types/resourceTypes';
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

export const useClusterTemplatesFromRepo = (
  repoUrl?: string,
): [ClusterTemplate[], boolean, unknown] => {
  const [templates, loaded, error] = useClusterTemplates();
  const repoTemplates = React.useMemo(
    () =>
      repoUrl
        ? templates.filter(
            (template) =>
              template.spec.clusterDefinition.source.repoURL === repoUrl ||
              template.spec.clusterSetup?.find((spec) => spec.spec.source.repoURL === repoUrl),
          )
        : [],
    [repoUrl, templates],
  );
  return [repoTemplates, loaded, error];
};
