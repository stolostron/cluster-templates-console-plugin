import * as React from 'react';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Popover,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import {
  ClusterTemplateCost,
  ClusterTemplateVendorLabel,
  InstallationDetails,
  PostInstallationDetails,
} from '../sharedDetailItems/clusterTemplateDetailItems';
import { ClusterTemplate } from '../../types';

import { useTranslation } from '../../hooks/useTranslation';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
export type ListItem = {
  label: string;

  action?: React.ReactNode;
  value?: string | number | React.ReactNode | undefined;
};

const CostItem: React.FC<{ clusterTemplate: ClusterTemplate }> = ({ clusterTemplate }) => {
  const { t } = useTranslation();
  return (
    <>
      <ClusterTemplateCost clusterTemplate={clusterTemplate} />
      <Popover
        bodyContent={t(
          'Cost is estimated according to the maximum number of nodes specified for this template',
        )}
      >
        <Button variant="link" style={{ paddingLeft: 'var(--pf-global--spacer--sm)' }}>
          <OutlinedQuestionCircleIcon />
        </Button>
      </Popover>
    </>
  );
};
const List: React.FC<{ items: ListItem[] }> = ({ items }) => {
  return (
    <DescriptionList isHorizontal>
      {items.map(({ label, action, value }) => (
        <DescriptionListGroup label={label} key={label}>
          <DescriptionListTerm data-testid={`${label} label`}>
            {label} {action}
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
  // const [showEditLabels, setShowEditLabels] = React.useState<boolean>(false);
  const leftItems: ListItem[] = [
    {
      label: t('Template name'),
      value: name,
    },
    {
      label: t('Installation Settings'),
      value: <InstallationDetails clusterTemplate={clusterTemplate} />,
    },
    {
      label: t('Argocd namespace'),
      value: clusterTemplate.spec.clusterDefinition.source.chart,
    },
    {
      label: t('Created'),
      value: <Timestamp timestamp={clusterTemplate.metadata?.creationTimestamp} />,
    },
    //TODO: implement labels
    // {
    //   label: t('table.labels'),
    //   value: 'todo',
    //   // action: (
    //   //   <Button
    //   //     onClick={() => setShowEditLabels(true)}
    //   //     variant={ButtonVariant.link}
    //   //     aria-label={t('labels.edit.title')}
    //   //     icon={<PencilAltIcon />}
    //   //   ></Button>
    //   // ),
    // },
  ];

  const rightItems: ListItem[] = [
    {
      label: t('Post-installation settings'),
      value: <PostInstallationDetails clusterTemplate={clusterTemplate} />,
    },
    {
      label: t('Cost estimation'),
      value: <CostItem clusterTemplate={clusterTemplate} />,
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
      {/* <EditLabels
        resource={
          showEditLabels
            ? {
                ...clusterTemplateDefinition,
                metadata: {
                  name: name,
                  labels: clusterTemplate.metadata?.labels,
                },
              }
            : undefined
        }
        displayName={name}
        close={() => setShowEditLabels(false)}
      /> */}
    </>
  );
};

export default DetailsSections;
