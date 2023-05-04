import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { load } from 'js-yaml';
import { QuickStart } from '@patternfly/quickstarts';
import Loader from '../../helpers/Loader';
import ClusterTemplateDetailsGettingStarted from './ClusterTemplateDetailsGettingStarted';
import { Page } from '@patternfly/react-core';
import WithQuickStarts from '../../helpers/GettingStarted/WithQuickStarts';

const qsFiles = ['createTemplateQuickStart.yaml', 'shareTemplateQuickStart.yaml'];

const loadQuickStarts = async (): Promise<QuickStart[]> => {
  const quickStarts = [];
  for (const file of qsFiles) {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to load YAML file: ${response.statusText}`);
    }
    const text = await response.text();
    quickStarts.push(load(text) as QuickStart);
  }
  return quickStarts;
};

const ClusterTemplateDetailsGettingStartedWrapper = ({
  isRedhatTemplate,
}: {
  isRedhatTemplate: boolean;
}) => {
  const [quickStarts, setQuickStarts] = React.useState<QuickStart[]>();
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    console.log('reload');
    const load = async () => {
      try {
        const quickStarts = await loadQuickStarts();
        setQuickStarts(quickStarts);
        setLoaded(true);
      } catch (err) {
        setError(err);
      }
    };
    void load();
  }, []);

  return (
    <Loader loaded={loaded} error={error}>
      {loaded && quickStarts && (
        <Page style={{ height: '100vh' }}>
          <WithQuickStarts quickStarts={quickStarts} quickStartsLoading={true}>
            <ClusterTemplateDetailsGettingStarted
              isRedhatTemplate={isRedhatTemplate}
              onCreateCluster={() => console.log('on create cluster')}
            />
          </WithQuickStarts>
        </Page>
      )}
    </Loader>
  );
};

const meta: Meta<typeof ClusterTemplateDetailsGettingStartedWrapper> = {
  title: 'Example/ClusterTemplateDetailsGettingStarted',
  component: ClusterTemplateDetailsGettingStartedWrapper,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClusterTemplateDetailsGettingStartedWrapper>;

export const ClusterTemplateDetailsGettingStartedLoaded: Story = {
  args: { isRedhatTemplate: false },
};

export const ClusterTemplateDetailsGettingStartedRedhatTemplate: Story = {
  args: { isRedhatTemplate: true },
};
