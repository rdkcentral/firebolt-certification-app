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

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  automock: true,
};

module.exports = config;

// Or async function
module.exports = {
  moduleNameMapper: {
    '^pubSubClient$': '../src/pubSubClient.js',
    '^externalInvokers$': '<rootDir>/../src/FireboltExampleInvoker.js',
    '^config$': '../plugins/config.js',
    '^Test_Runner$': '<rootDir>/../src/Test_Runner.js',
    '^EventInvocation$': '<rootDir>/../src//EventInvocation.js',
    '^IntentReader$': '../src/IntentReader.js',
    '^CensorData$': '<rootDir>/../src/source/censorData.json',
    '^RunTestHandler$': '<rootDir>/../src/pubsub/handlers/RunTestHandler.js',
  },
  resolver: '<rootDir>/jest.transport-resolver.js',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(fca-validation-modules|@firebolt-js/sdk|@firebolt-js/manage-sdk|@firebolt-js/discovery-sdk))'],
  modulePathIgnorePatterns: ['<rootDir>/src/utils/FireboltSdkManager.js'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 25,
      functions: 35,
      lines: 40,
    },
  },
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
