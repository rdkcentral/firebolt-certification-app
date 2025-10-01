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

import { dereferenceOpenRPC } from '../../src/utils/Utils';
import { getschemaValidationDone } from '../../src/utils/Utils';

const mockFireboltExampleInvoker = {
  invoke: () => {},
};
jest.mock('../../src/FireboltExampleInvoker', () => {
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
  };
});

jest.mock('@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
  return {
    send: () => {
      return {};
    },
  };
});

// Mock the logger module
jest.mock('../../src/utils/Logger', () => {
  const loggerMock = {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
  return jest.fn(() => loggerMock);
});

describe('Utils test cases', () => {
  test('validate dereferenceOpenRPC', async () => {
    await dereferenceOpenRPC('core');
  });
  test('validate dereferenceOpenRPC', async () => {
    await dereferenceOpenRPC('manage');
  });
  test('validate dereferenceOpenRPC', async () => {
    await dereferenceOpenRPC('discovery');
  });
  test('validate getschemaValidationDone', async () => {
    const name = 'lifecycle.onForeground';
    const response = { state: 'foreground', previous: 'inactive' };
    const sdkType = 'core';
    await getschemaValidationDone(name, response, sdkType);
  });
});
