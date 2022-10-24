/* Copyright Contributors to the Open Cluster Management project */
import { Stack, StackItem } from '@patternfly/react-core';
import { TFunction } from 'i18next';
import * as React from 'react';
import { ClusterTemplate } from '../../types';
import DetailsSection from './DetailsSection';
import InstanceYamlSection from './InstanceYamlSection';
import QuotasSection from './QuotaSection';
import UsageSection from './UsageSection';
import {
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
} from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';

enum Section {
  Details = 'details',
  Quotas = 'quotas',
  Uses = 'uses',
  InstanceYaml = 'instanceYaml',
}

const getSectionTitles = (t: TFunction): { [i in Section]: string } => ({
  [Section.InstanceYaml]: t(
    'Download template instance YAML file to instantiate the template',
  ),
  [Section.Details]: t('Details'),
  [Section.Quotas]: t('Quotas'),
  [Section.Uses]: t('Template uses'),
});

const getSectionComponents = (): {
  [i in Section]: React.FC<{ clusterTemplate: ClusterTemplate }>;
} => ({
  [Section.InstanceYaml]: InstanceYamlSection,
  [Section.Details]: DetailsSection,
  [Section.Quotas]: QuotasSection,
  [Section.Uses]: UsageSection,
});

export function ExpandableCard(props: {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onExpand = (event: React.MouseEvent, id: string) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card id={props.id} className={props.className} isExpanded={isExpanded}>
      <CardHeader
        toggleButtonProps={{
          id: 'toggle-button',
          'aria-label': 'Toggle details',
          'aria-expanded': open,
        }}
        onExpand={onExpand}
      >
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody>{props.children}</CardBody>
      </CardExpandableContent>
    </Card>
  );
}

const ClusterTemplateDetailsSections: React.FC<{
  clusterTemplate: ClusterTemplate;
}> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const titles = getSectionTitles(t);
  const components = getSectionComponents();
  return (
    <Stack hasGutter>
      {Object.keys(titles).map((key) => {
        const section: Section = key as Section;
        const Component = components[section];
        return (
          <StackItem key={key}>
            <ExpandableCard title={titles[section]} id={key}>
              <Component clusterTemplate={clusterTemplate} />
            </ExpandableCard>
          </StackItem>
        );
      })}
    </Stack>
  );
};

export default ClusterTemplateDetailsSections;
