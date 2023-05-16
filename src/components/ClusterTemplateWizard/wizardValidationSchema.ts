import React from 'react';
import {
  object as objectSchema,
  boolean as booleanSchema,
  array as arraySchema,
  string as stringSchema,
  SchemaOf,
} from 'yup';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { useTranslation } from '../../hooks/useTranslation';
import { RepositoryType } from '../../types/resourceTypes';
import {
  HelmSourceFormikValues,
  GitRepoSourceFormikValues,
  WizardFormikValues,
  PostInstallationFormikValues,
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

  const validationSchema = React.useMemo(() => {
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
      appSetName: stringSchema(),
    });

    const gitRepoValidationSchema: SchemaOf<GitRepoSourceFormikValues> = objectSchema().shape({
      directory: stringSchema(),
      url: stringSchema().required(requiredMsg),
      commit: stringSchema(),
    });

    const postInstallationValidationSchema = objectSchema().shape({
      appSetName: stringSchema(),
      autoSync: booleanSchema(),
      pruneResources: booleanSchema(),
      createNamespace: booleanSchema(),
      type: stringSchema().required(requiredMsg),
      destinationNamespace: nameSchema(t, [], NameValidationType.RFC_1123_LABEL).optional(),
      source: objectSchema().when('type', {
        is: (type: RepositoryType) => type === 'git',
        then: gitRepoValidationSchema,
        otherwise: helmValidationSchema,
      }) as SchemaOf<GitRepoSourceFormikValues | HelmSourceFormikValues>,
    }) as SchemaOf<PostInstallationFormikValues>;

    return objectSchema().shape({
      details: detailsValidationSchema,
      installation: installationValidationSchema,
      postInstallation: arraySchema().of(postInstallationValidationSchema),
      isCreateFlow: booleanSchema(),
    });
  }, [isCreateFlow, t, usedTemplateNames]);

  return [validationSchema as SchemaOf<WizardFormikValues>, loaded, error];
};

export default useWizardValidationSchema;
