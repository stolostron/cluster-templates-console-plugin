import { DropdownItemProps } from '@patternfly/react-core';

import { DeserializedClusterTemplate } from '../types/resourceTypes';
import { isRedHatTemplate } from '../utils/clusterTemplateDataUtils';
import { useNavigation } from './useNavigation';
import { useTranslation } from './useTranslation';

const useClusterTemplateActions = (
  clusterTemplate: DeserializedClusterTemplate,
  onDelete: () => void,
): DropdownItemProps[] => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const actions: DropdownItemProps[] = [
    {
      title: t('Create a cluster'),
      onClick: () => navigation.goToInstanceCreatePage(clusterTemplate),
      isDisabled: !!clusterTemplate.status?.error,
      description: clusterTemplate.status?.error ? t('Template processing failed') : undefined,
    },
    {
      title: t('Edit'),
      isDisabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Red Hat templates cannot be modified')
        : undefined,
      onClick: () => navigation.goToClusterTemplateEditPage(clusterTemplate),
    },
    {
      title: t('Delete'),
      isDisabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Red Hat templates cannot be deleted')
        : undefined,
      onClick: onDelete,
    },
  ];

  return actions;
};

export default useClusterTemplateActions;
