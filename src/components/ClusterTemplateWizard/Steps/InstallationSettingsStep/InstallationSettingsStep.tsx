import { Form, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';
import HelmFields from '../../../sharedFields/HelmFields';
import DestinationNamespaceField from './DestinationNamespaceField';

const InstallationSettingsStep = () => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">{t('Installation Settings')}</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Form>
          <HelmFields fieldNamePrefix={'installation.spec'} horizontal={false} />
          <DestinationNamespaceField />
        </Form>
      </StackItem>
    </Stack>
  );
};

export default InstallationSettingsStep;
