import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
  stories: ["../packages/*/src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-webpack5-compiler-swc",
  ],
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
        },
      },
    },
  }),
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (cfg) => {
    cfg.module = cfg.module || { rules: [] };
    cfg.module.rules = cfg.module.rules || [];

    const cssRule = cfg.module.rules.find((rule) => {
      if (!rule || typeof rule !== "object") return false;
      const test = (rule as { test?: RegExp }).test;
      return test instanceof RegExp && test.test(".css");
    });
    if (cssRule && typeof cssRule === "object") {
      const r = cssRule as { use?: unknown[] };
      if (Array.isArray(r.use)) {
        r.use.push("postcss-loader");
      }
    }

    cfg.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: "asset/resource",
      include: path.resolve(__dirname, "../packages"),
    });

    return cfg;
  },
};

export default config;
