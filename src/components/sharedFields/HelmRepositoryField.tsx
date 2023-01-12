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
import { HelmRepository } from '../../types';
import {
  fetchHelmRepository,
  HelmChartRepositoryListResult,
} from '../../hooks/useHelmChartRepositories';
import PopoverHelpIcon from '../../helpers/PopoverHelpIcon';
import { humanizeUrl } from '../../utils/humanizing';
import { useAlerts } from '../../alerts/AlertsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { PlusIcon } from '@patternfly/react-icons';
import NewRepositoryDialog from '../HelmRepositories/NewRepositoryDialog';

type HelmRepositoryFieldProps = {
  fieldName: string;
  reposListResult: HelmChartRepositoryListResult;
  showLabelIcon: boolean;
  onSelectRepo: (repo: HelmRepository) => void;
  onInitializeRepo: (repo: HelmRepository | undefined) => void;
};

const HelmRepositoryField = ({
  fieldName,
  reposListResult,
  showLabelIcon,
  onSelectRepo,
  onInitializeRepo,
}: HelmRepositoryFieldProps) => {
  const { addAlert } = useAlerts();
  const { t } = useTranslation();
  const [{ value: url, onBlur }, { touched, error }, { setValue }] = useField<string>(fieldName);
  const [selectedRepo, setSelectedRepo] = React.useState<HelmRepository>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [repos, loaded, loadError] = reposListResult;
  const [newRepositoryDialogOpen, setNewRepositoryDialogOpen] = React.useState(false);
  const [repoNames, setRepoNames] = React.useState<string[]>([]);
  const errorMessage = error || (selectedRepo && selectedRepo.error);

  const updateRepoNames = (repos: HelmRepository[]) =>
    setRepoNames(repos.map((repo) => repo.name).sort((name1, name2) => name1.localeCompare(name2)));

  const validated = touched && errorMessage ? ValidatedOptions.error : ValidatedOptions.default;
  React.useEffect(() => {
    if (!loaded) {
      return;
    }
    updateRepoNames(repos);
    //initialize
    if (!url) {
      return;
    }
    const repo = repos.find((curRepo) => curRepo.url === url);
    if (!repo) {
      addAlert({
        title: 'Failed to initialize Helm chart fields',
        message: `Failed to find repository ${humanizeUrl(url)}`,
      });
      setValue('');
    } else {
      setSelectedRepo(repo);
    }
    onInitializeRepo(repo);
  }, [loaded]);

  const onSelect: SelectProps['onSelect'] = (_, value) => {
    const repo = repos.find((repo) => repo.name === value);
    setValue(repo.url, true);
    setSelectedRepo(repo);
    onSelectRepo(repo);
    setIsOpen(false);
  };

  const onCloseNewRepositoryDialog = async (repoName?: string) => {
    if (!repoName) {
      setNewRepositoryDialogOpen(false);
      return;
    }
    const newRepo = await fetchHelmRepository(repoName);
    setValue(newRepo.url, true);
    setSelectedRepo(newRepo);
    onSelectRepo(newRepo);
    updateRepoNames([...repos, newRepo]);
    setNewRepositoryDialogOpen(false);
  };

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
        isDisabled={!!loadError}
        loadingVariant={loaded ? undefined : 'spinner'}
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
      {newRepositoryDialogOpen && <NewRepositoryDialog closeDialog={onCloseNewRepositoryDialog} />}
    </FormGroup>
  );
};

export default HelmRepositoryField;
