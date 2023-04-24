import React from 'react';
import { clusterTemplateGVK } from '../constants';
import { DeserializedClusterTemplate, ClusterTemplate } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';
import useClusterTemplateDeserializer from './useClusterTemplateDeserializer';

export const useClusterTemplate = (name: string) =>
  useK8sWatchResource<ClusterTemplate>({
    groupVersionKind: clusterTemplateGVK,
    name: name,
  });

export const useClusterTemplates = (): [ClusterTemplate[], boolean, unknown] =>
  useK8sWatchResource<ClusterTemplate[]>({
    groupVersionKind: clusterTemplateGVK,
    isList: true,
  });

export const useDeserializedClusterTemplates = (): [
  DeserializedClusterTemplate[],
  boolean,
  unknown,
] => {
  const [deserialize, deserializeLoaded, deserializeError] = useClusterTemplateDeserializer();
  const [rawTemplates, templatesLoaded, templatesError] = useK8sWatchResource<ClusterTemplate[]>({
    groupVersionKind: clusterTemplateGVK,
    isList: true,
  });
  const loaded = templatesLoaded && deserializeLoaded;
  const error = templatesError || deserializeError;
  const deserializedTemplates = React.useMemo<DeserializedClusterTemplate[]>(() => {
    if (!loaded || error) {
      return [];
    }
    return rawTemplates.map((rawTemplate) => deserialize(rawTemplate));
  }, [deserialize, error, loaded, rawTemplates]);
  return [deserializedTemplates, loaded, error];
};

export const useClusterTemplatesCount = () => {
  const [templates, loaded, error] = useClusterTemplates();
  return loaded && !error ? templates.length : undefined;
};

export const useDeserializedClusterTemplate = (
  name: string,
): [DeserializedClusterTemplate, boolean, unknown] => {
  const [rawTemplate, templateLoaded, templateError] = useK8sWatchResource<ClusterTemplate>({
    groupVersionKind: clusterTemplateGVK,
    name: name,
  });
  const [deserialize, deserializeLoaded, deserializeError] = useClusterTemplateDeserializer();
  const loaded = templateLoaded && deserializeLoaded;
  const error = templateError || deserializeError;
  const deserializedTemplate = React.useMemo<DeserializedClusterTemplate>(() => {
    if (!loaded || error) {
      return {} as DeserializedClusterTemplate;
    }
    return deserialize(rawTemplate);
  }, [deserialize, error, loaded, rawTemplate]);

  return [deserializedTemplate, loaded, error];
};

export const useClusterTemplatesFromRepo = (
  repoUrl?: string,
): [DeserializedClusterTemplate[], boolean, unknown] => {
  const [templates, loaded, error] = useDeserializedClusterTemplates();
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
