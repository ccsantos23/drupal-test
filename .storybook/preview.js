/** @type { import('@storybook/server').Preview } */
const preview = {
  parameters: {
    server: {
      // Replace this with your Drupal site URL, or an environment variable.
      url: 'http://drupal-test.contrib.com:8080',
    },
    globals: {
      drupalTheme: 'olivero',
      supportedDrupalThemes: {
        olivero: {title: 'Olivero'},
        claro: {title: 'Claro'},
      },
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
