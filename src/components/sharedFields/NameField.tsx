import React from 'react';
import RichInputField from '../../helpers/RichInputField';
import { useTranslation } from '../../hooks/useTranslation';
import { nameValidationMessages } from '../../utils/commonValidationSchemas';

const NameField = ({
  isDisabled,
  name,
  label,
}: {
  isDisabled?: boolean;
  name: string;
  label: string;
}) => {
  const { t } = useTranslation();
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!isDisabled) {
      nameInputRef.current?.focus();
    }
  }, [isDisabled]);
  return (
    <RichInputField
      ref={nameInputRef}
      isRequired
      name={name}
      label={label}
      placeholder={t('Enter a name')}
      richValidationMessages={nameValidationMessages(t)}
      isDisabled={isDisabled}
    />
  );
};

export default NameField;
