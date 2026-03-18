/**
 * Webpack — Demo dev server configuration
 *
 * Usage: webpack serve --config webpack.dev.config.cjs
 */
require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',

  entry: path.resolve(__dirname, 'demo/main.tsx'),

  output: {
    path: path.resolve(__dirname, 'dist-demo'),
    filename: '[name].js',
    publicPath: '/',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/index.html'),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
    }),
  ],

  devServer: {
    port: parseInt(process.env.DEV_PORT, 10) || 3001,
    hot: true,
    open: false,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'demo'),
    },
  },
};
