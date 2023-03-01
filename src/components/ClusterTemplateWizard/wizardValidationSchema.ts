import React from 'react';
import {
  object as objectSchema,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
  lazy as lazySchema,
  SchemaOf,
} from 'yup';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { useTranslation } from '../../hooks/useTranslation';
import {
  HelmSourceFormikValues,
  GitRepoSourceFormikValues,
  isHelmSource,
  WizardFormikValues,
} from '../../types/wizardFormTypes';
import { nameSchema, NameValidationType } from '../../utils/commonValidationSchemas';

const useWizardValidationSchema = (
  isCreateFlow: boolean,
): [SchemaOf<WizardFormikValues>, boolean, unknown] => {
  const [clusterTemplates, loaded, error] = useClusterTemplates();

  const usedTemplateNames = React.useMemo(
    () =>
      clusterTemplates.reduce<string[]>(
        (res, template) => (template.metadata?.name ? [...res, template.metadata?.name] : res),
        [],
      ),
    [clusterTemplates],
  );
  const { t } = useTranslation();

  const requiredMsg = t('Required');

  const helmValidationSchema: SchemaOf<HelmSourceFormikValues> = objectSchema().shape({
    url: stringSchema().required(requiredMsg),
    chart: stringSchema().required(requiredMsg),
    version: stringSchema().required(requiredMsg),
  });

  const detailsValidationSchema = objectSchema().shape({
    name: isCreateFlow ? nameSchema(t, usedTemplateNames).required(requiredMsg) : stringSchema(),
    description: stringSchema().optional(),
    labels: objectSchema().optional(),
  });

  const installationValidationSchema = objectSchema().shape({
    source: helmValidationSchema,
    useInstanceNamespace: booleanSchema(),
    destinationNamespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL).optional(),
  });

  const gitRepoValidationSchema = objectSchema().shape({
    directory: stringSchema().optional(),
    url: stringSchema().required(requiredMsg),
    commit: stringSchema().required(requiredMsg),
  });

  const postInstallationValidationSchema = objectSchema().shape({
    autoSync: booleanSchema(),
    pruneResources: booleanSchema(),
    createNamespace: booleanSchema(),
    destinationNamespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL).optional(),
    source: lazySchema((values: GitRepoSourceFormikValues | HelmSourceFormikValues) =>
      isHelmSource(values) ? helmValidationSchema : gitRepoValidationSchema,
    ),
  });

  const getWizardValidationSchema = React.useCallback(
    () =>
      objectSchema().shape({
        details: detailsValidationSchema,
        installation: installationValidationSchema,
        postInstallation: arraySchema().of(postInstallationValidationSchema),
        isCreateFlow: booleanSchema(),
      }),
    [detailsValidationSchema, installationValidationSchema, postInstallationValidationSchema],
  );

  const validationSchema = React.useMemo(() => {
    return getWizardValidationSchema() as SchemaOf<WizardFormikValues>;
  }, [getWizardValidationSchema]);

  return [validationSchema, loaded, error];
};

export default useWizardValidationSchema;
