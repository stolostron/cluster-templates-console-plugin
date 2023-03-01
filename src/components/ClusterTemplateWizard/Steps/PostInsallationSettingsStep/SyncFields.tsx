import { FormGroup } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxField } from 'formik-pf';
import React from 'react';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import { useTranslation } from '../../../../hooks/useTranslation';

const SyncFields = ({ fieldName }: { fieldName: string }) => {
  const { t } = useTranslation();
  const [{ value: autoSync }] = useField<boolean>(`${fieldName}.autoSync`);
  return (
    <FormGroup label={t('Sync')} fieldId={fieldName} role="group" isInline>
      <CheckboxField
        label={t('Auto-sync')}
        labelIcon={
          <PopoverHelpIcon
            helpText={t('Automated will keep an application synced to the target revision.')}
          />
        }
        name={`${fieldName}.autoSync`}
        fieldId={`${fieldName}.autoSync`}
      />
      <CheckboxField
        label={t('Prune resources')}
        name={`${fieldName}.pruneResources`}
        fieldId={`${fieldName}.pruneResources`}
        isDisabled={!autoSync}
        labelIcon={
          <PopoverHelpIcon
            helpText={t(
              'Prune specifies whether to delete resources from the cluster that are not found in the sources anymore as part of the automated sync.',
            )}
          />
        }
      />
      <CheckboxField
        label={t('Automatically create destination namespace if it does not exist')}
        name={`${fieldName}.createNamespace`}
        fieldId={`${fieldName}.createNamespace`}
      />
    </FormGroup>
  );
};

export default SyncFields;
