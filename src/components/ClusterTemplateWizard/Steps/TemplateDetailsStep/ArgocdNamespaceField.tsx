import { useField } from 'formik';
import React from 'react';
import { useAlerts } from '../../../../alerts/AlertsContext';
import { useAddAlertOnError } from '../../../../alerts/useAddAlertOnError';
import CellLoader from '../../../../helpers/CellLoader';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../../../helpers/SelectField';
import useArgocdNamespaces from '../../../../hooks/useArgocdNamespaces';
import { useTranslation } from '../../../../hooks/useTranslation';

const ArgocdNamespaceField = () => {
  const { addAlert } = useAlerts();
  const [argoCdNamespaces, loaded, error] = useArgocdNamespaces();
  const fieldName = 'details.argocdNamespace';
  const [{ value }, , { setValue }] = useField<string>(fieldName);
  const { t } = useTranslation();
  useAddAlertOnError(error, t('Failed to get ArgoCD instances'));
  React.useEffect(() => {
    if (loaded && argoCdNamespaces.length === 0 && !error) {
      addAlert({ title: t('There are no ArgoCD instances. Please create one') });
    } else if (argoCdNamespaces.length === 1 && !value) {
      setValue(argoCdNamespaces[0]);
    }
  }, [argoCdNamespaces, loaded]);
  const options = React.useMemo<SelectInputOption[]>(
    () =>
      argoCdNamespaces.map((namepsace) => ({
        value: namepsace,
        disabled: false,
      })),
    [argoCdNamespaces],
  );
  return (
    <CellLoader loaded={loaded}>
      <SelectField
        options={options}
        name={fieldName}
        label={t('Argocd namespace')}
        labelIcon={
          <PopoverHelpIcon
            helpText={t('Select a namespace where ArgoCD Application resource will be created.')}
          />
        }
        isDisabled={options.length === 0}
      />
    </CellLoader>
  );
};

export default ArgocdNamespaceField;
