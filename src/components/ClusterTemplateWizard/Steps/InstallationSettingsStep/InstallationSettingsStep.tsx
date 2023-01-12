import { Form, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import React from 'react';
import { useAddAlertOnError } from '../../../../alerts/useAddAlertOnError';
import { SkeletonLoader } from '../../../../helpers/SkeletonLoader';
import { useHelmChartRepositories } from '../../../../hooks/useHelmChartRepositories';
import { useTranslation } from '../../../../hooks/useTranslation';
import HelmFields from '../../../sharedFields/HelmFields';
import DestinationNamespaceField from './DestinationNamespaceField';

const InstallationSettingsStep = () => {
  const { t } = useTranslation();
  const reposListResult = useHelmChartRepositories();
  // t('Failed to load Helm chart repositories')
  const [, loaded, error] = reposListResult;
  useAddAlertOnError(error, 'Failed to load Helm chart repositories');
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">{t('Installation Settings')}</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <SkeletonLoader loaded={loaded} numRows={6}>
          <Form>
            <HelmFields
              reposListResult={reposListResult}
              fieldNamePrefix={'installation.spec'}
              horizontal={false}
            />
            <DestinationNamespaceField />
          </Form>
        </SkeletonLoader>
      </StackItem>
    </Stack>
  );
};

export default InstallationSettingsStep;
