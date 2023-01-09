import React from 'react';
import { ModalBoxBody, Skeleton } from '@patternfly/react-core';
import Loader, { LoaderProps } from './Loader';

type ModalDialogLoaderProps = Omit<LoaderProps, 'loadingState'>;

function ModalDialogLoader(props: ModalDialogLoaderProps) {
  const loadingState = (
    <ModalBoxBody>
      <Skeleton fontSize="2xl" />
      <br />
      <Skeleton fontSize="2xl" />
      <br />
      <Skeleton fontSize="2xl" />
      <br />
      <Skeleton fontSize="2xl" />
      <br />
      <Skeleton fontSize="2xl" />
      <br />
    </ModalBoxBody>
  );
  return <Loader {...props} loadingState={loadingState} />;
}

export default ModalDialogLoader;
