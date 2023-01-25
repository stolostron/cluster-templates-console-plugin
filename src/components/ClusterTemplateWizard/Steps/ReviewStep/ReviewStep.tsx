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

import {
  ClusterTemplateCost,
  InstallationDetails,
  PostInstallationDetails,
} from '../../../sharedDetailItems/clusterTemplateDetailItems';
import { useAlerts } from '../../../../alerts/AlertsContext';
import toClusterTemplate from '../../../../utils/toClusterTemplate';

export const getQuotaNameAndUsersText = (quotaDetails: QuotaDetails, t: TFunction) => {
  const users = t('{{count}} user', {
    count: quotaDetails.numUsers,
  });
  const groups = t('{{count}} group', {
    count: quotaDetails.numGroups,
  });
  return `${quotaDetails.name}, (${users}, ${groups})`;
};

const QuotaSummary = ({
  quotaFormikValues,
  quotasData,
}: {
  quotaFormikValues: QuotaFormikValues;
  quotasData: QuotasData;
}) => {
  const { addAlert } = useAlerts();
  const { t } = useTranslation();
  const [quotaDetails, setQuotaDetails] = React.useState<QuotaDetails>();
  React.useEffect(() => {
    if (!quotaFormikValues.quota || !quotaFormikValues.quota.name) {
      return;
    }
    const details = quotasData.getQuotaDetails(
      quotaFormikValues.quota.name,
      quotaFormikValues.quota.namespace,
    );
    if (!details) {
      addAlert({
        title: t('Failed to find quota {{name}}', {
          name: `${quotaFormikValues.quota.name}/${quotaFormikValues.quota.namespace}`,
        }),
      });
    } else {
      setQuotaDetails(details);
    }
  }, [quotasData, quotaFormikValues]);

  if (!quotaDetails) {
    return null;
  }
  const part1 = getQuotaNameAndUsersText(quotaDetails, t);

  if (!quotaFormikValues.limitAllowed) {
    return <Text>{part1}</Text>;
  }
  const part2 = t('up to {{clusters}} clusters', { clusters: quotaFormikValues.numAllowed });
  return <Text>{`${part1} / ${part2}`}</Text>;
};

const ReviewQuotas = ({ quotas }: { quotas: QuotaFormikValues[] }) => {
  const { t } = useTranslation();
  const [quotasData, loaded, error] = useQuotas();
  useAddAlertOnError(error, t('Failed to load quotas'));
  return (
    <CellLoader loaded={loaded}>
      {quotas.map((quota, idx) => {
        return <QuotaSummary quotasData={quotasData} quotaFormikValues={quota} key={idx} />;
      })}
    </CellLoader>
  );
};

const ReviewStep = () => {
  const { values } = useFormikContext<WizardFormikValues>();
  const clusterTemplate = toClusterTemplate(values);
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
            <DescriptionListTerm>{t('Cluster template name')}</DescriptionListTerm>
            <DescriptionListDescription>{values.details.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Cost')}</DescriptionListTerm>
            <ClusterTemplateCost clusterTemplate={clusterTemplate} />
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Installation settings')}</DescriptionListTerm>
            <DescriptionListDescription>
              <InstallationDetails clusterTemplate={clusterTemplate}></InstallationDetails>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Post-installation settings')}</DescriptionListTerm>
            <DescriptionListDescription>
              <PostInstallationDetails clusterTemplate={clusterTemplate} />
            </DescriptionListDescription>
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
