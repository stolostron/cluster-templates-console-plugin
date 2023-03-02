import React from 'react';

import {
  Button,
  Divider,
  Form,
  Stack,
  StackItem,
  TextContent,
  Text,
  Flex,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import { useTranslation } from '../../../../hooks/useTranslation';
import { PostInstallationFormikValues, isHelmSource } from '../../../../types/wizardFormTypes';
import { getNewGitOpsFormValues } from '../../../../utils/toWizardFormValues';
import { WithRemoveButton } from '../../../../helpers/WithRemoveButton';
import HelmFields from '../../../sharedFields/HelmFields';
import GitRepoField from './GitRepoField';
import { InputField } from 'formik-pf';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import SyncFields from './SyncFields';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';

const stepName = 'postInstallation';

const PostInstallationSettings = ({
  fieldName,
  onRemove,
}: {
  fieldName: string;
  onRemove: () => void;
}) => {
  const [{ value }] = useField<PostInstallationFormikValues>(fieldName);
  const { t } = useTranslation();
  return (
    <WithRemoveButton
      onRemove={onRemove}
      isRemoveDisabled={false}
      ariaLabel={t('Remove GitOps configuration')}
    >
      <Stack hasGutter>
        <StackItem>
          {isHelmSource(value.source) ? (
            <HelmFields fieldName={`${fieldName}.source`} horizontal={true} />
          ) : (
            <GitRepoField fieldName={`${fieldName}.source`} />
          )}
        </StackItem>
        <StackItem>
          <InputField
            name={`${fieldName}.destinationNamespace`}
            label={t('Destination namespace')}
            labelIcon={
              <PopoverHelpIcon
                helpText={t(
                  'Specify the target namespace for the resources. The namespace will only be set for namespace-scoped resources that have not set a value for .metadata.namespace',
                )}
              />
            }
            fieldId={fieldName}
            placeholder={t('Enter a destination namespace')}
            autoComplete="off"
          />
        </StackItem>
        <StackItem>
          <SyncFields fieldName={fieldName} />
        </StackItem>
      </Stack>
    </WithRemoveButton>
  );
};

const PostInstallationArrayFields = ({ push, remove }: FieldArrayRenderProps) => {
  const [field] = useField<PostInstallationFormikValues[]>({
    name: stepName,
  });

  const { t } = useTranslation();

  return (
    <Stack hasGutter>
      {field.value.map((data, idx) => {
        return (
          <React.Fragment key={idx}>
            <Stack hasGutter>
              <StackItem>
                <PostInstallationSettings
                  onRemove={() => remove(idx)}
                  fieldName={`${stepName}[${idx}]`}
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
        <Flex>
          <Button
            variant="link"
            onClick={() => push(getNewGitOpsFormValues('git'))}
            icon={<PlusIcon />}
            isInline
          >
            {t('Add Git repository')}
          </Button>
          <Button
            variant="link"
            onClick={() => push(getNewGitOpsFormValues('helm'))}
            icon={<PlusIcon />}
            isInline
          >
            {t('Add Helm chart')}
          </Button>
        </Flex>
      </StackItem>
    </Stack>
  );
};

const PostInstallationStepForm = () => {
  return (
    <Form>
      <FieldArray
        name={stepName}
        component={PostInstallationArrayFields as React.ComponentType<FieldArrayRenderProps | void>}
      />
    </Form>
  );
};

const Description = () => {
  const { t } = useTranslation();
  return (
    <Text>
      {t(
        'Select the helm charts to install on clusters created by this template. The cluster will only be available after they are installed.',
      )}
    </Text>
  );
};

const PostInstallationStep = () => {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component="h2">{t('GitOps')}</Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <Description />
        </StackItem>
        <StackItem>
          <Divider />
        </StackItem>
        <StackItem>
          <Form>
            <PostInstallationStepForm />
          </Form>
        </StackItem>
      </Stack>
    </ErrorBoundary>
  );
};

export default PostInstallationStep;
