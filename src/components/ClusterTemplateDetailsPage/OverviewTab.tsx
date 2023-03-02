import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import DetailsCard from './DetailsCard';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
import DownloadYamlCard from './DownloadYamlCard';
import DescriptionCard from './DescriptionCard';

const OverviewTab: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem isFilled>
        <Flex className="pf-u-h-100">
          <FlexItem flex={{ default: 'flex_1' }} className="pf-u-h-100">
            <Card className="pf-u-h-100">
              <CardHeader>
                <CardTitle>{t('Template description')}</CardTitle>
              </CardHeader>
              <CardBody>
                <DescriptionCard clusterTemplate={clusterTemplate} />
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }} className="pf-u-h-100">
            <Card className="pf-u-h-100">
              <CardHeader>
                <CardTitle>{t('How to use this template?')}</CardTitle>
              </CardHeader>
              <CardBody>
                <DownloadYamlCard clusterTemplate={clusterTemplate} />
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </StackItem>
      <StackItem isFilled>
        <Card className="pf-u-h-100">
          <CardHeader>
            <CardTitle>{t('Details')}</CardTitle>
          </CardHeader>
          <CardBody>
            <DetailsCard clusterTemplate={clusterTemplate} />
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
};

export default OverviewTab;
