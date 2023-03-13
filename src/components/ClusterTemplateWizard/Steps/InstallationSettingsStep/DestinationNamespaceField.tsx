import { useField } from 'formik';
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import NamespaceField from '../../../sharedFields/NamespaceField';
import WithCheckboxField from '../../../sharedFields/WithCheckboxField';

const useInstanceNamespaceFieldName = 'installation.useInstanceNamespace';
const namespaceFieldName = 'installation.destinationNamespace';

const DestinationNamespaceField = () => {
  const [{ value: useInstanceNamespace }] = useField<boolean>(useInstanceNamespaceFieldName);
  const [{ value: namespace }, , { setValue: setNamespace }] = useField<string | undefined>(
    namespaceFieldName,
  );
  const { t } = useTranslation();

  React.useEffect(() => {
    if (useInstanceNamespace && namespace) {
      setNamespace(undefined);
    }
  }, [setNamespace, useInstanceNamespace, namespace]);

  return (
    <WithCheckboxField
      checkboxFieldName={useInstanceNamespaceFieldName}
      label={'Use the same destination namespace as the cluster template instance'}
      showChlidren={!useInstanceNamespace}
      popoverHelpText={t(
        'Specify the target namespace for the resources. The namespace will only be set for namespace-scoped resources that have not set a value for .metadata.namespace',
      )}
    >
      <NamespaceField
        name={namespaceFieldName}
        label={t('Destination namespace')}
        isDisabled={useInstanceNamespace}
        enableCreate={true}
      />
    </WithCheckboxField>
  );
};

export default DestinationNamespaceField;
