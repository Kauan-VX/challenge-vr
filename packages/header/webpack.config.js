const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const API_BASE_URL = process.env.API_BASE_URL || "https://dummyjson.com";

const PORT = 3001;

module.exports = (_env, argv) => {
  const isProd = argv.mode === "production";
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
      port: PORT,
      historyApiFallback: true,
      hot: true,
      headers: { "Access-Control-Allow-Origin": "*" },
      static: { directory: path.resolve(__dirname, "public") },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: { transpileOnly: true },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "header",
        filename: "remoteEntry.js",
        exposes: {
          "./Header": "./src/Header",
        },
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
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ],
  };
};
