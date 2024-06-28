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

import { MethodInvoker } from '../../src/MethodInvoker';

const schemaList = {
  openrpc: '1.2.4',
  info: {
    title: 'mockSchema',
    version: '1.0.0',
  },
  methods: [
    {
      name: 'mockmodule.mockmethod',
      summary: 'Firebolt OpenRPC schema',
      params: [],
      result: {
        name: 'OpenRPC Schema',
        schema: {
          type: 'object',
        },
      },
    },
    {
      name: 'mockmodule.setmockmethod',
      params: [
        {
          name: 'value',
          required: true,
          schema: {
            type: 'boolean',
          },
        },
      ],
      result: {
        name: 'value',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Default Example',
          params: [
            {
              name: 'value',
              value: true,
            },
          ],
          result: {
            name: 'Default Result',
            value: null,
          },
        },
      ],
    },
    {
      name: 'mockmodule.onmodulechanged',
      params: [
        {
          name: 'listen',
          required: true,
          schema: {
            type: 'boolean',
          },
        },
      ],
      tags: [
        {
          name: 'event',
          'x-alternative': 'policy',
        },
        {
          name: 'capabilities',
          'x-uses': ['xrn:firebolt:capability:mock:mock'],
        },
      ],
      result: {
        name: 'default',
        schema: {
          anyOf: [
            {
              title: 'ListenResponse',
              type: 'object',
              required: ['event', 'listening'],
              properties: {
                event: {
                  type: 'string',
                  pattern: '[a-zA-Z]+\\.on[A-Z][a-zA-Z]+',
                },
                listening: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
            {
              title: 'EventResponse',
              type: 'object',
              properties: {
                mockProperty: {
                  title: 'mockProperty',
                  $comment: 'mockCapability',
                  type: 'string',
                },
              },
            },
          ],
        },
      },
      examples: [
        {
          name: 'Acknowledgement',
          params: [
            {
              name: 'listen',
              value: true,
            },
          ],
          result: {
            name: 'Default Result',
            value: {
              mockProperty: 'mockPropertyValue',
            },
          },
        },
      ],
    },
    {
      name: 'mockmodule1.mockmethod1',
      summary: 'Firebolt OpenRPC schema',
      params: [],
      result: {
        name: 'OpenRPC Schema',
        schema: {
          type: 'object',
        },
      },
    },
  ],
};

jest.mock('@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
  return {
    send: () => {
      return {};
    },
  };
});

const mockFireboltExampleInvoker = {
  invoke: jest.fn().mockImplementation(() => {
    return Promise.resolve('success');
  }),
};
const mockFireboltTransportInvoker = {
  invoke: jest.fn().mockImplementation(() => {
    return Promise.resolve('success');
  }),
};
jest.mock('../../src/FireboltExampleInvoker', () => {
  const mockModuleMap = {
    mocksdk: {
      mockmodule: {
        mockmethod: jest.fn(),
        setmockmethod: jest.fn(),
        listen: jest.fn(),
        clear: jest.fn(),
      },
      mockmodule2: {
        mockmethod2: jest.fn(),
      },
    },
  };
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
    MODULE_MAP: mockModuleMap,
  };
});

jest.mock('../../src/utils/Utils', () => {
  const originalUtils = jest.requireActual('../../src/utils/Utils');
  return {
    ...originalUtils,
    dereferenceOpenRPC: jest.fn().mockImplementation(() => {
      return Promise.resolve([schemaList, 'mocksdk']);
    }),
    removeSetInMethodName: jest.fn().mockImplementation((method) => {
      if (method.includes('set')) return 'mockmethod';
      else return method;
    }),
    // handleAsyncFunction: jest.fn()
  };
});
jest.mock('../../src/FireboltTransportInvoker', () => {
  return {
    get: () => {
      return mockFireboltTransportInvoker;
    },
  };
});

let methodInvoker;
let result;

describe('MethodInvoker', () => {
  beforeEach(() => {
    process.env.COMMUNICATION_MODE = 'SDK';
    methodInvoker = new MethodInvoker();
  });

  describe('invoke', () => {
    test('validate MethodInvoker method with communicationMode Transport', async () => {
      process.env.COMMUNICATION_MODE = 'Transport';
      const MESSAGE_TRANSPORT = {
        task: 'callMethod',
        params: { method: 'mockmodule.mockmethod' },
        action: 'NA',
        context: { communicationMode: 'Transport' },
      };
      const expectedResult = { id: 1, result: 'success', jsonrpc: '2.0' };
      result = await methodInvoker.invoke(MESSAGE_TRANSPORT);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.result).toEqual(expectedResult.result); // will be Fail as the schema wont match. Schema expects object, return is string
    });
    test('should successfully handle set calls', async () => {
      process.env.COMMUNICATION_MODE = 'SDK';
      const message = {
        task: 'callMethod',
        params: { method: 'mocksdk_mockmodule.setmockmethod', methodParams: { value: true } },
        action: 'NA',
        context: { communicationMode: 'SDK' },
      };
      const expectedResponse = { id: 1, result: 'success', jsonrpc: '2.0' };
      result = await methodInvoker.invoke(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.result).toEqual(expectedResponse.result); // will return PASS as module and method exist as well as schema validation passes.
    });
    test('should return wrong method name when method not in sdk', async () => {
      process.env.COMMUNICATION_MODE = 'SDK';
      const message = {
        task: 'callMethod',
        params: {
          method: 'mocksdk_mockmodule.invalidMethod',
        },
        action: 'NA',
        context: { communicationMode: 'SDK' },
      };

      const expectedResponse = {
        id: 1,
        error: { code: -32601, message: 'Wrong Method Name' },
        jsonrpc: '2.0',
      };
      result = await methodInvoker.invoke(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.error).toEqual(expectedResponse.error); // will return result will be null.
    });

    test('validate MethodInvoker method which present in OPEN RPC but not imported to moduleMap/firebolt invoker', async () => {
      process.env.COMMUNICATION_MODE = 'Transport';
      const MESSAGE_TRANSPORT = {
        task: 'callMethod',
        params: { method: 'mockmodule1.mockmethod1' },
        action: 'NA',
        context: { communicationMode: 'Transport' },
      };
      const expectedResult = { id: 1, result: 'success', jsonrpc: '2.0' };
      result = await methodInvoker.invoke(MESSAGE_TRANSPORT);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.result).toEqual(expectedResult.result); // will be Fail as the schema wont match. Schema expects object, return is string
    });

    test('validate MethodInvoker method which is not present in OPEN RPC but present in moduleMap/firebolt invoker', async () => {
      process.env.COMMUNICATION_MODE = 'Transport';
      const MESSAGE_TRANSPORT = {
        task: 'callMethod',
        params: { method: 'mockmodule2.mockmethod2' },
        action: 'NA',
        context: { communicationMode: 'Transport' },
      };
      const expectedResult = { id: 1, result: 'success', jsonrpc: '2.0' };
      result = await methodInvoker.invoke(MESSAGE_TRANSPORT);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.result).toEqual(expectedResult.result); // will be Fail as the schema wont match. Schema expects object, return is string
    });
  });
});