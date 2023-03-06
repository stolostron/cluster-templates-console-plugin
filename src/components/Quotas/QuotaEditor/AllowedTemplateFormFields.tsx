import React from 'react';
import SelectField from '../../../helpers/SelectField';
import { useTranslation } from '../../../hooks/useTranslation';

import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { useClusterTemplates } from '../../../hooks/useClusterTemplates';
import ConsumptionField from './ConsumptionField';
import CountField from './CountField';
import { Alert, Form, Stack } from '@patternfly/react-core';
import { getClusterTemplateQuotas, useAllQuotas } from '../../../hooks/useQuotas';
import { useFormikContext } from 'formik';
import { Quota } from '../../../types/resourceTypes';
import CellLoader from '../../../helpers/CellLoader';
import { QuotaFormValues } from '../../../types/quotaFormTypes';
import get from 'lodash/get';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK } from '../../../constants';

const TemplateIsInOtherQuotasAlert = ({
  fieldName,
  allQuotas,
}: {
  fieldName: string;
  allQuotas: Quota[];
}) => {
  const { values } = useFormikContext<QuotaFormValues>();
  const { t } = useTranslation();
  const templateName = get(values, fieldName) as string;
  if (!templateName) {
    return null;
  }
  const templateQuotas = getClusterTemplateQuotas(allQuotas, templateName);
  const otherQuotas = values.isCreateFlow
    ? templateQuotas
    : templateQuotas.filter((quota) => quota.metadata?.name !== values.name);
  if (!values.budget || !templateName || otherQuotas.length === 0) {
    return null;
  }
  const title = t('This template is already used in another quota', { count: otherQuotas.length });
  const message = t('Any change in the Consumption will affect the following quota:', {
    count: otherQuotas.length,
  });
  //handle more than 4 quotas
  return (
    <Alert title={title} variant="info" isInline>
      <>{message}&nbsp;</>
      <>
        {otherQuotas.slice(0, 3).map((otherQuota, idx) => (
          <>
            <ResourceLink
              key={otherQuota.metadata?.uid}
              name={otherQuota.metadata?.name || ''}
              namespace={otherQuota.metadata?.namespace || ''}
              groupVersionKind={clusterTemplateQuotaGVK}
              hideIcon={true}
            />
          </>
        ))}
      </>
    </Alert>
  );
};

const SelectTemplateField = ({
  fieldNamePrefix,
  idx,
}: {
  fieldNamePrefix: string;
  idx: number;
}) => {
  const [templates, loaded, error] = useClusterTemplates();
  const [allQuotas, allQuotasLoaded, allQuotasError] = useAllQuotas();
  // t('Failed to load template options')
  useAddAlertOnError(error, 'Failed to load template options');
  // t('Failed to load quotas')
  useAddAlertOnError(allQuotasError, 'Failed to load quotas');
  const { t } = useTranslation();
  return (
    <CellLoader loaded={loaded && allQuotasLoaded}>
      <Stack hasGutter>
        <SelectField
          label={t('Template {{idx}}', { idx: idx + 1 })}
          name={`${fieldNamePrefix}.template`}
          options={templates.map((template) => template.metadata?.name || '')}
          aria-label={t('Select template')}
          isRequired={true}
          placeholderText={t('Select a template')}
          loadingVariant={loaded && allQuotasLoaded ? undefined : 'spinner'}
          isDisabled={!!error}
        />
        <TemplateIsInOtherQuotasAlert
          allQuotas={allQuotas}
          fieldName={`${fieldNamePrefix}.template`}
        />
      </Stack>
    </CellLoader>
  );
};

const AllowedTemplateFormFields = ({ fieldName, idx }: { fieldName: string; idx: number }) => {
  return (
    <Form>
      <SelectTemplateField fieldNamePrefix={fieldName} idx={idx} />
      <ConsumptionField fieldNamePrefix={fieldName} />
      <CountField fieldNamePrefix={fieldName} />
    </Form>
  );
};

export default AllowedTemplateFormFields;
