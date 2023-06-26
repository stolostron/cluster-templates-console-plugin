import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import React from 'react';
import { TFunction } from 'react-i18next';
import { SchemaOf } from 'yup';
import { nameSchema } from '../../utils/commonValidationSchemas';
import * as yup from 'yup';
import NameField from './NameField';
import { Form } from '@patternfly/react-core';

const NameFieldWrapper = ({ initialName }: { initialName: string }) => {
  const tFunction: TFunction = (text: string) => text;
  const validationSchema = React.useMemo<SchemaOf<{ name: string }>>(() => {
    return yup.object().shape({
      name: yup.string().concat(nameSchema(tFunction)).required('Required'),
    });
  }, []);
  return (
    <Formik
      initialValues={{ name: initialName }}
      onSubmit={(values) => console.log(values)}
      validateOnMount
      validationSchema={validationSchema}
      initialTouched={{ name: true }}
    >
      <Form>
        <NameField name="name" label="name" />
      </Form>
    </Formik>
  );
};

const meta: Meta<typeof NameFieldWrapper> = {
  title: 'NameField',
  component: NameFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof NameFieldWrapper>;

export const ValidName: Story = {
  args: {
    initialName: 'valid-name',
  },
};

export const InvalidFirstChar: Story = {
  args: {
    initialName: 'Invalid-first-chart',
  },
};

export const InvalidCharacters: Story = {
  args: {
    initialName: 'blabla',
  },
};
