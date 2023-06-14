import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Label } from '@patternfly/react-core';
import React from 'react';
import NotAvailable from '../../helpers/NotAvailable';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplateVendor } from '../../types/resourceTypes';
import { getResourceVendor } from '../../utils/clusterTemplateDataUtils';

export const VendorLabel = ({ resource }: { resource: K8sResourceCommon }) => {
  const { t } = useTranslation();
  const vendor = getResourceVendor(resource);
  if (!vendor) {
    return <NotAvailable />;
  }
  const color = vendor === ClusterTemplateVendor.COMMUNITY ? 'green' : 'purple';
  const labelText = vendor === ClusterTemplateVendor.COMMUNITY ? t('Community') : t('Custom');
  return <Label color={color}>{labelText}</Label>;
};

export default VendorLabel;
