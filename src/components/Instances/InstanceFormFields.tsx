import { Divider } from '@patternfly/react-core';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { InstanceParametersFormValues } from '../../types/instanceFormTypes';
import NameField from '../sharedFields/NameField';
import NamespaceField from '../sharedFields/NamespaceField';
import InstanceParametersFormFields from './InstanceParametersFormFields';

const InstanceFormFields = () => {
  const { t } = useTranslation();
  const [postInstallationField] = useField<InstanceParametersFormValues[]>('postInstallation');
  return (
    <>
      <NameField name="name" label={t('Name')} />
      <NamespaceField enableCreate name="namespace" label={t('Namespace')} />
      <Divider />
      <InstanceParametersFormFields fieldName="installation" title={t('Installation parameters')} />
      {postInstallationField.value.map((_, idx) => (
        <InstanceParametersFormFields
          fieldName={`postInstallation[${idx}]`}
          title={t('Post-installation parameters')}
          key={idx}
        />
      ))}
    </>
  );
};

export default InstanceFormFields;
