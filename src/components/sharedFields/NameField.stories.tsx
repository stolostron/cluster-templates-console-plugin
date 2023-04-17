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

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof NameFieldWrapper> = {
  title: 'Example/NameField',
  component: NameFieldWrapper,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NameFieldWrapper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const ValidName: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
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
