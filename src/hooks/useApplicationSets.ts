import { k8sCreate, k8sPatch, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import { applicationSetGVK } from '../constants';
import { ApplicationSet, ArgoCDSpec } from '../types/resourceTypes';
import { getApiVersion } from '../utils/k8s';
import { useK8sWatchResource } from './k8s';
import useArgocdNamespace from './useArgocdNamespace';

export const useApplicationSets = (): [ApplicationSet[], boolean, unknown] => {
  const [argoNamespace, namespaceLoaded, namespaceError] = useArgocdNamespace();
  const [appSets, loaded, error] = useK8sWatchResource<ApplicationSet[]>(
    argoNamespace
      ? {
          groupVersionKind: applicationSetGVK,
          isList: true,
          namespace: argoNamespace,
          namespaced: true,
        }
      : null,
  );
  return [appSets, loaded && namespaceLoaded, namespaceError || error];
};

const useCreateOrUpdateApplicationSet = (): [
  (spec: ArgoCDSpec, appSetName: string, templateName: string) => Promise<ApplicationSet>,
  boolean,
  unknown,
] => {
  const [argoNamespace, namespaceLoaded, namespaceError] = useArgocdNamespace();
  const [appSets, loaded, error] = useApplicationSets();
  const [model, loading] = useK8sModel(applicationSetGVK);

  const createApplicationSet = React.useCallback(
    async (name: string, spec: ArgoCDSpec): Promise<ApplicationSet> => {
      const appSet: ApplicationSet = {
        apiVersion: getApiVersion(applicationSetGVK),
        kind: applicationSetGVK.kind,
        metadata: {
          generateName: name,
          namespace: argoNamespace,
        },
        spec: {
          generators: [{}],
          template: {
            metadata: {
              name: name,
            },
            spec,
          },
        },
      };
      return await k8sCreate({ model, data: appSet });
    },
    [argoNamespace, model],
  );

  const updateApplicationSetSpec = React.useCallback(
    async (spec: ArgoCDSpec, appSet: ApplicationSet) => {
      return await k8sPatch<ApplicationSet>({
        model,
        resource: appSet,
        data: [
          {
            op: 'replace',
            path: '/spec/template/spec',
            value: spec,
          },
        ],
      });
    },
    [model],
  );

  const createOrUpdateApplicationSet = React.useCallback(
    async (spec: ArgoCDSpec, appSetName: string, templateName: string): Promise<ApplicationSet> => {
      if (appSetName) {
        const appSet = appSets.find((appSet) => appSet.metadata?.name === appSetName);
        if (appSet) {
          return await updateApplicationSetSpec(spec, appSet);
        }
      }
      return await createApplicationSet(templateName, spec);
    },
    [appSets, createApplicationSet, updateApplicationSetSpec],
  );

  return [
    createOrUpdateApplicationSet,
    namespaceLoaded && !loading && loaded,
    error || namespaceError,
  ];
};

export default useCreateOrUpdateApplicationSet;
