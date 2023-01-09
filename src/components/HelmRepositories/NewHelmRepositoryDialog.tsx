import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ConfigMap, HelmChartRepository, Secret } from '../../types';
import {
  k8sCreate,
  useK8sModels,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  configMapGVK,
  helmChartRepositoryReference,
  helmRepoGVK,
  secretGVK,
} from '../../constants';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import {
  getCommonPromises,
  getDefaultConfigMapName,
  getDefaultSecretName,
  getHelmRepoConnectionConfigPatch,
  getValidationSchema,
  NAMESPACE,
  SECRET_TYPE,
} from './utils';
import { FormError, HelmRepositoryFormValues } from './types';
import HelmRepositoryForm from './HelmRepositoryForm';

type NewHelmRepositoryDialogProps = {
  closeDialog: () => void;
};

export function getInitialValues(): HelmRepositoryFormValues {
  return {
    name: '',
    description: '',
    url: '',
    useCredentials: false,
    existingSecretName: '',
    existingConfigMapName: '',
    caCertificate: '',
    tlsClientCert: '',
    tlsClientKey: '',
  };
}

const NewHelmRepositoryDialog = ({ closeDialog }: NewHelmRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<FormError | undefined>();

  const [
    {
      ConfigMap: configMapModel,
      Secret: secretModel,
      [helmChartRepositoryReference]: helmChartRepoModel,
    },
  ] = useK8sModels();
  const {
    secrets: { data: secrets, loaded: secretsLoaded },
    configMaps: { data: configMaps, loaded: configMapsLoaded },
  } = useK8sWatchResources<{
    secrets: Secret[];
    configMaps: ConfigMap[];
  }>({
    secrets: {
      groupVersionKind: secretGVK,
      namespace: NAMESPACE,
      isList: true,
    },
    configMaps: {
      groupVersionKind: configMapGVK,
      namespace: NAMESPACE,
      isList: true,
    },
  });

  const availableTlsSecrets = secrets.filter((s) => s.type === SECRET_TYPE);
  const dataLoaded = secretsLoaded && configMapsLoaded;

  const handleSubmit = async (formValues: HelmRepositoryFormValues) => {
    const { name, existingConfigMapName, existingSecretName, url, description, useCredentials } =
      formValues;
    const configMapName = existingConfigMapName || getDefaultConfigMapName(name);
    const secretName = existingSecretName || getDefaultSecretName(name);

    setFormError(undefined);

    const promises = getCommonPromises({
      formValues,
      secretModel,
      configMapModel,
      secrets,
      configMaps,
      configMapName,
      secretName,
    });

    const hcrCreate = k8sCreate<HelmChartRepository>({
      model: helmChartRepoModel,
      data: {
        apiVersion: `${helmRepoGVK.group}/${helmRepoGVK.version}`,
        kind: helmRepoGVK.kind,
        metadata: {
          name,
        },
        spec: {
          description,
          disabled: false,
          name,
          connectionConfig: getHelmRepoConnectionConfigPatch({
            url,
            useCredentials,
            secretName,
            configMapName,
          }),
        },
      },
    });

    try {
      await Promise.all([hcrCreate, ...promises]);
      closeDialog();
    } catch (e) {
      setFormError({
        title: t('Something went wrong'),
        message: getErrorMessage(e),
      });
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      title={t('Add a repository')}
      onClose={closeDialog}
      aria-label="Add repository dialog"
      showClose
      hasNoBodyWrapper
    >
      <ModalDialogLoader loaded={dataLoaded}>
        <Formik<HelmRepositoryFormValues>
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(t)}
          component={(props) => (
            <HelmRepositoryForm
              {...props}
              availableTlsSecrets={availableTlsSecrets}
              configMaps={configMaps}
              formError={formError}
              closeDialog={closeDialog}
            />
          )}
        />
      </ModalDialogLoader>
    </Modal>
  );
};

export default NewHelmRepositoryDialog;
