import { DropdownItemProps } from '@patternfly/react-core';

import { ClusterTemplate } from '../types/resourceTypes';
import { isRedHatTemplate } from '../utils/clusterTemplateDataUtils';
import { useNavigation } from './useNavigation';
import { useTranslation } from './useTranslation';

const useClusterTemplateActions = (
  clusterTemplate: ClusterTemplate,
  onDelete: () => void,
): DropdownItemProps[] => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const actions: DropdownItemProps[] = [
    {
      title: t('Create a cluster'),
      onClick: () => navigation.goToInstanceCreatePage(clusterTemplate),
    },
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

  return actions;
};

export default useClusterTemplateActions;
