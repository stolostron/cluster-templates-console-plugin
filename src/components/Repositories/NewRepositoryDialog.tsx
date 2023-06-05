import * as React from 'react';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { RepositoryType } from '../../types/resourceTypes';
import { Formik } from 'formik';
import { useTranslation } from '../../hooks/useTranslation';
import ModalDialogLoader from '../../helpers/ModalDialogLoader';
import { RepositoryFormValues } from './types';
import RepositoryForm from './RepositoryForm';
import { useHelmChartRepositories } from '../../hooks/useHelmChartRepositories';
import useRepositoryFormValidationSchema from './useRepositoryFormValidationSchema';
import { useCreateRepository } from '../../hooks/useSaveRepository';

type NewRepositoryDialogProps = {
  closeDialog: () => void;
  afterCreate?: (name: string, url: string) => void;
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
    certificateAuthority: '',
    allowSelfSignedCa: false,
  };
}

const NewRepositoryDialog = ({
  closeDialog,
  afterCreate,
  predefinedType,
}: NewRepositoryDialogProps) => {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = React.useState<unknown>();
  const [createRepo, createRepoLoaded, createRepoError] = useCreateRepository();
  const [validationSchema, validationSchemaLoaded, validationSchemaError] =
    useRepositoryFormValidationSchema(true);
  const { refetch } = useHelmChartRepositories();

  const handleSubmit = async (formValues: RepositoryFormValues) => {
    setSubmitError(undefined);

    try {
      await createRepo(formValues);
      if (formValues.type === 'helm') {
        await refetch();
      }
      !!afterCreate && afterCreate(formValues.name, formValues.url);
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
        loaded={createRepoLoaded && validationSchemaLoaded}
        error={createRepoError || validationSchemaError}
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
