import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ArgoCDSecretData, DecodedSecret } from '../../types/resourceTypes';
import { k8sPatch, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { RepositoryFormValues } from './types';
import RepositoryForm from './RepositoryForm';
import useRepositoryFormValidationSchema from './useRepositoryFormValidationSchema';
import { useClusterTemplatesFromRepo } from '../../hooks/useClusterTemplates';
import { secretGVK } from '../../constants';

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
    useCredentials: !!argoCDSecret.data?.username,
    type: argoCDSecret.data?.type || 'helm',
    username: argoCDSecret.data?.username || '',
    password: argoCDSecret.data?.password || '',
  };
}

const EditHelmRepositoryDialog = ({ argoCDSecret, closeDialog }: EditRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = React.useState<unknown>();

  const [secretModel, secretModelLoading] = useK8sModel(secretGVK);
  const [validationSchema, validationSchemaLoaded, validationSchemaError] =
    useRepositoryFormValidationSchema(false);

  const [templatesFromRepo, templatesLoaded, templatesLoadError] = useClusterTemplatesFromRepo(
    argoCDSecret.data.url,
  );
  const handleSubmit = async (formValues: RepositoryFormValues) => {
    const { name, url, type, useCredentials, username, password } = formValues;

    setSubmitError(undefined);

    const baseSecretData = { name, url, type };
    const authenticatedSecretData = {
      username,
      password,
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
      setSubmitError(e);
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      title={t('Edit {{repoName}} repository', { repoName: argoCDSecret.data.name })}
      onClose={closeDialog}
      aria-label="Edit repository dialog"
      showClose
      hasNoBodyWrapper
    >
      <ModalDialogLoader
        loaded={validationSchemaLoaded && templatesLoaded && !secretModelLoading}
        error={validationSchemaError || templatesLoadError}
      >
        <Formik<RepositoryFormValues>
          initialValues={getInitialValues(argoCDSecret)}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          component={(props) => (
            <RepositoryForm
              {...props}
              argoCDSecret={argoCDSecret}
              submitError={submitError}
              closeDialog={closeDialog}
              templatesFromRepo={templatesFromRepo}
            />
          )}
        />
      </ModalDialogLoader>
    </Modal>
  );
};

export default EditHelmRepositoryDialog;
