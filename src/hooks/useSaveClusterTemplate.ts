import {
  k8sCreate,
  k8sUpdate,
  ObjectMetadata,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { WizardFormikValues } from '../types/wizardFormTypes';
import { clusterTemplateGVK } from '../constants';

import { toInstallationArgoSpec, toPostInstallationArgoSpec } from '../utils/toArgoSpec';
import { DeserializedClusterTemplate, ClusterTemplate } from '../types/resourceTypes';
import isEqual from 'lodash/isEqual';
import React from 'react';
import { TEMPLATE_LABELS } from '../utils/clusterTemplateDataUtils';
import { getApiVersion } from '../utils/k8s';
import useCreateOrUpdateApplicationSet from './useApplicationSets';
import find from 'lodash/find';

export const getAnnotations = (
  values: WizardFormikValues,
  originalClusterTemplate?: ClusterTemplate,
): ObjectMetadata['annotations'] | undefined => {
  if (values.details.description) {
    return {
      ...originalClusterTemplate?.metadata?.annotations,
      [TEMPLATE_LABELS.description]: values.details.description,
    };
  }
  return originalClusterTemplate?.metadata?.annotations;
};

const toClusterTemplate = (
  values: WizardFormikValues,
  clusterDefinitionAppSetName: string,
  clusterSetupAppSetNames: string[],
  originalClusterTemplate?: DeserializedClusterTemplate,
): ClusterTemplate => {
  return {
    ...originalClusterTemplate,
    apiVersion: getApiVersion(clusterTemplateGVK),
    kind: clusterTemplateGVK.kind,
    metadata: {
      ...originalClusterTemplate?.metadata,
      name: values.details.name,
      annotations: getAnnotations(values),
      labels: values.details.labels,
    },
    spec: {
      cost: originalClusterTemplate?.spec?.cost,
      clusterDefinition: clusterDefinitionAppSetName,
      clusterSetup: clusterSetupAppSetNames,
    },
  };
};

export const useSaveClusterTemplate = (
  initialValues?: WizardFormikValues,
  clusterTemplate?: DeserializedClusterTemplate,
): [(values: WizardFormikValues) => Promise<void>, boolean, unknown] => {
  const [clusterTemplateModel, clusterTemplateModelLoading] = useK8sModel(clusterTemplateGVK);
  const [createOrUpdateApplicationSet, applicationSetApiLoaded, applicationSetApiError] =
    useCreateOrUpdateApplicationSet();

  const saveClusterTemplate = React.useCallback(
    async (values: WizardFormikValues) => {
      const saveInstallationAppSet = async (): Promise<string> => {
        let clusterDefinitionName = clusterTemplate?.spec.clusterDefinitionName || '';
        if (!isEqual(initialValues?.installation, values.installation)) {
          const clusterDefinitionAppSet = await createOrUpdateApplicationSet(
            toInstallationArgoSpec(values.installation),
            clusterTemplate?.spec.clusterDefinitionName || '',
            values.details.name,
          );
          clusterDefinitionName = clusterDefinitionAppSet.metadata?.name || '';
        }
        return clusterDefinitionName;
      };

      const savePostInstallationAppSets = async (): Promise<string[]> => {
        return await Promise.all(
          values.postInstallation.map(async (curPostInstallationFormValues) => {
            if (curPostInstallationFormValues.appSetName) {
              const initialPostInstallationValues = find(
                initialValues?.postInstallation || [],
                (curValues) => curValues.appSetName === curPostInstallationFormValues.appSetName,
              );
              if (isEqual(initialPostInstallationValues, curPostInstallationFormValues)) {
                return curPostInstallationFormValues.appSetName;
              }
            }
            const appSet = await createOrUpdateApplicationSet(
              toPostInstallationArgoSpec(curPostInstallationFormValues),
              curPostInstallationFormValues.appSetName,
              values.details.name,
            );
            return appSet.metadata?.name || '';
          }),
        );
      };

      const saveClusterTemplate = async (
        clusterDefinitionName: string,
        clusterSetupAppSetNames: string[],
      ) => {
        const template = toClusterTemplate(
          values,
          clusterDefinitionName,
          clusterSetupAppSetNames,
          clusterTemplate,
        );
        return clusterTemplate
          ? await k8sUpdate({ model: clusterTemplateModel, data: template })
          : await k8sCreate({ model: clusterTemplateModel, data: template });
      };

      if (isEqual(initialValues, values)) {
        return;
      }
      const clusterDefinitionName = await saveInstallationAppSet();
      const clusterSetupAppSetNames = await savePostInstallationAppSets();
      await saveClusterTemplate(clusterDefinitionName, clusterSetupAppSetNames);
    },
    [clusterTemplate, clusterTemplateModel, createOrUpdateApplicationSet, initialValues],
  );
  return [
    saveClusterTemplate,
    !clusterTemplateModelLoading && applicationSetApiLoaded,
    applicationSetApiError,
  ];
};
