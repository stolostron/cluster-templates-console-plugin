import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { useNamespaces } from '../../../hooks/useNamespaces';
import { QuotasData, useQuotas } from '../../../hooks/useQuotas';
import PopoverHelpIcon from '../../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../../helpers/SelectField';
import CellLoader from '../../../helpers/CellLoader';

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

const NamespaceField = () => {
  const { t } = useTranslation();
  const [namespaces, namespacesLoaded, namespacesError] = useNamespaces();

  const [quotasData, quotasLoaded, quotasError] = useQuotas();
  const options = React.useMemo(
    () => getNamespaceOptions(namespaces, quotasData, t),
    [namespaces, quotasData, t],
  );
  return (
    <CellLoader loaded={quotasLoaded && namespacesLoaded} error={quotasError || namespacesError}>
      <SelectField
        name="namespace"
        label={t('Namespace')}
        labelIcon={
          <PopoverHelpIcon
            helpText={t(
              'Set the namespace from the list of quotaible namespaces, or enter a name to create a namespace. Each namespace can only have one quota.',
            )}
          />
        }
        isRequired
        options={options}
        isCreatable={true}
        placeholder={t('Enter namespace')}
      />
    </CellLoader>
  );
};

export default NamespaceField;
