import React from 'react';
import { useNamespaces } from '../../../hooks/useNamespaces';
import PopoverHelpIcon from '../../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../../helpers/SelectField';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { useTranslation } from '../../../hooks/useTranslation';

const getNamespaceOptions = (namespaces: string[]): SelectInputOption[] =>
  namespaces
    .sort((n1, n2) => n1.localeCompare(n2))
    .map((name) => ({
      value: name,
      disabled: false,
    }));

const QuotaNamespaceField = () => {
  const { t } = useTranslation();
  const [namespaces, namespacesLoaded, namespaceError] = useNamespaces();
  const options = React.useMemo(() => getNamespaceOptions(namespaces), [namespaces]);
  // t('Failed to load namespace options')
  useAddAlertOnError(namespaceError, 'Failed to load namespace options');
  return (
    <SelectField
      name="namespace"
      label={t('Namespace')}
      labelIcon={
        <PopoverHelpIcon
          helpText={t(
            'Each namespace can only have one quota, only available ones appear in the list.',
          )}
        />
      }
      isRequired
      options={options}
      isCreatable={true}
      placeholderText={t('Enter a namespace')}
      isDisabled={!!namespaceError}
      loadingVariant={namespacesLoaded ? undefined : 'spinner'}
    />
  );
};

export default QuotaNamespaceField;
