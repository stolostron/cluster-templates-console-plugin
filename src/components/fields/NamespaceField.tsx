import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import PopoverHelpIcon from '../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../helpers/SelectField';
import { useNamespaces } from '../../hooks/useNamespaces';
import { useTranslation } from '../../hooks/useTranslation';

type NamespaceFieldProps = {
  options?: SelectInputOption[];
  popoverHelpText?: string;
  name: string;
  label: string;
  isRequired?: boolean;
};

const getNamespaceOptions = (namespaces: string[]): SelectInputOption[] =>
  namespaces
    .sort((n1, n2) => n1.localeCompare(n2))
    .map((name) => ({
      value: name,
      disabled: false,
    }));

const NamespaceField = ({
  options,
  popoverHelpText,
  name,
  label,
  isRequired,
}: NamespaceFieldProps) => {
  const [namespaces, loaded, error] = useNamespaces();
  const { t } = useTranslation();
  useAddAlertOnError(error, t('Failed to load namespace options'));
  const namespaceOptions = React.useMemo(
    () => (options ? options : getNamespaceOptions(namespaces)),
    [namespaces, options],
  );
  return (
    <SelectField
      name={name}
      label={label}
      labelIcon={popoverHelpText ? <PopoverHelpIcon helpText={popoverHelpText} /> : null}
      options={namespaceOptions}
      placeholder={t('Enter namespace')}
      isRequired={isRequired}
      loadingVariant={loaded ? undefined : 'spinner'}
    />
  );
};

export default NamespaceField;
