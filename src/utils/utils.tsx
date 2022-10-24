/* Copyright Contributors to the Open Cluster Management project */
import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';
import isString from 'lodash/isString';

export const getNavLabelWithCount = (label: string, count?: number) => {
  if (count === undefined) {
    return label;
  }
  return `${label} (${count})`;
};

type LoadingHelperProps = {
  isLoaded: boolean;
  error?: unknown;
  children: React.ReactNode;
};

export const LoadingHelper = ({
  isLoaded,
  error,
  children,
}: LoadingHelperProps) => {
  if (!isLoaded) return <Skeleton />;
  if (error) return <>-</>;
  return <>{children}</>;
};

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (isString(error)) {
    return error;
  }
  return 'Unexpected error';
};

/* istanbul ignore next */
export const createDownloadFile = (
  filename: string,
  content: string,
  type?: string,
) => {
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
