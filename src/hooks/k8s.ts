import {
  K8sResourceCommon,
  // eslint-disable-next-line no-restricted-imports
  useK8sWatchResource as sdkUseK8sWatchResource,
  WatchK8sResource,
} from '@openshift-console/dynamic-plugin-sdk';

/*
 * NOTE: We're redefining useK8sWatchResource because from SDK it returns WatchK8sResult which returns [R, boolean, any].
 * We want [R, boolean, unknown].
 */

export type WatchK8sResult<R extends K8sResourceCommon | K8sResourceCommon[]> = [
  R,
  boolean,
  unknown,
];

export const useK8sWatchResource = <R extends K8sResourceCommon | K8sResourceCommon[]>(
  initResource: WatchK8sResource | null,
) => {
  return sdkUseK8sWatchResource<R>(initResource) as WatchK8sResult<R>;
};
