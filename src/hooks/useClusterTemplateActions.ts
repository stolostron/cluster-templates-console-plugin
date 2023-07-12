import { DropdownItemProps } from '@patternfly/react-core';
import { useAlerts } from '../alerts/AlertsContext';

import { DeserializedClusterTemplate } from '../types/resourceTypes';
import { isRedHatTemplate } from '../utils/clusterTemplateDataUtils';
import { downloadExampleYaml } from '../utils/instanceUtils';
import { getErrorMessage } from '../utils/utils';
import { useNavigation } from './useNavigation';
import { useTranslation } from './useTranslation';

const useClusterTemplateActions = (
  clusterTemplate: DeserializedClusterTemplate,
  onDelete: () => void,
): DropdownItemProps[] => {
  const navigation = useNavigation();
  const { addAlert } = useAlerts();
  const { t } = useTranslation();
  const actions: DropdownItemProps[] = [
    {
      title: t('Create a cluster'),
      onClick: () => navigation.goToInstanceCreatePage(clusterTemplate),
      isDisabled: !!clusterTemplate.status?.error,
      description: clusterTemplate.status?.error ? t('Template processing failed') : undefined,
    },
    {
      title: t('Download example instance YAML'),
      onClick: () => {
        try {
          downloadExampleYaml(clusterTemplate);
        } catch (err) {
          addAlert({ title: t('Failed to download exmplae YAML'), message: getErrorMessage(err) });
        }
      },
    },
    {
      title: t('Edit'),
      isDisabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Community templates cannot be modified')
        : undefined,
      onClick: () => navigation.goToClusterTemplateEditPage(clusterTemplate),
    },
    {
      title: t('Delete'),
      isDisabled: isRedHatTemplate(clusterTemplate),
      description: isRedHatTemplate(clusterTemplate)
        ? t('Community templates cannot be deleted')
        : undefined,
      onClick: onDelete,
    },
  ];

  return actions;
};

export default useClusterTemplateActions;
