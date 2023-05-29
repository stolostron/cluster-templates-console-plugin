import type { Preview } from '@storybook/react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/quickstarts/dist/quickstarts.min.css';
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
