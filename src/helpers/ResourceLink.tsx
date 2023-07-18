import React from 'react';
import { getResourceUrl } from '../utils/k8s';

//duplicate ResourceLink in SDK to enable storybook on components using this
const ResourceLink = ({
  groupVersionKind,
  name,
  namespace,
}: {
  groupVersionKind: { group?: string; version: string; kind: string };
  name: string;
  namespace?: string;
}) => {
  return <a href={getResourceUrl(groupVersionKind, name, namespace)}>{name}</a>;
};

export default ResourceLink;
