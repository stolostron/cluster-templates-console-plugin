import { Alert, Button, Modal, ModalVariant, Tooltip } from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Credentials from './Credentials';

/** Delay in ms before the tooltip message switch to hover tip. */
const SWITCH_DELAY = 2000;

const CredentialsDialog = ({
  isOpen,
  onClose,
  ...props
}: {
  username: string;
  password: string;
  serverUrl: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const [copyFailed, setCopyFailed] = React.useState(false);
  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, SWITCH_DELAY);
      return () => clearTimeout(timeoutId);
    }
  }, [copied]);
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      title={t('Cluster credentials')}
      showClose
      onClose={onClose}
      actions={[
        <Button key="confirm" onClick={onClose} type="submit">
          {t('Close')}
        </Button>,
        <Tooltip
          content={copied ? t('Successfully copied to clipboard!') : t('Copy to clipboard')}
          key="copy"
        >
          <Button
            onClick={() => {
              navigator.clipboard
                .writeText(`oc login ${props.serverUrl} -u ${props.username} -p ${props.password}`)
                .then(() => {
                  setCopyFailed(false);
                  setCopied(true);
                })
                .catch(() => {
                  setCopied(false);
                  setCopyFailed(true);
                });
            }}
            variant="link"
            icon={<CopyIcon />}
            iconPosition="left"
          >
            {t('Copy login command')}
          </Button>
        </Tooltip>,
      ]}
    >
      <Credentials {...props} />
      {copyFailed && <Alert title={t('Failed to copy login command to clipboard.')} />}
    </Modal>
  );
};

export default CredentialsDialog;
