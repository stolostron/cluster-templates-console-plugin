import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CredentialsDialog from './CredentialsDialog';

const CredentialsDialogWrapper = (props: React.ComponentProps<typeof CredentialsDialog>) => (
  <CredentialsDialog {...props} isOpen={true} />
);

const meta: Meta<typeof CredentialsDialog> = {
  title: 'CredentialsDialog',
  component: CredentialsDialogWrapper,
};

export default meta;
type Story = StoryObj<typeof CredentialsDialogWrapper>;

export const CredentialsDialogStory: Story = {
  args: {
    username: 'test',
    password: 'aaabbb!!!&&&',
    serverUrl: 'http://www.google.com',
  },
};
