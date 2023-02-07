import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ArgoCDSecretData, Secret } from '../../types';
import { k8sCreate, useK8sModels } from '@openshift-console/dynamic-plugin-sdk';
import { ARGOCD_NAMESPACE, ARGOCD_SECRET_LABELS, secretGVK } from '../../constants';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { getValidationSchema } from './utils';
import { FormError, RepositoryFormValues } from './types';
import RepositoryForm from './RepositoryForm';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import { getDecodedSecretData } from '../../utils/secrets';

type NewRepositoryDialogProps = {
  closeDialog: () => void;
  onCreate?: (secretData: ArgoCDSecretData) => Promise<void>;
};

export function getInitialValues(): RepositoryFormValues {
  return {
    useCredentials: false,
    name: '',
    url: '',
    type: 'helm',
    username: '',
    password: '',
    tlsClientCertData: '',
    tlsClientCertKey: '',
    insecure: false,
    description: '',
  };
}

const NewRepositoryDialog = ({ closeDialog, onCreate }: NewRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<FormError | undefined>();
  // const [secrets, secretsLoaded, secretsError] = useArgoCDSecrets();
  const [, secretsLoaded] = useArgoCDSecrets();

  const [{ Secret: secretModel }] = useK8sModels();

  const handleSubmit = async (formValues: RepositoryFormValues) => {
    const {
      name,
      url,
      type,
      description,
      useCredentials,
      username,
      password,
      tlsClientCertData,
      tlsClientCertKey,
      insecure,
    } = formValues;

    setFormError(undefined);

    const baseSecretData = { name, url, type, description };
    const authenticatedSecretData = {
      username,
      password,
      tlsClientCertData,
      tlsClientCertKey,
      insecure,
    };

    const createArgoCDSecret = k8sCreate<Secret>({
      model: secretModel,
      data: {
        apiVersion: secretGVK.version,
        kind: secretGVK.kind,
        metadata: {
          name,
          namespace: ARGOCD_NAMESPACE,
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
      const decodedSecretData = getDecodedSecretData<ArgoCDSecretData>(secret.data);
      !!onCreate && (await onCreate(decodedSecretData));
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
      <ModalDialogLoader loaded={secretsLoaded}>
        <Formik<RepositoryFormValues>
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(t)}
          component={(props) => (
            <RepositoryForm {...props} formError={formError} closeDialog={closeDialog} />
          )}
        />
      </ModalDialogLoader>
    </Modal>
  );
};

export default NewRepositoryDialog;
