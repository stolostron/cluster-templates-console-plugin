import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX, managedClusterGVK } from '../constants';
import { ClusterTemplateInstance } from '../types/resourceTypes';
import { useK8sWatchResource } from './k8s';

export const useManagedCluster = (
  clusterTemplateInstance: ClusterTemplateInstance,
): [K8sResourceCommon, boolean, unknown] =>
  useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: managedClusterGVK,
    selector: {
      matchLabels: {
        [`${CLUSTER_TEMPLATE_INSTANCE_LABEL_PREFIX}/name`]:
          clusterTemplateInstance.metadata?.name || '',
      },
    },
  });
