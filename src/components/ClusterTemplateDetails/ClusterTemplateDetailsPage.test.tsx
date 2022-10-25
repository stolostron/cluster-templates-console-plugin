/* Copyright Contributors to the Open Cluster Management project */

import { render } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ClusterTemplateDetailsPage from './ClusterTemplateDetailsPage';
import { useClusterTemplate } from '../../hooks/useClusterTemplates';
import React from 'react';
import exampleTemplate from '../../mocks/clusterTemplateExample.json';

const useClusterTemplateMock = useClusterTemplate as jest.Mock;

jest.mock('../../hooks/useClusterTemplates');

jest.mock('../../hooks/useQuotas', () => {
  return {
    useQuotas: jest.fn().mockReturnValue([[], true, null]),
  };
});
jest.mock('../../hooks/useClusterTemplateInstances', () => {
  return {
    useClusterTemplateInstances: () => [[], true, null],
  };
});

jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return {
    useK8sWatchResource: jest.fn(),
  };
});

const renderTemplatesPage = () => {
  const history = createMemoryHistory();
  history.push(
    '/k8s/cluster/clustertemplate.openshift.io~v1alpha1~ClusterTemplate/cluster-template-example',
  );
  return render(
    <Router history={history}>
      <Switch>
        <Route
          component={ClusterTemplateDetailsPage}
          path="/k8s/cluster/clustertemplate.openshift.io~v1alpha1~ClusterTemplate/:name"
        />
      </Switch>
    </Router>,
  );
};

describe('cluster template details page', () => {
  beforeEach(() => {
    useClusterTemplateMock.mockReturnValue([exampleTemplate, true, null]);
  });
  it('should show the four sections when template is loaded', async () => {
    const { getByTestId } = renderTemplatesPage();
    expect(getByTestId('details')).toHaveTextContent(/Details/);
    expect(getByTestId('instanceYaml')).toHaveTextContent(
      /Download the YAML file/,
    );
    expect(getByTestId('quotas')).toHaveTextContent(/No quota set yet/);
    expect(getByTestId('uses')).toHaveTextContent(
      /No clusters associated with this template yet/,
    );
  });
  it('should show details in details section', () => {
    const { getByTestId } = renderTemplatesPage();
    const details = {
      ['Template name']: exampleTemplate.metadata?.name,
      ['HELM chart name']:
        exampleTemplate.spec.clusterDefinition.applicationSpec.source.chart,
      ['HELM chart repository']:
        exampleTemplate.spec.clusterDefinition.applicationSpec.source.repoURL,
      ['HELM chart version']:
        exampleTemplate.spec.clusterDefinition.applicationSpec.source
          .targetRevision,
      ['Description']:
        exampleTemplate.metadata?.annotations[
          'clustertemplates.openshift.io/description'
        ],
      ['Infrastructure type']:
        exampleTemplate.metadata?.labels['clustertemplates.openshift.io/infra'],
      ['Location']:
        exampleTemplate.metadata?.labels[
          'clustertemplates.openshift.io/location'
        ],
      ['Vendor']: 'Custom template',
      ['Cost estimation']: `${exampleTemplate.spec.cost} / Per use`,
      ['Template uses']: '0 clusters',
    };
    let error;
    for (const [key, value] of Object.entries(details)) {
      try {
        expect(getByTestId(`${key} label`)).toHaveTextContent(key);
      } catch (err) {
        console.error(`Failed to find label for detail item ${key}`);
        console.error(err);
        error = err;
      }
      try {
        expect(getByTestId(`${key} value`)).toHaveTextContent(value);
      } catch (err) {
        console.error(`Failed to find value ${value} for detail item ${key}`);
        console.error(err);
        error = err;
      }
    }
    if (error) {
      throw 'Failed to show details';
    }
  });
  xit('should show labels in details section', () => {
    const { getByTestId } = renderTemplatesPage();
    expect(getByTestId('Labels label')).toHaveTextContent('Labels');
    for (const [key, value] of Object.entries(
      exampleTemplate.metadata.labels,
    )) {
      expect(getByTestId('Labels value')).toHaveTextContent(`${key}=${value}`);
    }
  });
});

describe('Cluster template details page loading and error states', () => {
  it('should show loading state while loading', async () => {
    useClusterTemplateMock.mockReturnValue([undefined, false, null]);
    const { getByText } = renderTemplatesPage();
    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('should show error when useClusterTemplate failed', async () => {
    useClusterTemplateMock.mockReturnValue([
      undefined,
      false,
      new Error('test error'),
    ]);
    const { getByTestId } = renderTemplatesPage();
    expect(getByTestId('error')).toBeInTheDocument();
  });
});
