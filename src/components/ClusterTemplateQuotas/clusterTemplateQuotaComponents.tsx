import React from 'react';

import { QuotaDetails } from '../../types';

export const ClusterTemplateQuotaCostSummary = ({
  quotaDetails,
}: {
  quotaDetails: QuotaDetails;
}) => {
  const costAllowed = quotaDetails.budget;
  const costSpent = quotaDetails.budgetSpent;
  if (costAllowed === undefined || costSpent === undefined) {
    return <>-</>;
  }
  return <>{`${costSpent} / ${costAllowed}`}</>;
};
