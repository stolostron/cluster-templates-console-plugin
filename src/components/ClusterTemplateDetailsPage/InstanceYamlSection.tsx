import { Button, Stack, StackItem, Text, TextVariants } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import * as React from 'react';
import generateInstanceYaml from '../../utils/instanceYaml';
import { createDownloadFile } from '../../utils/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplate } from '../../types';

const InstanceYamlSection: React.FC<{ clusterTemplate: ClusterTemplate }> = ({
  clusterTemplate,
}) => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem>
        <Text component={TextVariants.p}>{`1. ${t('Download the YAML file')}`}</Text>
      </StackItem>
      <StackItem>
        <Button
          variant="secondary"
          onClick={() => {
            try {
              createDownloadFile(
                `${clusterTemplate.metadata?.name || ''}_instance.yaml`,
                generateInstanceYaml(clusterTemplate),
              );
            } catch (err) {
              //TODO: decide how to handle errors in details page
              console.error(err);
            }
          }}
          icon={<DownloadIcon />}
        >
          {t('Download')}
        </Button>
      </StackItem>
      <StackItem>
        <Text component={TextVariants.p}>
          {`2. ${t('(optional) Provide values if contains parameters without default values')}`}
          <br />
          {`3. ${t('oc login to this cluster')}`}
          <br />
          {`4. ${t('oc apply the downloaded and edited file')}`}
        </Text>
      </StackItem>
    </Stack>
  );
};

export default InstanceYamlSection;
