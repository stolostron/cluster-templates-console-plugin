import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import * as React from 'react';
import { ClusterTemplate } from '../../types/resourceTypes';
import DetailsCard from './DetailsCard';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
import DescriptionCard from './DescriptionCard';

const OverviewTab: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem isFilled style={{ height: '300px' }}>
        <Card className="pf-u-h-100 ">
          <CardHeader>
            <CardTitle>{t('Getting started')}</CardTitle>
          </CardHeader>
        </Card>
      </StackItem>
      <StackItem isFilled>
        <Flex className="pf-u-h-100" grow={{ default: 'grow' }}>
          <FlexItem className="pf-u-h-100" flex={{ default: 'flex_1' }}>
            <Card className="pf-u-h-100">
              <CardHeader>
                <CardTitle>{t('Details')}</CardTitle>
              </CardHeader>
              <CardBody>
                <DetailsCard clusterTemplate={clusterTemplate} />
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem className="pf-u-h-100" flex={{ default: 'flex_1' }}>
            <Card className="pf-u-h-100">
              <CardHeader>
                <CardTitle>{t('Template description')}</CardTitle>
              </CardHeader>
              <CardBody>
                <DescriptionCard clusterTemplate={clusterTemplate} />
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );
};

export default OverviewTab;
