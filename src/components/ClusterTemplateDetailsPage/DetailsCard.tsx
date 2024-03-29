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
} from '@patternfly/react-core';

import {
  ClusterTemplateStatus,
  InstallationDetails,
  PostInstallationDetails,
} from '../sharedDetailItems/clusterTemplateDetailItems';

import { useTranslation } from '../../hooks/useTranslation';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { PencilAltIcon } from '@patternfly/react-icons';
import EditLabelsDialog from '../Labels/EditLabelsDialog';
import { clusterTemplateGVK } from '../../constants';
import { Labels } from '../Labels/Labels';
import { DeserializedClusterTemplate } from '../../types/resourceTypes';
import VendorLabel from '../sharedDetailItems/VendorLabel';
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

const DetailsCard: React.FC<{ clusterTemplate: DeserializedClusterTemplate }> = ({
  clusterTemplate,
}) => {
  const { t } = useTranslation();
  const name = clusterTemplate.metadata?.name;
  const [showEditLabels, setShowEditLabels] = React.useState<boolean>(false);
  const items: ListItem[] = [
    {
      label: t('Template name'),
      value: name,
    },
    {
      label: t('Created'),
      value: <Timestamp timestamp={clusterTemplate.metadata?.creationTimestamp || ''} />,
    },
    {
      label: t('Status'),
      value: <ClusterTemplateStatus clusterTemplate={clusterTemplate} />,
    },
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
      value: <VendorLabel resource={clusterTemplate} />,
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

  return (
    <>
      <List items={items} />
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

export default DetailsCard;
