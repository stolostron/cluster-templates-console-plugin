import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import { InputField } from 'formik-pf';
import React from 'react';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import { useTranslation } from '../../../../hooks/useTranslation';
import RepositoryField from '../../../sharedFields/RepositoryField';

const GitRepoField = ({ fieldName }: { fieldName: string }) => {
  const { t } = useTranslation();

  return (
    <Stack hasGutter>
      <StackItem>
        <RepositoryField fieldName={`${fieldName}.url`} label={t('Git repository URL')} />
      </StackItem>
      <StackItem>
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <InputField
              name={`${fieldName}.commit`}
              label={t('Commit / Branch/ Tag')}
              labelIcon={
                <PopoverHelpIcon
                  helpText={t('This is optional. If omitted, will be equal to HEAD.')}
                />
              }
              fieldId={`${fieldName}.commit`}
              placeholder={t('Enter a commit, branch or tag')}
              autoComplete="off"
            />
          </FlexItem>
          <FlexItem grow={{ default: 'grow' }}>
            <InputField
              name={`${fieldName}.directory`}
              label={t('Directory path')}
              fieldId={`${fieldName}.directory`}
              placeholder={t('Enter the directory containing the resources to apply')}
              autoComplete="off"
            />
          </FlexItem>
        </Flex>
      </StackItem>
    </Stack>
  );
};

export default GitRepoField;
