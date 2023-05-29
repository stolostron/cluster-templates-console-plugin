import React, { ReactNode } from 'react';
import { Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

type ExternalLinkProps = {
  href?: string;
  children?: ReactNode;
  showIcon?: boolean;
};

const ExternalLink = ({ href, children, showIcon = true }: ExternalLinkProps) => (
  <Text component="a" href={href} target="_blank" rel="noopener noreferrer">
    {children ? children : href} {showIcon && <ExternalLinkAltIcon />}
  </Text>
);
export default ExternalLink;
