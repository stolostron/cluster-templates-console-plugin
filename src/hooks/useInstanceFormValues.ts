import React from 'react';
import {
  InstanceFormValues,
  InstanceParametersFormValues,
  InstanceParameter,
} from '../types/instanceFormTypes';
import { ClusterTemplate, ClusterTemplateSetupStatus } from '../types/resourceTypes';
import { getParameters } from '../utils/instanceUtils';

export const useInstanceFormValues = (
  templateLoadResult: [ClusterTemplate, boolean, unknown],
): [InstanceFormValues | undefined, unknown] => {
  const [error, setError] = React.useState<unknown>();
  const [formValues, setFormValues] = React.useState<InstanceFormValues>();
  const [template, loaded, templateLoadError] = templateLoadResult;

  React.useEffect(() => {
    let hasUnsupportedParameters = false;

    const _getParameters = (values?: string, schema?: string): InstanceParameter[] => {
      const { hasUnsupportedParameters: _hasUnsupportedParameters, parameters } = getParameters(
        values,
        schema,
      );
      hasUnsupportedParameters = _hasUnsupportedParameters;
      return parameters;
    };

    const getPostInstallationItemFormValues = (name: string, values?: string, schema?: string) => {
      return {
        parameters: _getParameters(values, schema),
        name: name,
      };
    };

    const getPostInstallationFormValues = (
      setupStatus: ClusterTemplateSetupStatus,
    ): InstanceParametersFormValues[] => {
      return setupStatus.reduce<InstanceParametersFormValues[]>(
        (prev: InstanceParametersFormValues[], setup) => {
          const formValues = getPostInstallationItemFormValues(
            setup.name,
            setup.values,
            setup.schema,
          );
          return formValues ? [...prev, formValues] : prev;
        },
        [],
      );
    };

    const toInstanceFormValues = (template: ClusterTemplate): InstanceFormValues => {
      return {
        name: '',
        namespace: '',
        installation: {
          parameters: template.status?.clusterDefinition
            ? _getParameters(
                template.status?.clusterDefinition?.values,
                template.status?.clusterDefinition?.schema,
              )
            : [],
          name: template.spec.clusterDefinition,
        },
        postInstallation: template.status?.clusterSetup
          ? getPostInstallationFormValues(template.status?.clusterSetup)
          : [],
        hasUnsupportedParameters,
      };
    };
    try {
      if (!loaded || templateLoadError || formValues) {
        return;
      }
      const _formValues = toInstanceFormValues(template);
      setFormValues(_formValues);
    } catch (err) {
      setError(err);
    }
  }, [template, loaded, templateLoadError, formValues]);
  return [formValues, error];
};
