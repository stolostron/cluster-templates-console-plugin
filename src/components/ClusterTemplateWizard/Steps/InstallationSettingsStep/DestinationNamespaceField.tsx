import { Stack } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxField } from 'formik-pf';
import React from 'react';
import { useAddAlertOnError } from '../../../../alerts/useAddAlertOnError';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../../../helpers/SelectField';
import { useNamespaces } from '../../../../hooks/useNamespaces';
import { useTranslation } from '../../../../hooks/useTranslation';
import '../styles.css';

const getNamespaceOptions = (namespaces: string[]): SelectInputOption[] =>
  namespaces
    .sort((n1, n2) => n1.localeCompare(n2))
    .map((name) => ({
      value: name,
      disabled: false,
    }));

const DestinationNamespaceField = () => {
  const [namespaces, loaded, error] = useNamespaces();
  const useInstanceNamespaceFieldName = 'installation.useInstanceNamespace';
  const namespaceFieldName = 'installation.spec.destinationNamespace';
  const [{ value: useInstanceNamespace }] = useField<boolean>(useInstanceNamespaceFieldName);
  const [, , { setValue: setNamespace }] = useField<string>(namespaceFieldName);
  const { t } = useTranslation();
  useAddAlertOnError(error, t('Failed to load namespace options'));
  const namespaceOptions = React.useMemo(() => getNamespaceOptions(namespaces), [namespaces]);
  React.useEffect(() => {
    if (useInstanceNamespace) {
      setNamespace('');
    }
  }, [setNamespace, useInstanceNamespace]);
  return (
    <Stack hasGutter className="installation-destination-namespace">
      <SelectField
        name={'installation.spec.destinationNamespace'}
        label={t('Destination namespace')}
        labelIcon={
          <PopoverHelpIcon
            helpText={t(
              "Specify the target namespace for the application's resources. The namespace will only be set for namespace-scoped resources that have not set a value for .metadata.namespace",
            )}
          />
        }
        options={namespaceOptions}
        placeholder={t('Enter namespace')}
        loadingVariant={loaded ? undefined : 'spinner'}
        isDisabled={useInstanceNamespace}
        isCreatable={true}
        placeholderText={useInstanceNamespace ? undefined : t('Enter a namespace')}
      />
      <CheckboxField
        name={useInstanceNamespaceFieldName}
        fieldId={useInstanceNamespaceFieldName}
        label={t('Use the same as the cluster template instance')}
      />
    </Stack>
  );
};

export default DestinationNamespaceField;
