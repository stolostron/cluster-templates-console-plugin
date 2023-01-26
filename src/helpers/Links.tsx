import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import React from 'react';
import { getResourceUrl } from '../utils/k8s';
import './styles.css';

export const InlineLinkButton = ({ text, url }: { text: string; url: string }) => (
  <Button variant="link" icon={<ExternalLinkAltIcon />} iconPosition="right" isInline>
    <a href={url}>{text}</a>
  </Button>
);

const InlineResourceLink = ({
  groupVersionKind,
  displayName,
  name,
}: {
  groupVersionKind: K8sGroupVersionKind;
  displayName?: string;
  name?: string;
}) => (
  <InlineLinkButton text={displayName || name || ''} url={getResourceUrl(groupVersionKind, name)} />
);

export default InlineResourceLink;
