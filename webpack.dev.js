/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: {
    startupScripts: glob.sync('./plugins/startupScripts/*.js'),
    main: './src/index.js',
  },
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'dist/dev'),
    hashDigestLength: 6,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  devtool: 'source-map-inline',
  devServer: {
    host: 'localhost',
    contentBase: path.join(__dirname, 'dist/dev'),
    compress: false,
    port: 8081,
    hot: true,
    disableHostCheck: true,
    open: true,
    // writeToDisk: true  // For debugging build output
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new GitRevisionPlugin(),
    new webpack.BannerPlugin({
      banner: `version ${pkg.version}`,
    }),
    new CopyPlugin([{ from: './node_modules/@lightningjs/core/devtools/lightning-inspect.js', to: 'lib' }]),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'index.html',
      version: `version ${pkg.version}`,
      commithash: gitRevisionPlugin.commithash(),
      branch: gitRevisionPlugin.branch(),
      title: `${pkg.version} - Firebolt Certification App`,
      // For inspecting canvas elements in web inspector.
      // SLOWS PERFORMANCE - DO NOT ENABLE IN PRODUCTION!!
      useInspector: true,
    }),
  ],
  node: {
    fs: 'empty',
  },
  resolve: {
    mainFields: ['module', 'main', 'browser'],
    plugins: [
      new AliasPlugin(
        'described-resolve',
        [
          { name: 'pubSubClient', alias: ['/plugins/pubSubClient.js', '/src/pubSubClient.js'] },
          {
            name: 'EventInvocation',
            alias: ['/plugins/EventInvocation.js', '/src/EventInvocation.js'],
          },
          { name: 'Test_Runner', alias: ['/plugins/Test_Runner.js', '/src/Test_Runner.js'] },
          { name: 'config', alias: ['/plugins/config.js'] },
          {
            name: 'IntentReader',
            alias: ['/plugins/IntentReader.js', '/src/IntentReader.js'],
          },
          {
            name: 'CensorData',
            alias: ['/plugins/censorData.json', '/src/source/censorData.json'],
          },
          {
            name: 'runTestHandler',
            alias: ['/plugins/runTestHandler.js', '/src/pubsub/handlers/RunTestHandler.js'],
          },
        ],
        'resolve'
      ),
    ],
    alias: {
      externalInvokers: path.resolve(__dirname, 'plugins/sdks'),
      externalViews: path.resolve(__dirname, 'plugins/externalViews'),
    },
  },
};
