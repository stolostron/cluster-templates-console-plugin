//duplicate this type from sdk to enable creating a story of a component using this type without bundlign the SDK

export type K8sGroupVersionKind = {
  group?: string;
  version: string;
  kind: string;
};

export const getApiVersion = (gvk: K8sGroupVersionKind) =>
  gvk.group ? `${gvk.group}/${gvk.version}` : gvk.version;

export const getResourceUrl = (
  groupVersionKind: K8sGroupVersionKind,
  name?: string,
  namespace?: string,
  labels?: {
    [key: string]: string;
  },
) => {
  let url = '/k8s/';

  if (namespace) {
    url += `ns/${namespace}/`;
  } else {
    url += 'cluster/';
  }

  url += [groupVersionKind.group || 'core', groupVersionKind.version, groupVersionKind.kind].join(
    '~',
  );

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }
  if (labels) {
    const labelsStr = Object.entries(labels)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    const searchParams = new URLSearchParams();
    searchParams.set('labels', labelsStr);
    url += `?${searchParams.toString()}`;
  }

  return url;
};
