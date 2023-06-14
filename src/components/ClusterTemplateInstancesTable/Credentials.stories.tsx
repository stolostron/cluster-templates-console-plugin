import { Meta, StoryObj } from '@storybook/react';
import Credentials from './Credentials';

const meta: Meta<typeof Credentials> = {
  title: 'Credentials',
  component: Credentials,
};

export default meta;
type Story = StoryObj<typeof Credentials>;

export const CredentialsStory: Story = {
  args: {
    username: 'test',
    password: 'aaabbb!!!&&&',
    serverUrl: 'http://www.google.com',
  },
};
