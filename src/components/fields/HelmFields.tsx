import { Flex, FlexItem, Form } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from 'formik-pf';
import * as React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import SelectField from '../../helpers/SelectField';
import { useHelmRepositories } from '../../hooks/useHelmRepositories';

import { getRepoCharts, useHelmRepositoryIndex } from '../../hooks/useHelmRepositoryIndex';
import { useTranslation } from '../../hooks/useTranslation';

const WithFlex = ({ flexItems }: { flexItems: React.ReactNode[] }) => {
  return (
    <Flex>
      {flexItems.map((item, index) => (
        <FlexItem key={index} grow={{ default: 'grow' }}>
          {item}
        </FlexItem>
      ))}
    </Flex>
  );
};

const HelmFields = ({
  fieldNamePrefix,
  horizontal = false,
}: {
  fieldNamePrefix: string;
  horizontal?: boolean;
}) => {
  const { t } = useTranslation();
  const repoFieldName = `${fieldNamePrefix}.repoURL`;
  const chartFieldName = `${fieldNamePrefix}.chart`;
  const versionFieldName = `${fieldNamePrefix}.version`;
  const [{ value: repo }] = useField<string>(repoFieldName);
  const [{ value: chart }, , { setValue: setChart }] = useField<string>(chartFieldName);
  const [repositories, repositoriesLoaded, repositoriesError] = useHelmRepositories();
  const [repoIndex, indexLoaded, indexError] = useHelmRepositoryIndex();
  useAddAlertOnError(repositoriesError, t('Failed to load repositories'));
  useAddAlertOnError(indexError, t('Failed to load charts'));

  const repoOptions = repositories.map((r) => ({
    value: r.metadata?.name || '',
    label: r.metadata?.name || '',
    disabled: false,
  }));

  const chartsFromRepo = repoIndex ? getRepoCharts(repoIndex, repo) : [];

  const firstChart = chartsFromRepo[0]?.name;

  React.useEffect(() => {
    if (indexLoaded && repo && !chart && firstChart) {
      setChart(firstChart);
    }
  }, [indexLoaded, firstChart, repo, chart]);

  const chartOptions = chartsFromRepo.map((c) => ({
    value: c.name,
    label: c.name,
    disabled: false,
  }));

  const fields = [
    <SelectField
      name={repoFieldName}
      options={repoOptions}
      isRequired
      label={t('HELM chart repository')}
      key={repoFieldName}
      loadingVariant={repositoriesLoaded ? undefined : 'spinner'}
      isDisabled={repositoriesError}
    />,
    <SelectField
      name={chartFieldName}
      options={chartOptions}
      isRequired
      label={t('HELM chart')}
      isDisabled={!repo}
      key={chartFieldName}
    />,
    <InputField
      name={versionFieldName}
      fieldId={versionFieldName}
      label={t('HELM chart version')}
      key={versionFieldName}
    />,
  ];
  const helmFields = horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
  return <Form>{helmFields}</Form>;
};

export default HelmFields;
