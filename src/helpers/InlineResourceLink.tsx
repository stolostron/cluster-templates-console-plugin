import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import React from 'react';
import './styles.css';

const InlineResourceLink = ({
  groupVersionKind,
  displayName,
  name,
}: {
  groupVersionKind: K8sGroupVersionKind;
  displayName?: string;
  name?: string;
}) => (
  <ResourceLink
    name={name}
    hideIcon={true}
    groupVersionKind={groupVersionKind}
    displayName={displayName}
    className="cluster-templates-inline-resource-link"
  />
);

export default InlineResourceLink;
