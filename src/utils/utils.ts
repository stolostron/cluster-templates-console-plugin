import isString from 'lodash/isString';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { getResourceUrl } from './k8s';
import { clusterTemplateGVK } from '../constants';

export const getNavLabelWithCount = (label: string, count?: number) => {
  if (count === undefined) {
    return label;
  }
  return `${label} (${count})`;
};

/* istanbul ignore next */
export const createDownloadFile = (filename: string, content: string, type?: string) => {
  const a = document.createElement('a');
  const blob = new Blob([content], { type: type || 'text/plain' });
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.dispatchEvent(event);
  window.URL.revokeObjectURL(url);
};

export const sortByResourceName = <T extends K8sResourceCommon>(crs: T[]) =>
  crs.sort((cr1, cr2) => (cr1.metadata?.name || '').localeCompare(cr2.metadata?.name || ''));

export const getSortedResourceNames = (crs: K8sResourceCommon[]) =>
  (crs.map((cr) => cr.metadata?.name).filter(Boolean) as string[]).sort((name1, name2) =>
    name1.localeCompare(name2),
  );

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return 'Unexpected error';
};

export const getEditClusterTemplateUrl = (name: string) =>
  `${getResourceUrl(clusterTemplateGVK, name)}/edit`;
