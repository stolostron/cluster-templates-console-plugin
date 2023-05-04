import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import * as React from 'react';
import { DeserializedClusterTemplate } from '../../types/resourceTypes';
import DetailsCard from './DetailsCard';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
import DescriptionCard from './DescriptionCard';
import ClusterTemplateDetailsGettingStarted from '../ClusterTemplatesGettingStarted/ClusterTemplateDetailsGettingStarted';
import { useNavigation } from '../../hooks/useNavigation';
import { isRedHatTemplate } from '../../utils/clusterTemplateDataUtils';

const OverviewTab: React.FC<{
  clusterTemplate: DeserializedClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Stack hasGutter>
      <ClusterTemplateDetailsGettingStarted
        onCreateCluster={() => navigation.goToInstanceCreatePage(clusterTemplate)}
        isRedhatTemplate={isRedHatTemplate(clusterTemplate)}
      />
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
