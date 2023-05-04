import { TFunction } from 'i18next';
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import { applicationSetGVK } from '../constants';
import {
  ApplicationSet,
  ArgoCDSpec,
  ClusterSetup,
  DeserializedClusterTemplate,
  ClusterTemplate,
} from '../types/resourceTypes';
import { getArgoSpec } from '../utils/toArgoSpec';

import { getErrorMessage } from '../utils/utils';
import { useK8sWatchResource } from './k8s';
import useArgocdNamespace from './useArgocdNamespace';
import { useTranslation } from './useTranslation';

// return a cluster template with the argo specs from the applicationsets

const getMissingAppSetsErrorMessage = (
  argoNamespace: string,
  clusterDefinitionAppSetName: string,
  clusterDefinitionAppSet: ApplicationSet | undefined,
  missingClusterSetupAppSets: string[],
  t: TFunction,
): { error: string; instructions: string } | undefined => {
  const numApplicationSets = clusterDefinitionAppSet ? missingClusterSetupAppSets.length : 1;
  const instructions = t('To fix this, edit the template and reselect the repository', {
    count: numApplicationSets,
  });
  if (!clusterDefinitionAppSet) {
    return {
      error: t(`Installation ApplicationSet '{{name}}' in namespace '{{argoNs}}' does not exists`, {
        name: clusterDefinitionAppSetName,
        argoNs: argoNamespace,
      }),
      instructions,
    };
  } else if (missingClusterSetupAppSets.length > 0) {
    return {
      error: t(
        `Post-installation ApplicationSet in namespace '{{argoNs}}' does not exist: {{appSets}}`,
        {
          appSets: missingClusterSetupAppSets.join(', '),
          argoNs: argoNamespace,
          count: missingClusterSetupAppSets.length,
        },
      ),
      instructions,
    };
  } else {
    return undefined;
  }
};

const generateEmptyArgoSpec = (): ArgoCDSpec => getArgoSpec('', '', { repoURL: '' }, undefined);

const useClusterTemplateDeserializer = (): [
  (rawTemplate: ClusterTemplate) => DeserializedClusterTemplate,
  boolean,
  unknown,
] => {
  const [argoNamespace, namespaceLoaded, namespaceError] = useArgocdNamespace();
  const [allAppSets, appSetsLoaded, appSetsError] = useK8sWatchResource<ApplicationSet[]>(
    namespaceLoaded
      ? {
          groupVersionKind: applicationSetGVK,
          namespace: argoNamespace,
          isList: true,
        }
      : null,
  );
  const { t } = useTranslation();
  const deserializeTemplate = React.useCallback(
    (rawTemplate: ClusterTemplate): DeserializedClusterTemplate => {
      try {
        const clusterDefinitionAppSet = allAppSets.find(
          (appSet) => appSet.metadata?.name === rawTemplate.spec.clusterDefinition,
        );
        const clusterSetup: ClusterSetup = [];
        const missingClusterSetupAppSets = [];
        for (const appSetName of rawTemplate.spec.clusterSetup || []) {
          const appSet = allAppSets.find((appSet) => appSet.metadata?.name === appSetName);
          if (!appSet) {
            missingClusterSetupAppSets.push(appSetName);
            clusterSetup.push({
              name: appSetName,
              spec: generateEmptyArgoSpec(),
            });
          } else {
            clusterSetup.push({
              name: appSetName,
              spec: appSet.spec.template.spec,
            });
          }
        }

        const template: DeserializedClusterTemplate = {
          ...cloneDeep(rawTemplate),
          spec: {
            ...rawTemplate.spec,
            clusterDefinitionName: clusterDefinitionAppSet?.metadata?.name || '',
            clusterDefinition:
              clusterDefinitionAppSet?.spec.template.spec || generateEmptyArgoSpec(),
            clusterSetup,
          },
        };

        const missingAppSetsError = getMissingAppSetsErrorMessage(
          argoNamespace,
          rawTemplate.spec.clusterDefinition,
          clusterDefinitionAppSet,
          missingClusterSetupAppSets,
          t,
        );
        if (missingAppSetsError) {
          template.status = {
            ...rawTemplate.status,
            error: missingAppSetsError.error,
            errorInstructions: missingAppSetsError.instructions,
          };
        }
        return template;
      } catch (err) {
        const emptyClusterTemplate: DeserializedClusterTemplate = {
          metadata: rawTemplate.metadata,
          spec: {
            cost: rawTemplate.spec.cost,
            clusterDefinitionName: '',
            clusterDefinition: generateEmptyArgoSpec(),
          },
          status: {
            error: t(`Failed to deserialize cluster template: {{err}}`, {
              err: getErrorMessage(err),
            }),
          },
        };
        return emptyClusterTemplate;
      }
    },
    [allAppSets, argoNamespace, t],
  );
  return [deserializeTemplate, appSetsLoaded && namespaceLoaded, appSetsError || namespaceError];
};

export default useClusterTemplateDeserializer;
