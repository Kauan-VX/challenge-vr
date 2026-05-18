import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: ["../packages/*/src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
  webpackFinal: async (config) => {
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    config.module.rules = config.module.rules.filter((rule) => {
      if (!rule || typeof rule !== "object") return true;
      const test = (rule as { test?: RegExp }).test;
      return !(test instanceof RegExp && test.test("a.css"));
    });

    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          configFile: path.resolve(__dirname, "tsconfig.json"),
        },
      },
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader", "postcss-loader"],
    });

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: "asset/resource",
    });

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@vr/shared": path.resolve(__dirname, "../packages/shared"),
    };

    return config;
  },
};

export default config;
