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

import { EventInvocation } from '../../src/EventInvocation';
import { MODULE_MAP } from '../../src/FireboltExampleInvoker';
import Transport from 'Transport';

const schemaList = {
  openrpc: '1.2.4',
  info: {
    title: 'mockSchema',
    version: '1.0.0',
  },
  methods: [
    {
      name: 'mock.mockmethod',
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
      name: 'mockmodule.onnotsupported',
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
      name: 'mockmodule2.mockmethodwparam',
      tags: [
        {
          name: 'rpc-only',
        },
        {
          name: 'capabilities',
          'x-uses': ['xrn:firebolt:capability:mock:capability'],
        },
      ],
      params: [
        {
          name: 'version',
          required: true,
          schema: {
            title: 'SemanticVersion',
            type: 'object',
            properties: {
              mockSubProperty: {
                type: 'integer',
                minimum: 0,
              },
            },
            required: ['mockSubProperty'],
            additionalProperties: false,
          },
        },
      ],
      result: {
        name: 'session',
        schema: {
          type: 'object',
          required: ['version'],
          properties: {
            version: {
              type: 'object',
              properties: {
                mockSubProperty: {
                  type: 'integer',
                  minimum: 0,
                },
              },
              required: ['mockSubProperty'],
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      },
      examples: [
        {
          name: 'Default Example',
          params: [
            {
              name: 'version',
              value: {
                mockSubProperty: 1,
              },
            },
          ],
          result: {
            name: 'Default Result',
            value: {
              version: {
                mockSubProperty: 1,
              },
            },
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
      name: 'mockmodule.oninvalidschema',
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
      name: 'mockeventmodule.oneventmodulechanged',
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
          name: 'Keyboard',
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
  ],
};

process.env.IS_BIDIRECTIONAL_SDK = false;

// Mocking $abc library and its functions

const mockFireboltExampleInvoker = {
  invoke: () => {},
};

// Mock the logger module
jest.mock('../../src/utils/Logger', () => {
  const loggerMock = {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
  return jest.fn(() => loggerMock);
});

jest.mock('../../src/utils/Utils', () => {
  const originalUtils = jest.requireActual('../../src/utils/Utils');
  return {
    ...originalUtils,
    dereferenceOpenRPC: jest.fn().mockImplementation((sdk) => {
      console.log('incoming sdk to mock: ' + sdk);
      return [schemaList, 'mocksdk'];
    }),
  };
});

let currentCallback = null;
const eventList = [];
jest.mock('../../src/FireboltExampleInvoker', () => {
  let callId = 0;
  // Mock function to clear the event from eventList once after unregistering the event
  const clearFunction = jest.fn().mockImplementation((identifier) => {
    console.log('Cleared events');
  });

  const listenFunction = jest.fn().mockImplementation((eventName, callback) => {
    currentCallback = callback;
    console.log(eventName);
    if (eventName === 'invalidevent') {
      return Promise.reject({ code: '', message: 'Method not found' });
    } else if (eventName === 'notsupported') {
      return Promise.reject({ code: -52001, message: 'Method not supported' });
    } else if (eventName === 'invalidschema') {
      return Promise.resolve({ listen: 2 });
    } else {
      if (eventName === 'onmodulechanged') {
        eventName = 'mocksdk_mockmodule.' + eventName;
      } else {
        eventName = 'mocksdk_mockeventmodule.' + eventName;
      }
      callId++;
      const id = callId; // a mock ID value
      eventList.push(eventName + '-' + id);
      return Promise.resolve(id);
    }
  });
  // Create a mock implementation for modulemap

  const mockModuleMap = {
    mocksdk: {
      mockmodule: {
        listen: listenFunction,
        clear: clearFunction,
      },
      mockeventmodule: {
        listen: listenFunction,
        clear: clearFunction,
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

jest.mock('@firebolt-js/sdk', () => {
  return {
    Lifecycle: {
      ready: () => {},
      state: () => {
        return 'initializing'; // dummy state value.
      }, // returning a Lifecycle.state object
      close: () => {},
      finish: () => {},
    },
    Parameters: {},
  };
});

jest.mock('../../src/FireboltTransportInvoker', () => {
  return {
    get: () => {
      return mockFireboltTransportInvoker;
    },
  };
});

jest.mock('../../src/pubsub/handlers/RegisterProviderHandler', () => {
  return jest.fn().mockImplementation(() => ({
    AcknowledgeChallenge: jest.fn(),
    Keyboard: jest.fn(),
    PinChallenge: jest.fn(),
  }));
});

describe('EventInvocation', () => {
  describe('clearAllListeners', () => {
    let eventInvocation;
    beforeAll(() => {
      process.env.COMMUNICATION_MODE = 'SDK';
      eventInvocation = new EventInvocation();
    });
    test('should not throw errors when no listeners are reigstered', () => {
      // check no errors when no listeners are registered
      const result = eventInvocation.clearAllListeners();
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toBe('No active listeners');
      expect(MODULE_MAP.mocksdk.mockmodule.clear).not.toHaveBeenCalled();
    });

    test('should clear listeners registered - has one event registered', async () => {
      const eventParams = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      // register listener
      let result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result.id).toBeDefined();
      // check no errors when no listeners are registered
      result = eventInvocation.clearAllListeners();
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toBe('Cleared Listeners');
      expect(MODULE_MAP.mocksdk.mockmodule.clear).toHaveBeenCalled();
    });

    test('should clear listeners registered - register multiple event', async () => {
      const eventParams = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      // register listener
      let result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result.id).toBeDefined();
      // register second listener listener
      const eventParams1 = { params: { event: 'mocksdk_mockeventmodule.oneventmodulechanged' } };
      const response = await eventInvocation.northBoundEventHandling(eventParams1);
      expect(response.id).toBeDefined();
      // check no errors when no listeners are registered
      result = eventInvocation.clearAllListeners();
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(response));
      expect(result).toBe('Cleared Listeners');
      // expect(MODULE_MAP.mocksdk.mockmodule.clear).not.toHaveBeenCalled();
      expect(MODULE_MAP.mocksdk.mockmodule.clear).toHaveBeenCalled();
      expect(MODULE_MAP.mocksdk.mockeventmodule.clear).toHaveBeenCalled();
    });
  });
  describe('northBoundEventHandling and registerEvent', () => {
    let actualVersion;
    beforeAll(() => {
      jest.clearAllMocks();
      jest.resetModules();
      console.log('initializing eventInvocation');
      process.env.COMMUNICATION_MODE = 'SDK';
      eventInvocation = new EventInvocation();
    });
    beforeEach(() => {
      actualVersion = process.env.IS_BIDIRECTIONAL_SDK;
    });
    afterEach(() => {
      process.env.IS_BIDIRECTIONAL_SDK = actualVersion;
    });
    let eventInvocation;
    test('validate EventInvocation method and throw error for invalid event', async () => {
      const eventParams = { params: { event: 'onmodulechanged' } };
      const error = {
        error: {
          code: 'FCAError',
          message: "Error in northBoundEventHandling: Invalid event name format: onmodulechanged, expected format is 'moduleName.onEventName' or sdkType_moduleName.onEventName'",
        },
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result).toStrictEqual(error);
    });
    test('validate EventInvocation method and throw error for no event name', async () => {
      const eventParams = { params: { event: null } };
      const error = {
        error: {
          code: 'FCAError',
          message: 'Error in northBoundEventHandling: Invalid parameters: event name is required',
        },
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result).toStrictEqual(error);
    });
    test('validate EventInvocation method and throw error for params', async () => {
      const eventParams = { params: null };
      const error = {
        error: {
          code: 'FCAError',
          message: 'Error in northBoundEventHandling: Invalid parameters: event name is required',
        },
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result).toStrictEqual(error);
    });
    test('validate EventInvocation method and throw error module_map method not found', async () => {
      const eventParams = { params: { event: 'mocksdk.mockeventmodule1' } };
      const error = {
        jsonrpc: '2.0',
        id: null,
        error: 'Module mocksdk from sdk core does not exist.',
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result.error.message).toBe(error.error);
    });
    test('validate EventInvocation method and throw error module_map module not found', async () => {
      const eventParams = { params: { event: 'mocksdk1.mockeventmodule' } };
      const error = {
        jsonrpc: '2.0',
        id: null,
        error: 'Module mocksdk1 from sdk core does not exist.',
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      expect(result.error.message).toBe(error.error);
    });
    test('validate EventInvocation method with communicationMode SDK', async () => {
      const eventParams = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      const expectedResponse = {
        jsonrpc: '2.0',
        result: {
          listening: true,
          event: 'mocksdk_mockmodule.onmodulechanged',
        },
        id: 4,
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(MODULE_MAP.mocksdk.mockmodule.listen).toHaveBeenCalled();
      expect(result.id).toBeGreaterThan(0);
      expect(result.result).not.toBeNull();
      expect(result.result).toStrictEqual(expectedResponse.result);
    });

    test('should fail if not supported api returns a valid response and not error object', async () => {
      const eventParams = {
        params: { event: 'mocksdk_mockmodule.onmodulechanged', isNotSupportedApi: true },
      };
      const expectedResponse = {
        jsonrpc: '2.0',
        result: {
          listening: true,
          event: 'mocksdk_mockmodule.onmodulechanged',
        },
        id: 4,
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(MODULE_MAP.mocksdk.mockmodule.listen).toHaveBeenCalled();
      expect(result.error).toStrictEqual(expectedResponse.error);
    });

    test('should pass if not supported api returns an error object', async () => {
      const eventParams = {
        params: { event: 'mocksdk_mockmodule.onnotsupported' },
        isNotSupportedApi: true,
      };
      const expectedResponse = {
        jsonrpc: '2.0',
        error: {
          code: -52001,
          message: 'Method not supported',
        },
        id: 16,
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(MODULE_MAP.mocksdk.mockmodule.listen).toHaveBeenCalled();
      expect(result.error).toStrictEqual(expectedResponse.error);
    });

    test('validate invalid EventInvocation method with communicationMode SDK - Method not found', async () => {
      const eventParams = { params: { event: 'mocksdk_mockmodule.oninvalidevent' } };
      const expectedResponse = {
        jsonrpc: '2.0',
        error: {
          code: '',
          message: 'Method not found',
        },
        id: 16,
      };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(MODULE_MAP.mocksdk.mockmodule.listen).toHaveBeenCalled();
      expect(result.id).toBeNull();
      expect(result.error).toStrictEqual(expectedResponse.error);
    });

    test('validate getEventResponse method', async () => {
      const message = { params: { event: 'lifecycle.onForeground' } };
      await eventInvocation.getEventResponse(message);
    });

    // Check on how to mock the Gateway from firebolt v2 and use it in the test
    test('validate EventInvocation method with communicationMode Transport', async () => {
      process.env.COMMUNICATION_MODE = 'Transport';
      const eventParams = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      const expectedResponse = {
        jsonrpc: '2.0',
        result: {
          listening: true,
          event: 'mocksdk_mockmodule.onmodulechanged',
        },
        id: 1,
      };
      let eventtInvocationImport, transport;
      if (Transport.request == null) {
        // v1 events
        jest.mock('../../node_modules/@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
          let callId = 0;
          callId++;
          return {
            listen: jest.fn().mockImplementation(() => {
              console.log('Returning promise and id');
              const result = { id: callId, promise: Promise.resolve('success') };
              console.log('Returning result: ' + JSON.stringify(result));
              return result;
            }),
            send: jest.fn(),
            addEventEmitter: jest.fn(),
          };
        });
        process.env.IS_BIDIRECTIONAL_SDK = false;
        // re-import the modules after mocking it
        eventtInvocationImport = require('../../src/EventInvocation');
        transport = require('../../node_modules/@firebolt-js/sdk/dist/lib/Transport/index.mjs');
      } else {
        // v2 events
        jest.doMock('../../node_modules/@firebolt-js/sdk/dist/lib/Gateway/index.mjs', () => {
          let callId = 0;
          callId++;
          return {
            request: jest.fn().mockImplementation(() => {
              console.log('Returning promise and id');
              const result = { id: callId, promise: Promise.resolve('success') };
              console.log('Returning result: ' + JSON.stringify(result));
              return result;
            }),
            subscribe: jest.fn().mockImplementation((eventName, callBack) => {
              console.log('subscribe function called for event: ' + eventName);
            }),
          };
        });
        process.env.IS_BIDIRECTIONAL_SDK = true;
        // re-import the modules after mocking it
        eventtInvocationImport = require('../../src/EventInvocation');
        transport = require('../../node_modules/@firebolt-js/sdk/dist/lib/Gateway/index.mjs');
      }
      // re-import the modules after mocking it
      const eventInvocation = eventtInvocationImport.EventInvocation;
      const eventInvocationTest = new eventInvocation();
      const result = await eventInvocationTest.northBoundEventHandling(eventParams);
      if (transport.request == null) {
        expect(transport.listen).toHaveBeenCalled();
      } else {
        expect(transport.request).toHaveBeenCalled();
        expect(transport.subscribe).toHaveBeenCalled();
      }
    });
  });

  describe('clearEventListeners', () => {
    let eventInvocation;
    let actualVersion;
    beforeAll(() => {
      jest.clearAllMocks();
      jest.resetModules();
      console.log('initializing eventInvocation');
      process.env.COMMUNICATION_MODE = 'SDK';
      eventInvocation = new EventInvocation();
    });
    beforeEach(() => {
      actualVersion = process.env.IS_BIDIRECTIONAL_SDK;
    });
    afterEach(() => {
      process.env.IS_BIDIRECTIONAL_SDK = actualVersion;
    });
    test('should call clear on the eventName and return true', async () => {
      const event = 'mocksdk_mockmodule.onmodulechanged';
      const result = await eventInvocation.clearEventListeners(event);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toBe(true);
      expect(MODULE_MAP.mocksdk.mockmodule.clear).toHaveBeenCalledWith(event.split('.')[1].slice(2));
    });

    test('should return error on issues with event name', async () => {
      const event = 'onmodulechanged';
      const result = await eventInvocation.clearEventListeners(event);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('FCAError');
      expect(result.error.message).toBeDefined();
    });

    test('should return error on issues with event name', async () => {
      const event = 'mockmodule.modulechanged';
      const result = await eventInvocation.clearEventListeners(event);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.error).toBeDefined();
      expect(result.error.code).toBe('FCAError');
      expect(result.error.message).toBeDefined();
    });

    test('should clear listener by sending listen false when communication mode is transport', async () => {
      const event = 'mocksdk_mockmodule.onmodulechanged';
      process.env.COMMUNICATION_MODE = 'Transport';
      let eventInvocationImport, transportImport;
      if (Transport.request == null) {
        // v1 events
        jest.mock('../../node_modules/@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
          let callId = 0;
          callId++;
          return {
            send: jest.fn(),
          };
        });
        process.env.IS_BIDIRECTIONAL_SDK = false;
        // re-import the modules after mocking it
        eventInvocationImport = require('../../src/EventInvocation');
        transportImport = require('Transport');
      } else {
        // v2 events
        jest.doMock('../../node_modules/@firebolt-js/sdk/dist/lib/Gateway/index.mjs', () => {
          let callId = 0;
          callId++;
          return {
            request: jest.fn().mockImplementation(() => {
              console.log('Returning promise and id');
              const result = { id: callId, promise: Promise.resolve('success') };
              console.log('Returning result: ' + JSON.stringify(result));
              return result;
            }),
          };
        });
        process.env.IS_BIDIRECTIONAL_SDK = true;
        // re-import the modules after mocking it
        eventInvocationImport = require('../../src/EventInvocation');
        transportImport = require('Transport');
      }
      const eventInvocation = eventInvocationImport.EventInvocation;
      const eventInvocationTest = new eventInvocation();
      const result = await eventInvocationTest.clearEventListeners(event);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toBe(true);
      if (Transport.request == null) {
        expect(transportImport.send).toHaveBeenCalledWith('mockmodule', 'onmodulechanged', {
          listen: false,
        });
      } else {
        expect(transportImport.request).toHaveBeenCalledWith('mockmodule.onmodulechanged', {
          listen: false,
        });
      }
    });
  });

  describe('parseEventName', () => {
    let eventInvocation;
    beforeAll(async () => {
      jest.clearAllMocks();
      console.log('initializing eventInvocation');
      eventInvocation = new EventInvocation();
    });
    test('should return CORE as sdkType when only module.method is passed', () => {
      const [sdkType, module, eventMethodWithoutModule, eventName] = eventInvocation.parseEventNameAndModuleAndSDKType('mockModule.onMockMethod');
      expect(sdkType).toBe('core');
      expect(module).toBe('mockmodule');
      expect(eventMethodWithoutModule).toBe('onMockMethod');
      expect(eventName).toBe('mockMethod');
    });

    test('should return provided sdk as sdkType when  sdk_module.method is passed', () => {
      const [sdkType, module, eventMethodWithoutModule, eventName] = eventInvocation.parseEventNameAndModuleAndSDKType('mocksdk_mockModule.onMockMethod');
      expect(sdkType).toBe('mocksdk');
      expect(module).toBe('mockmodule');
      expect(eventMethodWithoutModule).toBe('onMockMethod');
      expect(eventName).toBe('mockMethod');
    });
  });

  describe('getEventResponse', () => {
    let result;
    let eventInvocation;
    let eventRegistrationID;
    beforeAll(async () => {
      process.env.COMMUNICATION_MODE = 'SDK';
      jest.clearAllMocks();
      console.log('initializing eventInvocation');
      eventInvocation = new EventInvocation();
      const eventParams = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      const result = await eventInvocation.northBoundEventHandling(eventParams);
      eventRegistrationID = result.id;
      console.log('printing received eventRegistrationId: ' + eventRegistrationID);
    });

    test('should return event object with null response - no event fired', async () => {
      const message = { params: { event: eventRegistrationID } };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
    });

    test('should return event object with response - single event fired', () => {
      currentCallback({ foo: 'bar1' });
      const message = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      const expectedResponse = {
        eventName: 'mocksdk_mockmodule.onmodulechanged',
        eventResponse: { foo: 'bar1' },
        eventTime: '2025-03-20T09:45:10.557Z',
      };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toMatchObject({
        eventName: expectedResponse.eventName,
        eventResponse: expectedResponse.eventResponse,
      });
      expect(result.eventTime).toBeDefined();
      expect(result.eventTime).toBeInstanceOf(Date);
    });

    test('should return event object with last response - multiple events fired', () => {
      currentCallback({ foo: 'bar2' });
      const message = { params: { event: 'mocksdk_mockmodule.onmodulechanged' } };
      const expectedResponse = {
        eventName: 'mocksdk_mockmodule.onmodulechanged',
        eventResponse: { foo: 'bar2' },
        eventTime: '2023-05-10T14:18:18.347Z',
      };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toMatchObject({
        eventName: expectedResponse.eventName,
        eventResponse: expectedResponse.eventResponse,
      });
      expect(result.eventTime).toBeDefined();
      expect(result.eventTime).toBeInstanceOf(Date);
    });

    test('should return only for said eventObject', () => {
      currentCallback({ foo: 'bar3' });
      const message = { params: { event: 'mockmodule.onEventChanged-1' } };
      const expectedResponse = { 'mockmodule.onEventChanged-1': null };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toStrictEqual(expectedResponse);
    });

    test('should return event object with null response - event not found', () => {
      const message = { params: { event: 'mocksdk_mockmodule.onEventChanged' } };
      const expectedResponse = { 'mocksdk_mockmodule.onEventChanged': null };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result).toStrictEqual(expectedResponse);
    });

    test('should return error - message has issue', () => {
      const message = { event: eventRegistrationID };
      const expectedResponse = {
        error: {
          code: 'FCAError',
          message: "Event response fetch error: Cannot read properties of undefined (reading 'event')",
        },
      };
      result = eventInvocation.getEventResponse(message);
      console.log(expect.getState().currentTestName + ' : ' + JSON.stringify(result));
      expect(result.error.code).toEqual(expectedResponse.error.code);
      expect(result.error.message).toBeDefined();
    });
  });
});
