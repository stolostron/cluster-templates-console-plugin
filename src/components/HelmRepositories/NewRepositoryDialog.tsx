import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ArgoCDSecretData, RepositoryType, Secret } from '../../types/resourceTypes';
import { k8sCreate, useK8sModels } from '@openshift-console/dynamic-plugin-sdk';
import { ARGOCD_SECRET_LABELS, secretGVK } from '../../constants';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { RepositoryFormValues } from './types';
import RepositoryForm from './RepositoryForm';
import { getDecodedSecretData } from '../../utils/secrets';
import useArgocdNamespace from '../../hooks/useArgocdNamespace';
import { useHelmChartRepositories } from '../../hooks/useHelmChartRepositories';
import useRepositoryFormValidationSchema from './useRepositoryFormValidationSchema';

type NewRepositoryDialogProps = {
  closeDialog: () => void;
  afterCreate?: (secretData: ArgoCDSecretData) => void;
  predefinedType?: RepositoryType;
};

export function getInitialValues(type: RepositoryType): RepositoryFormValues {
  return {
    useCredentials: false,
    name: '',
    url: '',
    type,
    username: '',
    password: '',
  };
}

const NewRepositoryDialog = ({
  closeDialog,
  afterCreate,
  predefinedType,
}: NewRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = React.useState<unknown>();
  const [namespace, namespaceLoaded, error] = useArgocdNamespace();
  const [validationSchema, validationSchemaLoaded, validationSchemaError] =
    useRepositoryFormValidationSchema(true);
  const [{ Secret: secretModel }] = useK8sModels();
  const { refetch } = useHelmChartRepositories();
  const handleSubmit = async (formValues: RepositoryFormValues) => {
    const { name, url, type, useCredentials, username, password } = formValues;

    setSubmitError(undefined);

    const baseSecretData = { name, url, type };
    const authenticatedSecretData = {
      username,
      password,
    };

    const createArgoCDSecret = k8sCreate<Secret>({
      model: secretModel,
      data: {
        apiVersion: secretGVK.version,
        kind: secretGVK.kind,
        metadata: {
          name,
          namespace,
          labels: ARGOCD_SECRET_LABELS,
        },
        stringData: useCredentials
          ? { ...baseSecretData, ...authenticatedSecretData }
          : baseSecretData,
        type: 'Opaque',
      },
    });

    try {
      const secret = await createArgoCDSecret;
      if (formValues.type === 'helm') {
        await refetch();
      }
      const decodedSecretData = getDecodedSecretData<ArgoCDSecretData>(secret.data);
      !!afterCreate && afterCreate(decodedSecretData);
      closeDialog();
    } catch (e) {
      setSubmitError(e);
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
      <ModalDialogLoader
        loaded={namespaceLoaded && validationSchemaLoaded}
        error={error || validationSchemaError}
      >
        <Formik<RepositoryFormValues>
          initialValues={getInitialValues(predefinedType || 'git')}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          component={(props) => (
            <RepositoryForm
              {...props}
              submitError={submitError}
              closeDialog={closeDialog}
              predefinedType={predefinedType}
            />
          )}
        />
      </ModalDialogLoader>
    </Modal>
  );
};

export default NewRepositoryDialog;
