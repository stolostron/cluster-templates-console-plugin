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
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import { WizardFormikValues } from '../../../../types/wizardFormTypes';

import { PostInstallationDetails } from '../../../sharedDetailItems/clusterTemplateDetailItems';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import ArgoCDSpecDetails from '../../../sharedDetailItems/ArgoCDSpecDetails';
import { getClusterDefinition, getClusterSetup } from '../../../../utils/toClusterTemplate';

const ReviewStep = () => {
  const { values } = useFormikContext<WizardFormikValues>();
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
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
              <DescriptionListTerm>{t('Installation settings')}</DescriptionListTerm>
              <DescriptionListDescription>
                <ArgoCDSpecDetails argocdSpec={getClusterDefinition(values)} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Post installation')}</DescriptionListTerm>
              <DescriptionListDescription>
                <PostInstallationDetails clusterSetup={getClusterSetup(values)} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </StackItem>
      </Stack>
    </ErrorBoundary>
  );
};

export default ReviewStep;
