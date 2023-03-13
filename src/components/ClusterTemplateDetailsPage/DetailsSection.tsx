import * as React from 'react';
import {
  Button,
  ButtonVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import {
  ClusterTemplateVendorLabel,
  InstallationDetails,
  PostInstallationDetails,
} from '../sharedDetailItems/clusterTemplateDetailItems';

import { useTranslation } from '../../hooks/useTranslation';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { PencilAltIcon } from '@patternfly/react-icons';
import EditLabelsDialog from '../Labels/EditLabelsDialog';
import { clusterTemplateGVK } from '../../constants';
import { Labels } from '../Labels/Labels';
import { ClusterTemplate } from '../../types/resourceTypes';
export type ListItem = {
  label: string;

  action?: React.ReactNode;
  value?: string | number | React.ReactNode | undefined;
};

const List: React.FC<{ items: ListItem[] }> = ({ items }) => {
  return (
    <DescriptionList isHorizontal>
      {items.map(({ label, action, value }) => (
        <DescriptionListGroup label={label} key={label}>
          <DescriptionListTerm data-testid={`${label} label`}>
            <Flex>
              <FlexItem>{label}</FlexItem>
              {action && <FlexItem>{action}</FlexItem>}
            </Flex>
          </DescriptionListTerm>
          <DescriptionListDescription data-testid={`${label} value`}>
            {value ?? '-'}
          </DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  );
};

const DetailsSections: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  const name = clusterTemplate.metadata?.name;
  const [showEditLabels, setShowEditLabels] = React.useState<boolean>(false);
  const leftItems: ListItem[] = [
    {
      label: t('Template name'),
      value: name,
    },
    {
      label: t('Created'),
      value: <Timestamp timestamp={clusterTemplate.metadata?.creationTimestamp || ''} />,
    },
    {
      label: t('Labels'),
      value: <Labels labels={clusterTemplate.metadata?.labels} />,
      action: (
        <Button
          onClick={() => setShowEditLabels(true)}
          variant={ButtonVariant.link}
          aria-label={t('Edit labels')}
          icon={<PencilAltIcon />}
        />
      ),
    },
  ];

  const rightItems: ListItem[] = [
    {
      label: t('Installation settings'),
      value: <InstallationDetails clusterTemplate={clusterTemplate} />,
    },
    {
      label: t('Post installation'),
      value: <PostInstallationDetails clusterSetup={clusterTemplate.spec.clusterSetup} />,
    },
    {
      label: t('Vendor'),
      value: <ClusterTemplateVendorLabel clusterTemplate={clusterTemplate} />,
    },
  ];

  return (
    <>
      <Grid sm={12} md={6}>
        <GridItem>
          <List items={leftItems} />
        </GridItem>
        <GridItem>
          <List items={rightItems} />
        </GridItem>
      </Grid>
      {showEditLabels && (
        <EditLabelsDialog
          resource={clusterTemplate}
          close={() => setShowEditLabels(false)}
          gvk={clusterTemplateGVK}
        />
      )}
    </>
  );
};

export default DetailsSections;
