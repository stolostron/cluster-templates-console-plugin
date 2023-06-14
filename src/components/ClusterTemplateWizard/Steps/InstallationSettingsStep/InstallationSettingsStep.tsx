import { Form, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import React from 'react';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { useTranslation } from '../../../../hooks/useTranslation';
import HelmFields from '../../../sharedFields/HelmFields';
import DestinationNamespaceField from './DestinationNamespaceField';

const InstallationSettingsStep = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component="h2">{t('Installation Settings')}</Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <Form>
            <HelmFields fieldName={'installation.source'} day2={false} />
            <DestinationNamespaceField />
          </Form>
        </StackItem>
      </Stack>
    </ErrorBoundary>
  );
};

export default InstallationSettingsStep;
