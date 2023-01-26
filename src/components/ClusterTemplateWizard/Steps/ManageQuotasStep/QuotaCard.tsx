import { Button, Form } from '@patternfly/react-core';
// import { PlusIcon } from '@patternfly/react-icons';
import { useFormikContext } from 'formik';
import React from 'react';
import SelectField, { SelectInputOption } from '../../../../helpers/SelectField';
import { useTranslation } from '../../../../hooks/useTranslation';
import NewQuotaDialog from '../../../ClusterTemplateQuotas/NewQuotaDialog/NewQuotaDialog';
import { useQuotas } from '../../../../hooks/useQuotas';
import { QuotaOptionObject, WizardFormikValues } from '../../types';
import BudgetField from '../../../ClusterTemplateQuotas/NewQuotaDialog/BudgetField';
import { PlusIcon } from '@patternfly/react-icons';
import { useAddAlertOnError } from '../../../../alerts/useAddAlertOnError';

type QuotaCardProps = {
  quotaIdx: number;
  fieldName: string;
};

const getQuotaOptionObject = (name: string, namespace: string): QuotaOptionObject => ({
  name: name,
  namespace: namespace,
  toString: () => name,
});

const QuotaCard = ({ quotaIdx, fieldName }: QuotaCardProps) => {
  const { values, setFieldValue } = useFormikContext<WizardFormikValues>();
  const quotaFieldName = `${fieldName}.quota`;

  const checkboxFieldName = `${fieldName}.limitAllowed`;

  const { t } = useTranslation();
  const [quotasContext, loaded, error] = useQuotas();
  // t('Failed to load quota options')
  useAddAlertOnError(error, 'Failed to load quota options');
  const [newQuotaDialogOpen, setNewQuotaDialogOpen] = React.useState(false);

  const getSelectOptions = React.useCallback((): SelectInputOption[] => {
    return quotasContext.getAllQuotasDetails().map((quotaDetails) => ({
      value: getQuotaOptionObject(quotaDetails.name, quotaDetails.namespace),
      disabled: false,
      description: t('Namespace: {{namespace}}', { namespace: quotaDetails.namespace }),
    }));
  }, [quotasContext, t]);

  const selectOptions = React.useMemo(() => getSelectOptions(), [getSelectOptions]);

  return (
    <>
      <Form>
        <SelectField
          label={t('Quota')}
          name={quotaFieldName}
          options={selectOptions}
          aria-label={`Quota ${quotaIdx} quota name`}
          isRequired={true}
          placeholderText={t('Select a quota')}
          footer={
            <Button
              variant="link"
              onClick={() => setNewQuotaDialogOpen(true)}
              icon={<PlusIcon />}
              className="cluster-templates-field-array__btn"
            >
              {t('Create a new quota')}
            </Button>
          }
          loadingVariant={loaded ? undefined : 'spinner'}
          isDisabled={!!error}
        />
        <BudgetField
          hasBudgetFieldName={checkboxFieldName}
          budgetFieldName={`${fieldName}.numAllowed`}
          label={t('Limit the number of clusters created from this template')}
        />
      </Form>
      <NewQuotaDialog
        isOpen={newQuotaDialogOpen}
        closeDialog={(quota?: { name: string; namespace: string }) => {
          if (quota) {
            setFieldValue(quotaFieldName, getQuotaOptionObject(quota.name, quota.namespace));
          }
          setNewQuotaDialogOpen(false);
        }}
        clusterTemplateCost={values.details.cost}
      />
    </>
  );
};

export default QuotaCard;
