import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ConfigMap, HelmChartRepository, Secret } from '../../types';
import {
  k8sPatch,
  useK8sModels,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { configMapGVK, helmChartRepositoryReference, secretGVK } from '../../constants';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import { HelmRepositoryFormValues, FormError } from './types';
import {
  getCommonPromises,
  getDecodedSecretData,
  getDefaultConfigMapName,
  getDefaultSecretName,
  getHelmRepoConnectionConfigPatch,
  getValidationSchema,
  NAMESPACE,
  SECRET_TYPE,
} from './utils';
import HelmRepositoryForm from './HelmRepositoryForm';

type EditHelmRepositoryDialogProps = {
  helmChartRepository: HelmChartRepository;
  closeDialog: () => void;
};

export function getInitialValues(
  helmChartRepository: HelmChartRepository,
  secret?: Secret,
  configMap?: ConfigMap,
): HelmRepositoryFormValues {
  const { tlsClientConfig, ca, url } = helmChartRepository.spec.connectionConfig;
  const useCredentials = !!(tlsClientConfig || ca);
  const { tlsClientCert, tlsClientKey } = getDecodedSecretData(secret?.data);
  return {
    name: helmChartRepository.metadata?.name,
    url,
    description: helmChartRepository.spec.description || '',
    useCredentials,
    existingSecretName: secret?.metadata?.name || '',
    existingConfigMapName: configMap?.metadata?.name || '',
    caCertificate: configMap?.data?.['ca-bundle.crt'] || '',
    tlsClientCert: tlsClientCert || '',
    tlsClientKey: tlsClientKey || '',
  };
}

const EditHelmRepositoryDialog = ({
  helmChartRepository,
  closeDialog,
}: EditHelmRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<FormError | undefined>();
  const { ca, tlsClientConfig } = helmChartRepository.spec.connectionConfig;

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
  const initialConfigMap = configMaps.find((cm) => cm.metadata?.name === ca?.name);
  const initialSecret = secrets.find((s) => s.metadata?.name === tlsClientConfig?.name);
  const dataLoaded = secretsLoaded && configMapsLoaded;

  const handleSubmit = async (formValues: HelmRepositoryFormValues) => {
    const { existingConfigMapName, existingSecretName, url, description, useCredentials } =
      formValues;

    const configMapName =
      existingConfigMapName || getDefaultConfigMapName(helmChartRepository.metadata?.name);
    const secretName =
      existingSecretName || getDefaultSecretName(helmChartRepository.metadata?.name);

    setFormError(undefined);

    const promises = getCommonPromises({
      formValues,
      secretModel,
      configMapModel,
      secrets,
      configMaps,
      configMapName,
      secretName,
      helmChartRepository,
    });

    const hcrPatch = k8sPatch<HelmChartRepository>({
      model: helmChartRepoModel,
      resource: helmChartRepository,
      data: [
        {
          op: 'replace',
          path: '/spec/connectionConfig',
          value: getHelmRepoConnectionConfigPatch({
            url,
            useCredentials,
            secretName,
            configMapName,
          }),
        },
        {
          op: 'replace',
          path: '/spec/description',
          value: description,
        },
      ],
    });

    try {
      await Promise.all([hcrPatch, ...promises]);
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
      title={t('Edit repository')}
      onClose={closeDialog}
      aria-label="Edit repository dialog"
      showClose
      hasNoBodyWrapper
    >
      <ModalDialogLoader loaded={dataLoaded}>
        <Formik<HelmRepositoryFormValues>
          initialValues={getInitialValues(helmChartRepository, initialSecret, initialConfigMap)}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(t)}
          component={(props) => (
            <HelmRepositoryForm
              {...props}
              helmChartRepository={helmChartRepository}
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

export default EditHelmRepositoryDialog;
