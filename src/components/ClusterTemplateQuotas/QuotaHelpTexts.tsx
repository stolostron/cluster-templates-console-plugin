import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const QuotaHelpText = () => {
  const { t } = useTranslation();
  return (
    <>{t('A quota provides constraints that limit aggregate cluster consumption per namespace.')}</>
  );
};

export default QuotaHelpText;
