import React from 'react';
import { TFunction } from 'react-i18next';
import { useNamespaces } from '../../../hooks/useNamespaces';
import { QuotasData, useQuotas } from '../../../hooks/useQuotas';
import PopoverHelpIcon from '../../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../../helpers/SelectField';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { useTranslation } from '../../../hooks/useTranslation';

const getNamespaceOptions = (
  namespaces: string[],
  quotasData: QuotasData,
  t: TFunction,
): SelectInputOption[] => {
  return namespaces.sort().map((namespace: string) => {
    const namespaceHasQuota = quotasData.namespaceHasQuota(namespace);
    const ret: SelectInputOption = {
      value: namespace,
      disabled: namespaceHasQuota,
      description: namespaceHasQuota
        ? t('This namespace already has a quota associated to it')
        : undefined,
    };
    return ret;
  });
};

const QuotaNamespaceField = () => {
  const { t } = useTranslation();
  const [namespaces, namespacesLoaded, namespaceError] = useNamespaces();
  useAddAlertOnError(namespaceError, t('Failed to load namespace options'));
  const [quotasData, quotasLoaded, quotasError] = useQuotas();
  useAddAlertOnError(quotasError, t('Failed to load namespace options'));
  const options = React.useMemo(
    () => getNamespaceOptions(namespaces, quotasData, t),
    [namespaces, quotasData, t],
  );
  return (
    <SelectField
      name="namespace"
      label={t('Namespace')}
      labelIcon={
        <PopoverHelpIcon
          helpText={t(
            'Set the namespace from the list of available namespaces, or enter a name to create a namespace. Each namespace can only have one quota.',
          )}
        />
      }
      isRequired
      options={options}
      isCreatable={true}
      placeholder={t('Enter namespace')}
      isDisabled={!!quotasError || !!namespaceError}
      loadingVariant={quotasLoaded && namespacesLoaded ? undefined : 'spinner'}
    />
  );
};

export default QuotaNamespaceField;
