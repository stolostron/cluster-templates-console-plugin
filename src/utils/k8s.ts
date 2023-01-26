import {
  K8sGroupVersionKind,
  K8sResourceKindReference,
} from '@openshift-console/dynamic-plugin-sdk';

/**
 * @deprecated - This will become obsolete when we move away from K8sResourceKindReference to K8sGroupVersionKind
 * Provides a reference string that uniquely identifies the group, version, and kind of a k8s resource.
 * @param K8sGroupVersionKind Pass K8sGroupVersionKind which will have group, version, and kind of a k8s resource.
 * @param K8sGroupVersionKind.group Pass group of k8s resource or model.
 * @param K8sGroupVersionKind.version Pass version of k8s resource or model.
 * @param K8sGroupVersionKind.kind Pass kind of k8s resource or model.
 * @returns The reference for any k8s resource i.e `group~version~kind`.
 * If the group will not be present then "core" will be returned as part of the group in reference.
 */
export const getReference = ({
  group,
  version,
  kind,
}: K8sGroupVersionKind): K8sResourceKindReference => [group || 'core', version, kind].join('~');

export const getApiVersion = (gvk: K8sGroupVersionKind) =>
  gvk.group ? `${gvk.group}/${gvk.version}` : gvk.version;

export const getResourceUrl = (
  groupVersionKind: K8sGroupVersionKind,
  name?: string,
  namespace?: string,
) => {
  let url = '/k8s/';

  if (namespace) {
    url += `ns/${namespace}/`;
  } else {
    url += 'cluster/';
  }

  url += getReference(groupVersionKind);

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};
