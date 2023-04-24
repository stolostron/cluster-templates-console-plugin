import { useK8sModel, k8sCreate } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateInstanceGVK } from '../constants';
import {
  ClusterTemplate,
  ClusterTemplateInstance,
  ClusterTemplateInstanceParameter,
} from '../types/resourceTypes';
import { getApiVersion } from '../utils/k8s';
import React from 'react';
import { InstanceFormValues, InstanceParameter } from '../types/instanceFormTypes';
import { useCreateNamespace } from './useCreateNamespace';

const toInstanceParameters = (
  formParameters: InstanceParameter[],
  clusterSetup?: string,
): ClusterTemplateInstanceParameter[] =>
  formParameters
    .filter((param) => param.default !== param.value)
    .map((param) => ({ name: param.name, value: param.value?.toString(), clusterSetup }));

const getInstanceParameters = (
  instanceFormValues: InstanceFormValues,
): ClusterTemplateInstanceParameter[] => {
  return instanceFormValues.postInstallation.reduce<ClusterTemplateInstanceParameter[]>(
    (prevVal, postInstallationItem): ClusterTemplateInstanceParameter[] => [
      ...prevVal,
      ...toInstanceParameters(postInstallationItem.parameters, postInstallationItem.name),
    ],
    toInstanceParameters(instanceFormValues.installation.parameters),
  );
};

const toInstance = (
  instanceFormValues: InstanceFormValues,
  template: ClusterTemplate,
): ClusterTemplateInstance => ({
  apiVersion: getApiVersion(clusterTemplateInstanceGVK),
  kind: clusterTemplateInstanceGVK.kind,
  metadata: {
    name: instanceFormValues.name,
    namespace: instanceFormValues.namespace,
  },
  spec: {
    clusterTemplateRef: template.metadata?.name || '',
    parameters: getInstanceParameters(instanceFormValues),
  },
});

const useCreateInstance = (
  template: ClusterTemplate,
): [(values: InstanceFormValues) => Promise<ClusterTemplateInstance>, boolean] => {
  const [instancesModel, loadingModel] = useK8sModel(clusterTemplateInstanceGVK);
  const [createNamespace, createNamespaceLoaded] = useCreateNamespace();
  const create = React.useCallback(
    async (values: InstanceFormValues) => {
      await createNamespace(values.namespace);
      return await k8sCreate({
        model: instancesModel,
        data: toInstance(values, template),
      });
    },
    [instancesModel, template, createNamespace],
  );
  return [create, !loadingModel && createNamespaceLoaded];
};

export default useCreateInstance;
