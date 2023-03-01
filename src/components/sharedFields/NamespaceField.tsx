import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import PopoverHelpIcon from '../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../helpers/SelectField';
import { useNamespaces } from '../../hooks/useNamespaces';
import { useTranslation } from '../../hooks/useTranslation';

const getNamespaceOptions = (
  namespaces: string[],
  namespaceFilter?: (namesppace: string) => boolean,
): SelectInputOption[] =>
  namespaces
    .sort((n1, n2) => n1.localeCompare(n2))
    .filter((namespace) => (namespaceFilter ? namespaceFilter(namespace) : true))
    .map((name) => ({
      value: name,
      disabled: false,
    }));

const NamespaceField = ({
  name,
  label,
  helpText,
  isDisabled,
  isRequired,
  enableCreate,
  namespaceFilter,
}: {
  name: string;
  label: string;
  helpText?: React.ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  enableCreate?: boolean;
  namespaceFilter?: (namesppace: string) => boolean;
}) => {
  const [namespaces, loaded, error] = useNamespaces();

  const { t } = useTranslation();
  useAddAlertOnError(error, t('Failed to load namespace options'));
  const namespaceOptions = React.useMemo(
    () => getNamespaceOptions(namespaces, namespaceFilter),
    [namespaces, namespaceFilter],
  );
  return (
    <SelectField
      isRequired={isRequired}
      name={name}
      label={label}
      labelIcon={<PopoverHelpIcon helpText={helpText} />}
      options={namespaceOptions}
      placeholder={t('Enter namespace')}
      loadingVariant={loaded ? undefined : 'spinner'}
      isDisabled={isDisabled}
      isCreatable={enableCreate}
      placeholderText={isDisabled ? undefined : t('Select a namespace')}
    />
  );
};

export default NamespaceField;
