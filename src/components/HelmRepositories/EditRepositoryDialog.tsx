import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ArgoCDSecretData, DecodedSecret } from '../../types/resourceTypes';
import { k8sPatch, useK8sModels } from '@openshift-console/dynamic-plugin-sdk';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';
import { RepositoryFormValues, FormError } from './types';
import { getValidationSchema } from './utils';
import RepositoryForm from './RepositoryForm';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';

type EditRepositoryDialogProps = {
  argoCDSecret: DecodedSecret<ArgoCDSecretData>;
  closeDialog: () => void;
};

export function getInitialValues(
  argoCDSecret: DecodedSecret<ArgoCDSecretData>,
): RepositoryFormValues {
  return {
    name: argoCDSecret.metadata?.name || '',
    url: argoCDSecret.data?.url || '',
    description: argoCDSecret.data?.description || '',
    useCredentials: !!argoCDSecret.data?.username,
    type: argoCDSecret.data?.type || 'helm',
    username: argoCDSecret.data?.username || '',
    password: argoCDSecret.data?.password || '',
    tlsClientCertData: argoCDSecret.data?.tlsClientCertData || '',
    tlsClientCertKey: argoCDSecret.data?.tlsClientCertKey || '',
    insecure: !!argoCDSecret.data?.insecure,
  };
}

const EditHelmRepositoryDialog = ({ argoCDSecret, closeDialog }: EditRepositoryDialogProps) => {
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

    const updateArgoCDSecret = k8sPatch<DecodedSecret<ArgoCDSecretData>>({
      model: secretModel,
      resource: argoCDSecret,
      data: [
        {
          op: 'replace',
          path: '/stringData',
          value: useCredentials
            ? { ...baseSecretData, ...authenticatedSecretData }
            : baseSecretData,
        },
      ],
    });

    try {
      await updateArgoCDSecret;
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
      <ModalDialogLoader loaded={secretsLoaded}>
        <Formik<RepositoryFormValues>
          initialValues={getInitialValues(argoCDSecret)}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(t)}
          component={(props) => (
            <RepositoryForm
              {...props}
              argoCDSecret={argoCDSecret}
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
