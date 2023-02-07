import React from 'react';

import {
  Button,
  Divider,
  Form,
  Stack,
  StackItem,
  TextContent,
  Text,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import { useTranslation } from '../../../../hooks/useTranslation';
import { RemoveButton } from '../../../../helpers/WithRemoveButton';
import '../styles.css';
import { InputField } from 'formik-pf';
import PopoverHelpIcon from '../../../../helpers/PopoverHelpIcon';
import { getNewArgoCDSpecFormValues } from '../../../../utils/toWizardFormValues';
import { HelmFormikValues } from '../../types';
import HelmFields from '../../../sharedFields/HelmFields';

const fieldName = 'postInstallation';

const PostInstallationSettings = ({
  idx,
  remove,
  isRemoveDisabled,
}: {
  idx: number;
  remove: (number: number) => void;
  isRemoveDisabled: boolean;
}) => {
  const { t } = useTranslation();
  const fieldName = `postInstallation[${idx}]`;

  return (
    <Grid hasGutter>
      <GridItem span={11}>
        <HelmFields fieldNamePrefix={fieldName} horizontal={true} />
      </GridItem>
      <GridItem className="cluster-templates-argoc-remove-button" span={1}>
        <RemoveButton
          onRemove={() => remove(idx)}
          isRemoveDisabled={isRemoveDisabled}
          ariaLabel={t('Remove post installation ArgoCD spec')}
        />
      </GridItem>
      <GridItem span={11}>
        <InputField
          name={`${fieldName}.destinationNamespace`}
          label={t('Destination namespace')}
          labelIcon={
            <PopoverHelpIcon
              helpText={t(
                "Specify the target namespace for the application's resources. The namespace will only be set for namespace-scoped resources that have not set a value for .metadata.namespace",
              )}
            />
          }
          fieldId={`${fieldName}.destinationNamespace`}
          placeholder={t('Enter a destination namespace')}
          autoComplete="off"
        />
      </GridItem>
    </Grid>
  );
};

const PostInstallationArrayFields = ({ push, remove }: FieldArrayRenderProps) => {
  const [field] = useField<HelmFormikValues[]>({
    name: fieldName,
  });

  const { t } = useTranslation();
  const onAddArgoCDSpec = () => {
    push(getNewArgoCDSpecFormValues());
  };

  return (
    <Stack hasGutter>
      {field.value.map((data, idx) => {
        return (
          <React.Fragment key={idx}>
            <Stack hasGutter>
              <StackItem>
                <PostInstallationSettings isRemoveDisabled={false} remove={remove} idx={idx} />
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
          onClick={onAddArgoCDSpec}
          icon={<PlusIcon />}
          className="cluster-templates-field-array__btn"
        >
          {field.value && field.value.length
            ? t('Add more')
            : t('Add the first post-installation settings')}
        </Button>
      </StackItem>
    </Stack>
  );
};

const PostInstallationStepForm = () => {
  return (
    <Form>
      <FieldArray
        name={fieldName}
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
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">{t('Post-installation settings (optional)')}</Text>
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
  );
};

export default PostInstallationStep;
