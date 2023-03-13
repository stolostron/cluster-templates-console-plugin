import {
  K8sGroupVersionKind,
  K8sResourceCommon,
  k8sUpdate,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant, Form, Modal } from '@patternfly/react-core';
import { ActionGroup, Button, ModalVariant } from '@patternfly/react-core';
import React from 'react';
import { SkeletonLoader } from '../../helpers/SkeletonLoader';

import { useTranslation } from '../../hooks/useTranslation';
import { MetadataLabels } from '../../types/resourceTypes';
import { getErrorMessage } from '../../utils/utils';
import { LabelsInput } from './LabelsInput';

const EditLabelsDialog = ({
  resource,
  close,
  gvk,
}: {
  resource: K8sResourceCommon;
  close: () => void;
  gvk: K8sGroupVersionKind;
}) => {
  const [model, loading] = useK8sModel(gvk);
  const { t } = useTranslation();
  const [labels, setLabels] = React.useState<MetadataLabels>({});
  const [error, setError] = React.useState<unknown>();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setError(undefined);
    try {
      setSubmitting(true);
      const newResource = {
        ...resource,
        metadata: { ...resource.metadata, labels: labels },
      };
      await k8sUpdate({ model, data: newResource });
      close();
    } catch (e) {
      setError(e);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    setLabels(resource?.metadata?.labels || {});
  }, [resource?.metadata?.labels]);

  return (
    <Modal title={t('Edit labels')} variant={ModalVariant.medium} onClose={close} isOpen={true}>
      <SkeletonLoader numRows={1} loaded={!loading}>
        <Form style={{ gap: 0 }}>
          <div>{t('Enter key=value, then press return, space, or comma')}</div>
          &nbsp;
          <LabelsInput
            name="labels-input"
            label={t('{{resourceName}} labels', {
              resourceName: resource?.metadata?.name,
            })}
            value={labels}
            onChange={(labels) => setLabels(labels)}
          />
          <ActionGroup>
            <Button
              variant="primary"
              onClick={() => void handleSubmit()}
              isLoading={submitting}
              isDisabled={submitting}
            >
              {t('Save')}
            </Button>
            <Button variant="link" onClick={close} isDisabled={submitting}>
              {t('cancel')}
            </Button>
          </ActionGroup>
          {error && (
            <Alert variant={AlertVariant.danger} title={t('Failed to update labels')} isInline>
              {getErrorMessage(error)}
            </Alert>
          )}
        </Form>
      </SkeletonLoader>
    </Modal>
  );
};

export default EditLabelsDialog;
