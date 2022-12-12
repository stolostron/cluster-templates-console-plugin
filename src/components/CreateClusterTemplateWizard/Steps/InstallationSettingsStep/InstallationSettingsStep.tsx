import { Form, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';

import HelmFields from '../../../fields/HelmFields';
import NamespaceField from '../../../fields/NamespaceField';

export const DestinationNamespaceField = ({ fieldNamePrefix }: { fieldNamePrefix: string }) => {
  const { t } = useTranslation();
  return (
    <NamespaceField
      name={`${fieldNamePrefix}.destinationNamespace`}
      label={t('Destination namespace')}
      popoverHelpText={t(
        "Specify the target namespace for the application's resources. The namespace will only be set for namespace-scoped resources that have not set a value for .metadata.namespace",
      )}
      isRequired
    />
  );
};

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
          <HelmFields fieldNamePrefix="installation" />
          <DestinationNamespaceField fieldNamePrefix="installation" />
        </Form>
      </StackItem>
    </Stack>
  );
};

export default InstallationSettingsStep;
