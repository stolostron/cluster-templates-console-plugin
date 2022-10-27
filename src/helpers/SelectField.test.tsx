import React from 'react';
import SelectField, { getFieldId } from './SelectField';
import { Formik } from 'formik';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('getFieldId', () => {
  test('returns correct field id generated from field name and type', () => {
    const expected = 'form-select-input-clusterName-field';
    expect(getFieldId('clusterName', 'select-input')).toEqual(expected);
  });
  test('it replaces dots in field name with dashes', () => {
    const expected = 'form-select-input-cluster-name-field';
    expect(getFieldId('cluster.name', 'select-input')).toEqual(expected);
  });
});

describe('SelectField', () => {
  beforeEach(() => {
    render(
      <Formik initialValues={{ secretName: 'option1' }} onSubmit={jest.fn()}>
        <SelectField
          name="secretName"
          fieldId="secretName"
          label="Secret name"
          options={[
            {
              value: 'option1',
              disabled: false,
            },
            {
              value: 'option2',
              disabled: false,
            },
          ]}
        />
      </Formik>,
    );
  });
  test('renders a form group with select', async () => {
    expect(screen.getByLabelText('Secret name')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
  });
  test('clears the selection when clicking the x button', async () => {
    expect(screen.getByLabelText('Secret name')).toHaveValue('option1');
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    await waitFor(() => {
      expect(screen.getByLabelText('Secret name')).toHaveValue('');
    });
  });
  test('changes the value when clicking on an option', async () => {
    expect(screen.getByLabelText('Secret name')).toHaveValue('option1');
    await userEvent.click(screen.getByRole('button', { name: 'Options menu' }));
    await userEvent.click(screen.getByRole('option', { name: 'option2' }));
    await waitFor(() => {
      expect(screen.getByLabelText('Secret name')).toHaveValue('option2');
    });
  });
});
