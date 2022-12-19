import {
  Stack,
  StackItem,
  TextContent,
  Text,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import CellLoader from '../../../../helpers/CellLoader';
import { useAddAlertOnError } from '../../../../alerts/useAddAlertOnError';
import { QuotasData, useQuotas } from '../../../../hooks/useQuotas';
import { useTranslation } from '../../../../hooks/useTranslation';
import { QuotaDetails } from '../../../../types';
import { QuotaFormikValues, WizardFormikValues } from '../../types';

export const getQuotaNameAndUsersText = (quotaDetails: QuotaDetails, t: TFunction) => {
  const users = t('{{count}} user', {
    count: quotaDetails.numUsers,
  });
  const groups = t('{{count}} group', {
    count: quotaDetails.numGroups,
  });
  return `${quotaDetails.name}, (${users}, ${groups})`;
};

const getQuotaText = (
  quotaFormikValues: QuotaFormikValues,
  quotaContext: QuotasData,
  t: TFunction,
) => {
  const part1 = getQuotaNameAndUsersText(
    quotaContext.getQuotaDetails(quotaFormikValues.quota.name, quotaFormikValues.quota.namespace),
    t,
  );

  if (!quotaFormikValues.limitAllowed) {
    return part1;
  }
  const part2 = t('up to {{clusters}} clusters', { clusters: quotaFormikValues.numAllowed });
  return `${part1} / ${part2}`;
};

const ReviewQuotas = ({ quotas }: { quotas: QuotaFormikValues[] }) => {
  const { t } = useTranslation();
  const [quotasContext, loaded, error] = useQuotas();
  useAddAlertOnError(error, t('Failed to load quotas'));
  return (
    <CellLoader loaded={loaded}>
      {quotas.map((quota) => {
        if (!quota.quota) {
          return;
        }
        return <Text key={quota.quota.toString()}>{getQuotaText(quota, quotasContext, t)}</Text>;
      })}
    </CellLoader>
  );
};

const ReviewStep = () => {
  const { values } = useFormikContext<WizardFormikValues>();
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">{t('Review')}</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Name')}</DescriptionListTerm>
            <DescriptionListDescription>{values.details.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('HELM chart repository')}</DescriptionListTerm>
            <DescriptionListDescription>{values.details.helmRepo}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('HELM chart')}</DescriptionListTerm>
            <DescriptionListDescription>{values.details.helmChart}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Cost')}</DescriptionListTerm>
            <DescriptionListDescription>{values.details.cost}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Manage quotas')}</DescriptionListTerm>
            <DescriptionListDescription>
              <ReviewQuotas quotas={values.quotas} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </StackItem>
    </Stack>
  );
};

export default ReviewStep;
