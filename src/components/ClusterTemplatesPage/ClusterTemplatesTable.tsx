import * as React from 'react';
import { ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Text, Button, Stack, StackItem } from '@patternfly/react-core';
import { ActionsColumn, Td, Th, Thead, Tr, Tbody } from '@patternfly/react-table';
import { clusterTemplateGVK } from '../../constants';
import { DeserializedClusterTemplate, RowProps, TableColumn } from '../../types/resourceTypes';
import { TFunction } from 'react-i18next';

import {
  ClusterTemplateQuotasSummary,
  ClusterTemplateStatus,
  ClusterTemplateUsage,
} from '../sharedDetailItems/clusterTemplateDetailItems';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigation } from '../../hooks/useNavigation';
import { WithHelpIcon } from '../../helpers/PopoverHelpIcon';
import DeleteDialog from '../sharedDialogs/DeleteDialog';
import useClusterTemplateActions from '../../hooks/useClusterTemplateActions';
import ActionsTd from '../../helpers/ActionsTd';
import { TableComposableEqualColumnSize } from '../../helpers/PatternflyOverrides';
import { QuickStartContext } from '@patternfly/quickstarts';
import { quickStartsData } from '../ClusterTemplatesGettingStarted/quickStartConstants';
import VendorLabel from '../sharedDetailItems/VendorLabel';

const QuotasColumnTitle = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const qsCtx = React.useContext(QuickStartContext);
  const helpText = (
    <Stack>
      <StackItem>
        <Text>
          {t('You can limit the use of templates with quotas by adding templates to them.')}
        </Text>
      </StackItem>
      <StackItem>
        <Button
          variant="link"
          onClick={() => navigation.goToClusterTemplatesPage('quotas')}
          style={{ paddingLeft: 'unset' }}
        >
          {t('Manage quotas')}
        </Button>
      </StackItem>
      <StackItem>
        <Button
          variant="link"
          onClick={() =>
            qsCtx?.setActiveQuickStart &&
            qsCtx.setActiveQuickStart(quickStartsData.createQuota.name)
          }
          style={{ paddingLeft: 'unset', paddingTop: 'unset' }}
        >
          {t('Learn more')}
        </Button>
      </StackItem>
    </Stack>
  );
  return <WithHelpIcon helpText={helpText}>{t('Quotas')}</WithHelpIcon>;
};

function getTableColumns(t: TFunction): TableColumn[] {
  return [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Clusters'),
      id: 'clusters',
    },
    {
      title: <QuotasColumnTitle />,
      id: 'quotas',
    },
    {
      title: t('Vendor'),
      id: 'vendor',
    },
    {
      title: t('Status'),
      id: 'status',
    },
    {
      title: t('Created'),
      id: 'created',
    },
    {
      title: '',
      id: 'kebab-menu',
    },
  ];
}

export const ClusterTemplateRow: React.FC<RowProps<DeserializedClusterTemplate>> = ({ obj }) => {
  const { t } = useTranslation();
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const actions = useClusterTemplateActions(obj, () => setDeleteOpen(true));

  const columns = React.useMemo(() => getTableColumns(t), [t]);

  return (
    <Tr>
      <Td dataLabel={columns[0].id} modifier="wrap">
        <ResourceLink
          groupVersionKind={clusterTemplateGVK}
          name={obj.metadata?.name}
          namespace={obj.metadata?.namespace}
          hideIcon
        />
      </Td>
      <Td dataLabel={columns[1].id}>
        <ClusterTemplateUsage clusterTemplate={obj} />
      </Td>
      <Td dataLabel={columns[2].id}>
        <ClusterTemplateQuotasSummary clusterTemplate={obj} />
      </Td>
      <Td dataLabel={columns[3].id}>
        <VendorLabel resource={obj} />
      </Td>
      <Td dataLabel={columns[4].id}>
        <ClusterTemplateStatus clusterTemplate={obj} />
      </Td>
      <Td dataLabel={columns[5].id}>
        <Timestamp timestamp={obj.metadata?.creationTimestamp || ''} />
      </Td>
      <ActionsTd>
        <ActionsColumn items={actions} />
      </ActionsTd>
      {isDeleteOpen && (
        <DeleteDialog
          isOpen={isDeleteOpen}
          onDelete={() => setDeleteOpen(false)}
          onCancel={() => setDeleteOpen(false)}
          gvk={clusterTemplateGVK}
          resource={obj}
        />
      )}
    </Tr>
  );
};

const ClusterTemplatesTable = ({
  clusterTemplates,
}: {
  clusterTemplates: DeserializedClusterTemplate[];
}) => {
  const { t } = useTranslation();
  return (
    <TableComposableEqualColumnSize
      aria-label="Cluster templates table"
      data-testid="cluster-templates-table"
      variant="compact"
    >
      <Thead noWrap>
        <Tr>
          {getTableColumns(t).map((column) => (
            <Th key={column.id}>{column.title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {clusterTemplates.map((template) => (
          <ClusterTemplateRow key={template.metadata?.name} obj={template} />
        ))}
      </Tbody>
    </TableComposableEqualColumnSize>
  );
};

export default ClusterTemplatesTable;
