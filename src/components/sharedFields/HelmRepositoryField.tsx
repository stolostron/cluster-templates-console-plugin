import * as React from 'react';
import {
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
  SelectProps,
  ValidatedOptions,
  Button,
} from '@patternfly/react-core';
import { useField } from 'formik';
import { useHelmChartRepositories } from '../../hooks/useHelmChartRepositories';
import PopoverHelpIcon from '../../helpers/PopoverHelpIcon';
import { useAlerts } from '../../alerts/AlertsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { PlusIcon } from '@patternfly/react-icons';
import NewRepositoryDialog from '../HelmRepositories/NewRepositoryDialog';
import CellLoader from '../../helpers/CellLoader';
import { getErrorMessage } from '../../utils/utils';
import { ArgoCDSecretData } from '../../types';

type HelmRepositoryFieldProps = {
  fieldName: string;
  showLabelIcon: boolean;
};

const HelmRepositoryField = ({ fieldName, showLabelIcon }: HelmRepositoryFieldProps) => {
  const { addAlert } = useAlerts();
  const { t } = useTranslation();
  const [{ value: url, onBlur }, { touched, error }, { setValue }] = useField<string>(fieldName);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { repos, loaded, error: reposLoadError, refetch } = useHelmChartRepositories();
  const [newRepositoryDialogOpen, setNewRepositoryDialogOpen] = React.useState(false);

  const onSelect: SelectProps['onSelect'] = (_, value) => {
    const repo = repos.find((repo) => repo.name === value);
    if (!repo) {
      // t('Unexpected error')
      addAlert({ title: 'Unexpected error', message: `Failed to find repository ${value}` });
      setValue('');
    } else {
      setValue(repo.url, true);
    }
    setIsOpen(false);
  };

  const onNewRepoCreated = async (argoCDSecretData: ArgoCDSecretData) => {
    await refetch();
    setValue(argoCDSecretData.url || '', true);
  };

  const selectedRepo = url ? repos.find((repo) => repo.url === url) : undefined;
  const errorMessage = error || (selectedRepo && selectedRepo.error);
  const validated = touched && errorMessage ? ValidatedOptions.error : ValidatedOptions.default;
  const repoNames = repos
    .map((repo) => repo.name)
    .sort((name1, name2) => name1.localeCompare(name2));

  return (
    <FormGroup
      fieldId={fieldName}
      validated={validated}
      label={t('HELM chart repository')}
      helperTextInvalid={errorMessage}
      isRequired={true}
      labelIcon={
        showLabelIcon ? undefined : (
          <PopoverHelpIcon
            helpText={t(
              'Select the Helm chart repository that contains the Helm Chart you would like to use for this cluster template.',
            )}
          />
        )
      }
    >
      <CellLoader loaded={loaded} fontSize="2xl">
        <Select
          variant={SelectVariant.typeahead}
          validated={validated}
          onToggle={() => setIsOpen(!isOpen)}
          onSelect={onSelect}
          isOpen={isOpen}
          selections={selectedRepo ? selectedRepo.name : ''}
          typeAheadAriaLabel={t('Type a Helm repository repoNames')}
          placeholderText={t('Select a Helm chart repository')}
          toggleId={fieldName}
          className="cluster-templates-select-field"
          isDisabled={!!reposLoadError}
          onBlur={onBlur}
          footer={
            <Button
              variant="link"
              onClick={() => setNewRepositoryDialogOpen(true)}
              icon={<PlusIcon />}
              className="cluster-templates-field-array__btn"
            >
              {t('Add another repository URL')}
            </Button>
          }
        >
          {repoNames.map((name) => {
            return <SelectOption value={name} isDisabled={false} key={name} name={name} />;
          })}
        </Select>
      </CellLoader>
      {newRepositoryDialogOpen && (
        <NewRepositoryDialog
          closeDialog={() => setNewRepositoryDialogOpen(false)}
          onCreate={onNewRepoCreated}
        />
      )}
    </FormGroup>
  );
};

export default HelmRepositoryField;
