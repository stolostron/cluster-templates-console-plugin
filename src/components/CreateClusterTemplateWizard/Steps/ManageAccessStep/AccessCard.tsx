import { Button, Flex, FlexItem, Form } from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { useField } from 'formik';
import { CheckboxField, NumberSpinnerField } from 'formik-pf';
import React from 'react';
import SelectField from '../../../../helpers/SelectField';
import { useTranslation } from '../../../../hooks/useTranslation';
import NewQuotaDialog from '../../../ClusterTemplateQuotas/NewQuotaDialog';
import { useAccessContext } from './AccessContextProvider';

type QuotaCardProps = {
  quotaIdx: number;
  fieldName: string;
};

type SelectInputOption = {
  value: string;
  disabled: boolean;
};

const AccessCard = ({ quotaIdx, fieldName }: QuotaCardProps) => {
  const checkboxFieldName = `${fieldName}.limitAllowed`;
  const nameFieldName = `${fieldName}.name`;
  const { t } = useTranslation();
  const accessData = useAccessContext();
  const [{ value: limitAllowed }] = useField(checkboxFieldName);
  const [, , { setValue }] = useField(nameFieldName);
  const [newQuotaDialogOpen, setNewQuotaDialogOpen] = React.useState(false);
  const getSelectOptions = (): SelectInputOption[] => {
    return accessData.map((access) => ({
      value: access.metadata?.name,
      disabled: false,
    }));
  };

  return (
    <>
      <Form>
        <SelectField
          label={t('Quota')}
          name={nameFieldName}
          fieldId={nameFieldName}
          options={getSelectOptions()}
          multiple={false}
          aria-label={`Access ${quotaIdx} quota name`}
          helperText={
            <Button variant="link" onClick={() => setNewQuotaDialogOpen(true)} icon={<PlusIcon />}>
              {t('Create a new quota')}
            </Button>
          }
        />
        <Flex>
          <FlexItem>
            <CheckboxField
              name={checkboxFieldName}
              fieldId={checkboxFieldName}
              label={t('Limit the number of clusters created from this type')}
            />
          </FlexItem>
          <FlexItem>
            <NumberSpinnerField
              name={`${fieldName}.numAllowed`}
              data-index={quotaIdx}
              fieldId={`${fieldName}.numAllowed`}
              isDisabled={!limitAllowed}
            />
          </FlexItem>
        </Flex>
      </Form>
      <NewQuotaDialog
        isOpen={newQuotaDialogOpen}
        closeDialog={(name?: string) => {
          if (name) {
            setValue(name);
          }
          setNewQuotaDialogOpen(false);
        }}
      />
    </>
  );
};

export default AccessCard;
