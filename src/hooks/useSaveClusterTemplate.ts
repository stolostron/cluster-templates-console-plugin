import { k8sCreate, k8sPatch, Patch, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { WizardFormikValues } from '../components/ClusterTemplateWizard/types';
import { clusterTemplateGVK } from '../constants';

import { useCreateNamespace } from './useCreateNamespace';
import useUpdateQuotas from './useUpdateQuotas';
import toClusterTemplate, { toClusterTemplateSpec } from '../utils/toClusterTemplate';
import { ClusterTemplate } from '../types';

export const useSaveClusterTemplate = (
  initialValues: WizardFormikValues,
  originalClusterTemplate?: ClusterTemplate,
): [(values: WizardFormikValues) => Promise<boolean>, boolean] => {
  const [updateQuotas, loadingUpdateQuotas] = useUpdateQuotas(initialValues);
  const [createNamespace, loadingCreateNamespace] = useCreateNamespace();
  const [clusterTemplateModel, clusterTemplateModelLoading] = useK8sModel(clusterTemplateGVK);

  const saveClusterTemplate = async (values: WizardFormikValues) => {
    const promises = [];
    if (originalClusterTemplate) {
      const patchData: Patch = {
        value: toClusterTemplateSpec(values),
        op: 'replace',
        path: '/spec',
      };
      promises.push(
        k8sPatch({
          model: clusterTemplateModel,
          resource: originalClusterTemplate,
          data: [patchData],
        }),
      );
    } else {
      promises.push(k8sCreate({ model: clusterTemplateModel, data: toClusterTemplate(values) }));
    }
    if (values.installation.spec.destinationNamespace) {
      promises.push(createNamespace(values.installation.spec.destinationNamespace));
    }
    promises.push(updateQuotas(values));
    await Promise.all(promises);
    return true;
  };
  return [
    saveClusterTemplate,
    !clusterTemplateModelLoading && !loadingUpdateQuotas && !loadingCreateNamespace,
  ];
};
