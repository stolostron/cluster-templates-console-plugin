import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  PageSection,
  PageSectionVariants,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import React from 'react';

type BreadcrumbProps = {
  onBack: () => void;
  prevItemText: string;
  activeItemText: string;
};
export type WithBreadcrumbProps = {
  children: React.ReactNode;
} & BreadcrumbProps;

const PageBreadcrumb = ({ activeItemText, prevItemText, onBack }: BreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Button variant="link" isInline onClick={onBack}>
          {prevItemText}
        </Button>
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{activeItemText}</BreadcrumbItem>
    </Breadcrumb>
  );
};

const WithBreadcrumb = ({ children, ...props }: WithBreadcrumbProps) => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      style={{
        paddingTop: 'var(--pf-c-page__main-breadcrumb--PaddingTop)',
      }}
    >
      <Stack hasGutter>
        <StackItem>
          <PageBreadcrumb {...props} />
        </StackItem>
        <StackItem>{children}</StackItem>
      </Stack>
    </PageSection>
  );
};

export default WithBreadcrumb;
