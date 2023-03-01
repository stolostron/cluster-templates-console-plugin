import {
  k8sDelete,
  K8sGroupVersionKind,
  K8sResourceCommon,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant, Button, Modal, ModalVariant } from '@patternfly/react-core';
import React from 'react';
import { Trans } from 'react-i18next';
import { SkeletonLoader } from '../../helpers/SkeletonLoader';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';

type DeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  gvk: K8sGroupVersionKind;
  resource: K8sResourceCommon;
};

const DeleteDialog = ({ isOpen, onClose, gvk, resource }: DeleteDialogProps) => {
  const { t } = useTranslation();
  const [model, loading] = useK8sModel(gvk);
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  const submit = async () => {
    try {
      setDeleting(true);
      await k8sDelete({
        model,
        resource,
      });
      setDeleting(false);
      onClose();
    } catch (err) {
      setError(err);
    }
  };
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      title={t('Delete {{kind}}?', { kind: gvk.kind })}
      titleIconVariant="warning"
      showClose
      onClose={onClose}
      actions={[
        <Button
          isDisabled={loading || deleting}
          isLoading={deleting}
          key="confirm"
          variant="danger"
          onClick={() => void submit()}
          type="submit"
        >
          {t('Delete')}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          {t('Cancel')}
        </Button>,
      ]}
    >
      <SkeletonLoader loaded={!loading} numRows={1}>
        <Trans ns="plugin__clustertemplates-plugin">
          Are you sure you want to delete&nbsp;<b>{resource.metadata?.name}</b>&nbsp;
          {resource.metadata?.namespace ? (
            <>
              in namespace <b>{resource.metadata?.namespace}</b>?
            </>
          ) : (
            '?'
          )}
        </Trans>
      </SkeletonLoader>
      {error && (
        <Alert variant={AlertVariant.danger} title={t('Failed to update labels')} isInline>
          {getErrorMessage(error)}
        </Alert>
      )}
    </Modal>
  );
};

export default DeleteDialog;
