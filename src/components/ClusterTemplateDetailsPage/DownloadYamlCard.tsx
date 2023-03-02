import {
  Button,
  Stack,
  StackItem,
  TextContent,
  TextInput,
  TextList,
  TextListItem,
  TextListVariants,
} from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { downloadInstanceYaml } from '../../utils/instanceYaml';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplate } from '../../types/resourceTypes';

const TextAndCommand = ({ text, command }: { text: string; command: string }) => (
  <>
    <span style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>{text}</span>
    <TextInput
      value={command}
      style={{ display: 'inline', width: 'fit-content', background: 'transparent' }}
      isReadOnly
    />
  </>
);

const DownloadYamlCard: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return (
    <TextContent>
      <TextList
        component={TextListVariants.ol}
        style={{
          paddingLeft: 0,
          listStyle: 'decimal inside',
          marginLeft: 'unset',
        }}
      >
        <TextListItem>
          <Stack style={{ display: 'inline' }}>
            <StackItem style={{ display: 'inline' }}>{t('Download the YAML file')}</StackItem>
            <StackItem>
              <Button
                variant="secondary"
                onClick={() => {
                  try {
                    downloadInstanceYaml(clusterTemplate);
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
          </Stack>
        </TextListItem>
        <TextListItem>{t('Fill in the name and the namespace in the YAML file')}</TextListItem>
        <TextListItem>{t('Add to the file the default values (optional)')}</TextListItem>
        <TextListItem>
          <TextAndCommand text={t('Login to cluster in the CLI')} command={'oc login'} />
        </TextListItem>
        <TextListItem>
          <TextAndCommand text={t('Apply the file')} command={'oc apply -f <the file>'} />
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export default DownloadYamlCard;
