import { Breadcrumb, BreadcrumbItem, Button } from '@patternfly/react-core';
import React from 'react';
import { useHistory } from 'react-router';
import { clusterTemplateGVK } from '../constants';
import { useTranslation } from '../hooks/useTranslation';
import { getResourceUrl } from '../utils/k8s';

const PageBreadcrumb = ({ activeItemText }: { activeItemText: string }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Button
          variant="link"
          isInline
          onClick={() => history.push(getResourceUrl(clusterTemplateGVK))}
        >
          {t('Cluster templates')}
        </Button>
      </BreadcrumbItem>
      <BreadcrumbItem isActive>{activeItemText}</BreadcrumbItem>
    </Breadcrumb>
  );
};

export default PageBreadcrumb;
