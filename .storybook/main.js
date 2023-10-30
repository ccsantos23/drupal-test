/** @type { import('@storybook/server-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../web/themes/**/*.mdx",
    "../web/themes/**/*.stories.mdx",
    "../web/themes/**/*.stories.yml",
    "../web/modules/**/*.mdx",
    "../web/modules/**/*.stories.mdx",
    "../web/modules/**/*.stories.yml",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@lullabot/storybook-drupal-addon"
  ],
  framework: {
    name: "@storybook/server-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
