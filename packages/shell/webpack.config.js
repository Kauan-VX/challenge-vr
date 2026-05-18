const path = require("path");
const net = require("net");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const API_BASE_URL = process.env.API_BASE_URL || "https://dummyjson.com";

const PORT = Number(process.env.PORT) || 3000;

const DEV_REMOTES = {
  header: "header@http://localhost:3001/remoteEntry.js",
  footer: "footer@http://localhost:3002/remoteEntry.js",
  cards: "cards@http://localhost:3003/remoteEntry.js",
};

const PROD_REMOTES = {
  header: "header@/header/remoteEntry.js",
  footer: "footer@/footer/remoteEntry.js",
  cards: "cards@/cards/remoteEntry.js",
};

const RESERVED_PORTS = new Set([3001, 3002, 3003]);

function findAvailablePort(start) {
  if (RESERVED_PORTS.has(start)) return findAvailablePort(start + 1);
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(findAvailablePort(start + 1)));
    server.listen(start, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

module.exports = async (_env, argv) => {
  const isProd = argv.mode === "production";
  const port = isProd ? PORT : await findAvailablePort(PORT);
  if (!isProd && port !== PORT) {
    console.warn(`[shell] port ${PORT} in use, falling back to ${port}`);
  }
  return {
    entry: "./src/index.ts",
    mode: argv.mode || "development",
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      publicPath: "auto",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    devServer: {
      port,
      historyApiFallback: true,
      hot: true,
      static: { directory: path.resolve(__dirname, "public") },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: { loader: "ts-loader", options: { transpileOnly: true } },
        },
        { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
        { test: /\.(png|jpe?g|gif|svg|webp)$/i, type: "asset/resource" },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "shell",
        remotes: isProd ? PROD_REMOTES : DEV_REMOTES,
        shared: {
          react: { singleton: true, requiredVersion: deps.react, eager: false },
          "react-dom": { singleton: true, requiredVersion: deps["react-dom"], eager: false },
          zustand: { singleton: true, requiredVersion: deps.zustand, eager: false },
          axios: { singleton: true, requiredVersion: deps.axios, eager: false },
          "@tanstack/react-query": {
            singleton: true,
            requiredVersion: deps["@tanstack/react-query"],
            eager: false,
          },
        },
      }),
      new webpack.DefinePlugin({
        "process.env.API_BASE_URL": JSON.stringify(API_BASE_URL),
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
      }),
    ],
  };
};
