import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { WizardFormikValues } from '../../types/wizardFormTypes';

const ConfirmCancelModal = ({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<WizardFormikValues>();
  const title = values.isCreateFlow
    ? t('Leave cluster template creation')
    : t('Leave cluster template edit');
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      title={title}
      titleIconVariant="warning"
      showClose
      onClose={onCancel}
      actions={[
        <Button key="confirm" variant="primary" onClick={onConfirm}>
          {t('Leave')}
        </Button>,
        <Button key="cancel" variant="link" onClick={onCancel}>
          {t('Cancel')}
        </Button>,
      ]}
    >
      {t('All data entered will be lost')}
    </Modal>
  );
};

export default ConfirmCancelModal;
