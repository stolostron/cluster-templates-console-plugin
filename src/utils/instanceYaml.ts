import { dump, load } from 'js-yaml';
import {
  ClusterTemplateInstancePropertyValue,
  ClusterTemplate,
  ClusterTemplateInstance,
  ClusterTemplateStatus,
} from '../types';
import { clusterTemplateInstanceGVK } from '../constants';

const getProperties = (
  valuesStr: string,
  clusterSetupName?: string,
): ClusterTemplateInstancePropertyValue[] => {
  try {
    const valuesObject: Record<string, string> = load(valuesStr);
    if (!valuesObject) {
      return [];
    }
    return Object.entries(valuesObject).map(([key, value]) => ({
      clusterSetup: clusterSetupName,
      name: key,
      value,
    }));
  } catch (err) {
    // t("Failed to parse values of chart {{chart}}")
    throw new Error(`Failed to parse values of chart ${clusterSetupName}`);
  }
};

const getAllProperties = (
  status: ClusterTemplateStatus,
): ClusterTemplateInstancePropertyValue[] => {
  const clusterDefinitionProperties = getProperties(status.clusterDefinition.values);
  if (!status.clusterSetup) {
    return clusterDefinitionProperties;
  }
  return status.clusterSetup.reduce(
    (properties, { values, name }) => [...properties, ...getProperties(values, name)],
    clusterDefinitionProperties,
  );
};

const getInstanceObject = (clusterTemplate: ClusterTemplate): ClusterTemplateInstance => {
  if (!clusterTemplate.status) {
    // t("Cluster template doesn't contain a status")
    throw new Error("Cluster template doesn't contain a status");
  }
  const values = getAllProperties(clusterTemplate.status);
  return {
    apiVersion: `${clusterTemplateInstanceGVK.group}/${clusterTemplateInstanceGVK.version}`,
    kind: clusterTemplateInstanceGVK.kind,
    metadata: {
      namespace: null,
      name: null,
    },
    spec: {
      clusterTemplateRef: clusterTemplate.metadata?.name || null,
      values: values.length ? values : undefined,
    },
  };
};

const generateInstanceYaml = (clusterTemplate: ClusterTemplate): string => {
  const object = getInstanceObject(clusterTemplate);
  const yaml = dump(object);
  return yaml;
};

export default generateInstanceYaml;
