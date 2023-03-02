import { DropdownItemProps } from '@patternfly/react-core';

import { ClusterTemplate } from '../types/resourceTypes';
import { isRedHatTemplate } from '../utils/clusterTemplateDataUtils';
import downloadInstanceYaml from '../utils/instanceYaml';
import { useNavigation } from './useNavigation';
import { useTranslation } from './useTranslation';

const useClusterTemplateActions = (
  clusterTemplate: ClusterTemplate,
  onDelete: () => void,
  includeDonwnloadInstance: boolean,
): DropdownItemProps[] => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const actions: DropdownItemProps[] = [
    {
      title: t('Edit'),
      disabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Red Hat templates cannot be modified')
        : undefined,
      onClick: () => navigation.goToClusterTemplateEditPage(clusterTemplate),
    },
    {
      title: t('Delete'),
      disabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Red Hat templates cannot be deleted')
        : undefined,
      onClick: onDelete,
    },
  ];
  if (includeDonwnloadInstance) {
    actions.push({
      title: t('Download instance YAML'),
      onClick: () => downloadInstanceYaml(clusterTemplate),
    });
  }
  return actions;
};

export default useClusterTemplateActions;
