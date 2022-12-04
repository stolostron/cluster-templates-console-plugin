import * as React from 'react';
import { Form, Stack, StackItem, Text, TextContent, TextInputTypes } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField } from 'formik-pf';

import { getRepoCharts, useHelmRepositoryIndex } from '../../../../hooks/useHelmRepositoryIndex';
import { useHelmRepositories } from '../../../../hooks/useHelmRepositories';
import { WizardFormikValues } from '../../types';
import SelectField from '../../../../helpers/SelectField';

const repoField = 'details.helmRepo';
const chartField = 'details.helmChart';

const TemplateDetailsStep = () => {
  const { values, setFieldValue } = useFormikContext<WizardFormikValues>();
  const [repositories, loaded] = useHelmRepositories();
  const [repoIndex, indexLoaded] = useHelmRepositoryIndex();

  React.useEffect(() => {
    if (loaded && repositories[0]?.metadata?.name && !values.details.helmRepo) {
      setFieldValue(repoField, repositories[0].metadata?.name);
    }
  }, [loaded, repositories, values.details.helmRepo, setFieldValue]);

  const repoOptions = repositories.map((r) => ({
    value: r.metadata?.name || '',
    label: r.metadata?.name || '',
    disabled: false,
  }));
  const chartsFromRepo = repoIndex ? getRepoCharts(repoIndex, values.details.helmRepo) : [];

  const firstChart = chartsFromRepo[0]?.name;

  React.useEffect(() => {
    if (indexLoaded && values.details.helmRepo && !values.details.helmChart) {
      setFieldValue(chartField, firstChart);
    }
  }, [indexLoaded, values.details.helmRepo, values.details.helmChart, firstChart, setFieldValue]);

  const chartOptions = chartsFromRepo.map((c) => ({
    value: c.name,
    label: c.name,
    disabled: false,
  }));

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h2">Template details</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Form>
          <InputField
            fieldId="name"
            isRequired
            name="details.name"
            label="Template name"
            type={TextInputTypes.text}
            placeholder="Enter template name"
          />
          <SelectField name={repoField} options={repoOptions} isRequired label="Helm repository" />
          <SelectField
            name={chartField}
            options={chartOptions}
            isRequired
            label="Helm chart"
            isDisabled={!values.details.helmRepo}
          />
          <InputField
            isRequired
            name="details.cost"
            min={1}
            label="Cost"
            fieldId={'details.cost'}
          />
        </Form>
      </StackItem>
    </Stack>
  );
};

export default TemplateDetailsStep;
