/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = {
  entry: resolve(__dirname, "src", "index.tsx"),
  target: "web",
  mode: "production",
  output: {
    path: resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  performance : {
    hints : false
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src", "index.html"),
    }),
  ],
};
