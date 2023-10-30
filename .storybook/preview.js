/** @type { import('@storybook/server').Preview } */
const preview = {
  globals: {
    // see https://storybook.js.org/addons/@lullabot/storybook-drupal-addon
    drupalTheme: "mytheme",
    supportedDrupalThemes: {
      mytheme: {title: "Mytheme"},
      olivero: {title: "Olivero"},
      claro: {title: "Claro"},
    },
  },
  parameters: {
    server: {
      // Replace this with your Drupal site URL, or an environment variable.
      url: 'https://drupal-test.ddev.site:8443',
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
