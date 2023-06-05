import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { ArgoCDSecretData, DecodedSecret } from '../../types/resourceTypes';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import { RepositoryFormValues } from './types';
import RepositoryForm from './RepositoryForm';
import useRepositoryFormValidationSchema from './useRepositoryFormValidationSchema';
import { useClusterTemplatesFromRepo } from '../../hooks/useClusterTemplates';
import { useUpdateRepository } from '../../hooks/useSaveRepository';

type EditRepositoryDialogProps = {
  argoCDSecret: DecodedSecret<ArgoCDSecretData>;
  closeDialog: () => void;
};

export function getInitialValues(
  argoCDSecret: DecodedSecret<ArgoCDSecretData>,
): RepositoryFormValues {
  const url = argoCDSecret.data?.url || '';

  return {
    name: argoCDSecret.metadata?.name || '',
    url: url,
    useCredentials: !!argoCDSecret.data?.username,
    type: argoCDSecret.data?.type || 'git',
    username: argoCDSecret.data?.username || '',
    password: argoCDSecret.data?.password || '',
    allowSelfSignedCa: argoCDSecret.data.insecure === 'true',
    certificateAuthority: '',
  };
}

const EditRepositoryDialog = ({ argoCDSecret, closeDialog }: EditRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = React.useState<unknown>();
  const [updateRepo, saveRepoLoaded, saveRepoError] = useUpdateRepository(argoCDSecret);
  const [validationSchema, validationSchemaLoaded, validationSchemaError] =
    useRepositoryFormValidationSchema(false);

  const [templatesFromRepo, templatesLoaded, templatesLoadError] = useClusterTemplatesFromRepo(
    argoCDSecret.data.url,
  );
  const handleSubmit = async (formValues: RepositoryFormValues) => {
    setSubmitError(undefined);

    try {
      await updateRepo(formValues);
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
        loaded={validationSchemaLoaded && templatesLoaded && saveRepoLoaded}
        error={validationSchemaError || templatesLoadError || saveRepoError}
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

export default EditRepositoryDialog;
