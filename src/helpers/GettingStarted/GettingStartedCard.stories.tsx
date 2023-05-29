import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import GettingStartedCard from './GettingStartedCard';

const GettingStartedCardWrapper = () => {
  return (
    <GettingStartedCard
      id={'getting-started'}
      title={'Try this template'}
      titleColor={'var(--co-global--palette--purple-700)'}
      description={
        'Make sure the template fits your needs before you share it by creating a cluster from it.'
      }
      links={[
        {
          title: 'Create a cluster from this template',
          onClick: () => console.log('on click link'),
          id: 'try-this-template',
        },
      ]}
    />
  );
};

const meta: Meta<typeof GettingStartedCardWrapper> = {
  title: 'GettingStarted',
  component: GettingStartedCardWrapper,
};

export default meta;
type Story = StoryObj<typeof GettingStartedCardWrapper>;

export const SimpleGettingStartedCard: Story = {
  args: {},
};
