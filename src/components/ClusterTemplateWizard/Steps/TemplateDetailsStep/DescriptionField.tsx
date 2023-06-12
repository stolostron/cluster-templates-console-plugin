import * as React from 'react';
import { useField } from 'formik';
import {
  FormGroup,
  EmptyState,
  EmptyStateSecondaryActions,
  EmptyStatePrimary,
  Button,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from '../../../../hooks/useTranslation';
import MarkdownEditor from '../../../../helpers/MardownEditor';
import { CodeIcon } from '@patternfly/react-icons';

const presetText = `## When to use this template? 
Use this template to deploy this kind of cluster: 
- This is a testing/dev/production environment 
## Preconditions for using this template 
- Prepare a unique cluster name 
- Make sure you have the <add here what is required, for example, pull secret> 
## Parameters 
| Name | Default value |
| ------ | ------ | 
| Parameter 1 | value | 
| Parameter 2 | value | 
| Parameter 3 | value | 

## Important links
| Name | Link | 
| ------ | ------ | 
| GitHub | github.com | 
| Template repository | github.com/template | 
| Read more | yourwebsite.com |`;

const DescriptionEmptyState = ({
  onUsePreset,
  onStartFromScratch,
}: {
  onUsePreset: () => void;
  onStartFromScratch: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <EmptyState>
      <EmptyStateIcon
        icon={CodeIcon}
        style={{ fontSize: 'var(--pf-global--icon--FontSize--md)' }}
      />
      <Title headingLevel={'h4'}>{t('Describe when and how to use this template')}</Title>
      <EmptyStatePrimary>
        <Button variant="secondary" onClick={onUsePreset}>
          {t('Use preset description')}
        </Button>
      </EmptyStatePrimary>
      <EmptyStateSecondaryActions>
        <Button variant="link" onClick={onStartFromScratch}>
          {t('Start from scratch')}
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

const DescriptionField = () => {
  const name = 'details.description';
  const { t } = useTranslation();
  const [field, { error, touched }, { setValue }] = useField<string>(name);
  const isValid = !error && !touched;
  const onUsePreset = () => setValue(presetText);
  const onStartFromScratch = () => setValue('');
  return (
    <>
      <FormGroup
        fieldId={name}
        label={t('Description')}
        helperTextInvalid={error}
        validated={isValid ? 'default' : 'error'}
      >
        <MarkdownEditor
          code={field.value}
          onChange={(code) => setValue(code)}
          height={200}
          emptyState={
            <DescriptionEmptyState
              onUsePreset={onUsePreset}
              onStartFromScratch={onStartFromScratch}
            />
          }
        />
      </FormGroup>
    </>
  );
};

export default DescriptionField;
