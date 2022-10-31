/* Copyright Contributors to the Open Cluster Management project */
import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Form, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { SelectField } from 'formik-pf';
import React from 'react';
import { clusterTemplateQuotaGVK } from '../../../../constants';
import { ClusterTemplateQuota } from '../../../../types';
import { FormikValues } from '../../types';

const ManageAccessStep = () => {
  const { values } = useFormikContext<FormikValues>();
  const [namespaces] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind: {
      kind: 'Namespace',
      version: 'v1',
    },
    isList: true,
  });
  const [templateQuotas] = useK8sWatchResource<ClusterTemplateQuota[]>(
    values.quotaNamespace
      ? {
          groupVersionKind: clusterTemplateQuotaGVK,
          namespace: values.quotaNamespace,
          isList: true,
        }
      : null,
  );
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Stack hasGutter>
            <StackItem>
              <Text component="h2">Manage access</Text>
            </StackItem>
            <StackItem>
              Choose users or group of users who can create a cluster using the templates which are
              associated with this repository. Limit the number of clusters that can be created from
              this template.
            </StackItem>
          </Stack>
        </TextContent>
      </StackItem>
      <StackItem>
        <Form>
          <SelectField
            name="quotaNamespace"
            fieldId="quotaName"
            options={namespaces
              .map(({ metadata }) => ({
                value: metadata?.name || '',
                label: metadata?.name || '',
                disabled: false,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            isRequired
            label="Namespace"
          />
          <SelectField
            name="quotaName"
            fieldId="quotaName"
            options={
              templateQuotas?.map(({ metadata }) => ({
                value: metadata?.name || '',
                label: metadata?.name || '',
                disabled: false,
              })) || []
            }
            isRequired
            label="Quota"
            isDisabled={!values.quotaNamespace}
          />
        </Form>
      </StackItem>
    </Stack>
  );
};

export default ManageAccessStep;
