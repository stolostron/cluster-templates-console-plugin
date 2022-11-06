import React from 'react';

import {
  Button,
  Divider,
  ExpandableSection,
  ExpandableSectionToggle,
  Flex,
  FlexItem,
  Grid,
  Label,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { PlusIcon, MinusCircleIcon } from '@patternfly/react-icons';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import { AccessFormikValues } from '../../formikTypes';
import { getAccessFormikInitialValues } from '../../initialValues';
import AccessCard from './AccessCard';
import { useTranslation } from '../../../../hooks/useTranslation';
const fieldName = 'quotas';

export const RemoveItemButton: React.FC<{
  onRemove: () => void;
  showRemoveButton: boolean;
  dataTestId: string;
}> = ({ onRemove, showRemoveButton, dataTestId }) => (
  //use css visibility instead of conditional rendering to avoid button jumping when hovering
  <Button
    aria-label="remove quota"
    style={{ visibility: showRemoveButton ? 'visible' : 'hidden' }}
    variant="plain"
  >
    <MinusCircleIcon onClick={onRemove} data-testid={dataTestId} />
  </Button>
);

const AccessExpandableSection = ({
  quotaIdx,
  onRemove,
  enableRemoveQuota,
}: {
  quotaIdx: number;
  onRemove: (idx) => void;
  enableRemoveQuota: boolean;
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showRemoveButton, setShowRemoveButton] = React.useState(false);
  const updateShowRemoveButton = (value: boolean) => {
    if (!enableRemoveQuota) {
      setShowRemoveButton(false);
    } else {
      setShowRemoveButton(value);
    }
  };
  const quotaFieldName = `quotas[${quotaIdx}]`;
  return (
    <Grid
      onMouseEnter={() => updateShowRemoveButton(true)}
      onMouseLeave={() => updateShowRemoveButton(false)}
      hasGutter
    >
      <Flex>
        <FlexItem>
          <ExpandableSectionToggle
            direction="down"
            data-testid={`toggle-quota-${quotaIdx}`}
            onToggle={setIsExpanded}
            isExpanded={isExpanded}
          >
            {`Access ${quotaIdx + 1}`}
          </ExpandableSectionToggle>
        </FlexItem>
        {enableRemoveQuota && (
          <FlexItem align={{ default: 'alignRight' }}>
            <RemoveItemButton
              onRemove={() => onRemove(quotaIdx)}
              showRemoveButton={showRemoveButton}
              dataTestId={`remove-quota-${quotaIdx}`}
            />
          </FlexItem>
        )}
      </Flex>

      {isExpanded && (
        <ExpandableSection isDetached key={quotaIdx} isExpanded={isExpanded} isIndented>
          <AccessCard quotaIdx={quotaIdx} fieldName={quotaFieldName} />
        </ExpandableSection>
      )}
      {!isExpanded && <Label>{'collapsed'}</Label>}
    </Grid>
  );
};

const _AccessCardsArray = ({ push, remove }: FieldArrayRenderProps) => {
  const [field, { error }] = useField<AccessFormikValues[]>({
    name: fieldName,
  });

  const { t } = useTranslation();
  const onAddQuota = () => {
    push(getAccessFormikInitialValues());
  };

  return (
    <Stack hasGutter>
      {field.value.map((data, quotaIdx) => {
        return (
          <React.Fragment key={quotaIdx}>
            <Stack hasGutter>
              <StackItem>
                <AccessExpandableSection
                  quotaIdx={quotaIdx}
                  onRemove={remove}
                  enableRemoveQuota={field.value.length > 1}
                />
              </StackItem>
              <StackItem>
                <Divider />
              </StackItem>
            </Stack>
          </React.Fragment>
        );
      })}
      <StackItem>
        <Button
          variant="link"
          onClick={onAddQuota}
          data-testid="add-quota"
          isDisabled={!!error}
          icon={<PlusIcon />}
        >
          {t('Add another access')}
        </Button>
      </StackItem>
    </Stack>
  );
};

const AccessCardsArray = () => {
  const renderQuotas = React.useCallback(
    (renderProps: FieldArrayRenderProps) => <_AccessCardsArray {...renderProps} />,
    [],
  );
  return <FieldArray name={fieldName} render={renderQuotas} />;
};

export default AccessCardsArray;
