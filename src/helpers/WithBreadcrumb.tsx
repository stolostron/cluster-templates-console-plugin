import {
  Breadcrumb as PFBreadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import React from 'react';
import { Link } from 'react-router-dom';

export type BreadcrumbProps = {
  breadcrumb: { text: string; to?: string }[];
};

export type WithBreadcrumbProps = BreadcrumbProps & { children: React.ReactNode };

export const Breadcrumb = (props: { breadcrumb?: { text: string; to?: string }[] | undefined }) => {
  const { breadcrumb } = props;
  if (breadcrumb?.length) {
    return (
      <PFBreadcrumb>
        {breadcrumb.map((crumb, i) => (
          <BreadcrumbItem key={i}>
            {breadcrumb.length > 1 && i === breadcrumb.length - 1 ? (
              <a aria-current="page" className="pf-c-breadcrumb__link pf-m-current">
                {crumb.text}
              </a>
            ) : (
              <Link to={crumb.to as string} className="pf-c-breadcrumb__link">
                {crumb.text}
              </Link>
            )}
          </BreadcrumbItem>
        ))}
      </PFBreadcrumb>
    );
  }
  return null;
};

const WithBreadcrumb = ({ children, ...props }: WithBreadcrumbProps) => {
  return (
    <PageSection variant={PageSectionVariants.light} type="breadcrumb">
      <Stack hasGutter>
        <StackItem>
          <Breadcrumb {...props} />
        </StackItem>
        <StackItem>{children}</StackItem>
      </Stack>
    </PageSection>
  );
};

export default WithBreadcrumb;
