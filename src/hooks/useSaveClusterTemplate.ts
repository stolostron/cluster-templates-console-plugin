import { k8sCreate, k8sUpdate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { WizardFormikValues } from '../types/wizardFormTypes';
import { clusterTemplateGVK } from '../constants';

import { useCreateNamespace } from './useCreateNamespace';
import toClusterTemplate from '../utils/toClusterTemplate';
import { ClusterTemplate } from '../types/resourceTypes';

export const useSaveClusterTemplate = (
  originalClusterTemplate?: ClusterTemplate,
): [(values: WizardFormikValues) => Promise<boolean>, boolean] => {
  const [createNamespace, loadingCreateNamespace] = useCreateNamespace();
  const [clusterTemplateModel, clusterTemplateModelLoading] = useK8sModel(clusterTemplateGVK);

  const saveClusterTemplate = async (values: WizardFormikValues) => {
    const promises = [];
    if (originalClusterTemplate) {
      promises.push(
        k8sUpdate({
          model: clusterTemplateModel,
          data: toClusterTemplate(values, originalClusterTemplate),
        }),
      );
    } else {
      promises.push(k8sCreate({ model: clusterTemplateModel, data: toClusterTemplate(values) }));
    }
    if (values.installation.destinationNamespace) {
      promises.push(createNamespace(values.installation.destinationNamespace));
    }
    await Promise.all(promises);
    return true;
  };
  return [saveClusterTemplate, !clusterTemplateModelLoading && !loadingCreateNamespace];
};
