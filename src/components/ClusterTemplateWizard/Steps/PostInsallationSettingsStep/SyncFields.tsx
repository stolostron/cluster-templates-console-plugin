import { FormGroup } from '@patternfly/react-core';
import { CheckboxField } from 'formik-pf';
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';

const SyncFields = ({ fieldName }: { fieldName: string }) => {
  const { t } = useTranslation();
  return (
    <FormGroup label={t('Sync')} fieldId={fieldName} role="group" isInline>
      <CheckboxField
        label={t('Auto-sync')}
        name={`${fieldName}.autoSync`}
        fieldId={`${fieldName}.autoSync`}
      />
      <CheckboxField
        label={t('Prune resources')}
        name={`${fieldName}.pruneResources`}
        fieldId={`${fieldName}.pruneResources`}
      />
    </FormGroup>
  );
};

export default SyncFields;
