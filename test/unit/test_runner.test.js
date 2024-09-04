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

import { Test_Runner } from '../../src/Test_Runner';
import { CONSTANTS } from '../../src/constant';
const Validator = require('jsonschema').Validator;
/**
 * This is a moc stucture of the actual OPEN RPC document
 * returned by Firebolt SDK. We are just keeping 2 methods and its
 * schema as the intention is to unit test the northBoundSchemaValidationAndReportGeneration
 * and its behavior. We dont need the full OPEN RPC DOC
 */

const MOCK_OPEN_RPC_DOC = {
  methods: [
    {
      name: 'Account.id',
      summary: 'Firebolt OpenRPC schema',
      params: [],
      result: {
        name: 'id',
        summary: 'the id',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Default Example',
          params: [],
          result: {
            name: 'Default Result',
            value: '123',
          },
        },
      ],
    },
    {
      name: 'Account.uid',
      summary: 'Gets a unique id for the current app & account',
      params: [],
      result: {
        name: 'uniqueId',
        summary: 'a unique ID',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the unique ID',
          params: [],
          result: {
            name: 'Default Result',
            value: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
          },
        },
      ],
    },
    {
      name: 'Device.id',
      summary: 'Get the platform back-office device identifier',
      params: [],
      result: {
        name: 'id',
        summary: 'the id',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Default Example',
          params: [],
          result: {
            name: 'Default Result',
            value: '123',
          },
        },
      ],
    },
    {
      name: 'Device.platform',
      summary: 'Get the platform ID for this device',
      params: [],
      result: {
        name: 'platformId',
        summary: 'the platform ID',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the platform ID',
          params: [],
          result: {
            name: 'Default Result',
            value: 'WPE',
          },
        },
      ],
    },
    {
      name: 'Device.uid',
      summary: 'Gets a unique id for the current app & device',
      params: [],
      result: {
        name: 'uniqueId',
        summary: 'a unique ID',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the unique ID',
          params: [],
          result: {
            name: 'Default Result',
            value: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
          },
        },
      ],
    },
    {
      name: 'Device.distributor',
      summary: 'Get the distributor ID for this device',
      params: [],
      result: {
        name: 'distributorId',
        summary: 'the distributor ID',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the distributor ID',
          params: [],
          result: {
            name: 'Default Result',
            value: 'Company',
          },
        },
      ],
    },
    {
      name: 'Device.type',
      summary: 'Get the device type',
      params: [],
      result: {
        name: 'deviceType',
        summary: 'the device type',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the device type',
          params: [],
          result: {
            name: 'Default Result',
            value: 'STB',
          },
        },
      ],
    },
    {
      name: 'Device.model',
      summary: 'Get the device model',
      params: [],
      result: {
        name: 'model',
        summary: 'the device model',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the device model',
          params: [],
          result: {
            name: 'Default Result',
            value: 'xi6',
          },
        },
      ],
    },
    {
      name: 'Device.sku',
      summary: 'Get the device sku',
      params: [],
      result: {
        name: 'sku',
        summary: 'the device sku',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the device sku',
          params: [],
          result: {
            name: 'Default Result',
            value: 'AX061AEI',
          },
        },
      ],
    },
    {
      name: 'Device.make',
      summary: 'Get the device make',
      params: [],
      result: {
        name: 'make',
        summary: 'the device make',
        schema: {
          type: 'string',
        },
      },
    },
    {
      name: 'Device.hdcp',
      summary: 'Get the supported HDCP profiles',
      params: [],
      tags: [
        {
          name: 'property:readonly',
        },
        {
          name: 'capabilities',
          'x-uses': ['xrn:firebolt:capability:device:info'],
        },
      ],
      result: {
        name: 'supportedHdcpProfiles',
        summary: 'the supported HDCP profiles',
        schema: {
          type: 'object',
          additionalProperties: {
            type: 'boolean',
          },
        },
      },
      examples: [
        {
          name: 'Getting the supported HDCP profiles',
          params: [],
          result: {
            name: 'Default Result',
            value: {
              'hdcp1.4': true,
              'hdcp2.2': true,
            },
          },
        },
      ],
    },
    {
      name: 'Accessibility.onClosedCaptionsSettingsChanged',
      summary: "Get the user's preferred closed-captions settings",
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
          name: 'subscriber',
          'x-subscriber-for': 'Accessibility.closedCaptionsSettings',
        },
        {
          name: 'event',
          'x-alternative': 'closedCaptionsSettings',
        },
        {
          name: 'capabilities',
          'x-uses': ['xrn:firebolt:capability:accessibility:closedcaptions'],
        },
      ],
      result: {
        name: 'closedCaptionsSettings',
        summary: 'the closed captions settings',
        schema: {
          anyOf: [
            {
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
              type: 'object',
              required: ['enabled', 'styles'],
              properties: {
                enabled: {
                  type: 'boolean',
                  description: 'Whether or not closed-captions should be enabled by default',
                },
                styles: {
                  type: 'object',
                  description: 'The default styles to use when displaying closed-captions',
                },
                preferredLanguages: {
                  type: 'array',
                  items: {
                    type: 'string',
                    pattern: '^[a-z]{3}$',
                  },
                },
              },
            },
          ],
        },
      },
      examples: [
        {
          name: 'Getting the closed captions settings',
          params: [
            {
              name: 'listen',
              value: true,
            },
          ],
          result: {
            name: 'settings',
            value: {
              enabled: true,
              styles: {
                fontFamily: 'monospaced_sanserif',
                fontSize: 1,
                fontColor: '#ffffff',
                fontEdge: 'none',
                fontEdgeColor: '#7F7F7F',
                fontOpacity: 100,
                backgroundColor: '#000000',
                backgroundOpacity: 100,
                textAlign: 'center',
                textAlignVertical: 'middle',
                windowColor: 'white',
                windowOpacity: 50,
              },
              preferredLanguages: ['eng', 'spa'],
            },
          },
        },
      ],
    },
  ],
};

const mockResponses = {
  'Account.id': '123',
  'Account.uid': undefined,
  'Device.platform': { error: 'capability xrn:firebolt:capability:platformn is not supported' },
  'Device.uid': { error: { code: -32601, message: 'Method not found' } },
  'Device.distributor': { code: -50100, message: 'capability xrn:firebolt:capability:token:session is not supported' },
  'Device.type': { error: { message: 'capability xrn:firebolt:capability:Localization.locality is not supported' } },
  'Device.model': { error: { code: -32601, message: 'capability xrn:firebolt:capability:platformn is not supported' } },
  'Device.sku': { error: { code: -32601, message: 'Method not found' } },
  'Device.make': 'Arris',
  'De vice.hdcp': { 'hdcp1.4': true, 'hdcp2.2': true },
  'Accessibility.onClosedCaptionsSettingsChanged': 'Successful accessibility.listen(closedCaptionsSettingsChanged)',
};

const EXTERNAL_SDK_MOCK_OPEN_RPC_DOC = {
  methods: [
    {
      name: 'invoker.mockid',
      summary: 'Firebolt OpenRPC schema',
      params: [],
      result: {
        name: 'id',
        summary: 'the id',
        schema: {
          type: 'object',
        },
      },
      examples: [
        {
          name: 'Default Example',
          params: [],
          result: {
            name: 'Default Result',
            value: '123',
          },
        },
      ],
    },
    {
      name: 'invoker.mockUid',
      summary: 'Gets a unique id for the current app & account',
      params: [],
      result: {
        name: 'uniqueId',
        summary: 'a unique ID',
        schema: {
          type: 'string',
        },
      },
      examples: [
        {
          name: 'Getting the unique ID',
          params: [],
          result: {
            name: 'Default Result',
            value: 'ee6723b8-7ab3-462c-8d93-dbf61227998e',
          },
        },
      ],
    },
  ],
};

const CUSTOM_REPORT_STRUCTURE_SCHEMA = {
  type: 'object',
  properties: {
    apiTitle: { type: 'string' },
    title: { type: 'string' },
    fullTitle: { type: 'string' },
    duration: { type: 'number' },
    state: { type: 'string' },
    pass: { type: 'boolean' },
    fail: { type: 'boolean' },
    code: { type: 'string' },
    err: { type: 'object' },
    uuid: { type: 'string' },
    parentUUID: { type: 'string' },
    timedOut: { type: 'boolean' },
    speed: { type: 'string' },
    pending: { type: 'boolean' },
    context1: { type: 'string' },
    isHook: { type: 'boolean' },
    skipped: { type: 'boolean' },
  },
};

jest.mock('@apidevtools/json-schema-ref-parser', () => ({
  dereference: () =>
    new Promise((resolve, reject) => {
      if (!mockShouldDereferencerFail) {
        resolve(MOCK_OPEN_RPC_DOC);
      } else {
        reject(new Error('Dereferencer Failure'));
      }
    }),
}));

const mockFireboltExampleInvoker = {
  invoke: jest.fn((sdk, methodName, params) => {
    return new Promise((resolve, reject) => {
      if (mockResponses.hasOwnProperty(methodName)) {
        const response = mockResponses[methodName];
        if (response && response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      } else {
        resolve({});
      }
    });
  }),
};

jest.mock('../../src/FireboltExampleInvoker', () => ({
  get: () => mockFireboltExampleInvoker,
}));

jest.mock('@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => ({
  send: jest.fn().mockReturnValue({}),
}));

jest.mock('../../src/FireboltTransportInvoker', () => ({
  get: () => mockFireboltTransportInvoker,
}));

jest.mock('@firebolt-js/sdk', () => ({
  Accessibility: {},
  Account: {},
  Advertising: {},
  Authentication: {},
  Device: {},
  Discovery: {},
  Keyboard: {},
  Lifecycle: {
    ready: jest.fn(),
    state: jest.fn().mockReturnValue('initializing'),
    close: jest.fn(),
    finish: jest.fn(),
  },
  Localization: {},
  Metrics: {},
  Profile: {},
  Parameters: {},
  SecondScreen: {},
}));

jest.mock('../../src/pubsub/handlers/RegisterProviderHandler', () =>
  jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'registered' })),
  }))
);

jest.mock('../../src/Toast', () => {
  const eventEmitter = { emit: jest.fn() };
  return {
    eventEmitter,
    showToast: (toastMessage, toastState, toastRef) => {
      eventEmitter.emit('showToast', toastMessage, toastState, toastRef);
    },
  };
});

const mockvalidationViewObj = {
  fetchResult: () => {},
};

jest.mock('../../src/utils/Utils', () => ({
  ...jest.requireActual('../../src/utils/Utils'),
  pushReportToS3: jest.fn().mockReturnValue('restApiUrl'),
  censorData: jest.fn((method, response) => {
    return response;
  }),
  dereferenceOpenRPC: jest.fn((mode) => {
    if (mode === 'externalsdk') {
      return [EXTERNAL_SDK_MOCK_OPEN_RPC_DOC, mode.toLowerCase()];
    } else if (mode === 'core' || mode === 'manage') {
      return [MOCK_OPEN_RPC_DOC, mode.toLowerCase()];
    }
  }),
}));

jest.mock('lodash', () => ({
  cloneDeep: jest.fn((value) => value),
}));

let mockShouldDereferencerFail = false;
let runner;
let result;
const navigation = '';
const INCLUDE_EVENT_METHODS = [];

jest.mock('../../src/MethodFilters', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    isExceptionMethod: jest.fn((methodName) => {
      const exceptionMethods = ['Device.distributor', 'Device.type', 'Device.model', 'Device.sku'];
      return exceptionMethods.includes(methodName);
    }),
    isMethodToBeExcluded: jest.fn((methodObject) => {
      const excludedMethodsList = ['Device.hdcp'];
      return excludedMethodsList.includes(methodObject.name);
    }),
    isRpcMethod: jest.fn(),
    isSubscribeMethod: jest.fn(),
    isSetMethod: jest.fn(),
    shouldExcludeExample: jest.fn(),
    isEventMethod: jest.fn((method) => {
      let isEvent = false;
      if (method.tags && INCLUDE_EVENT_METHODS.indexOf(method.name) === -1) {
        method.tags.forEach((tag) => {
          if (tag.name && tag.name === 'event') {
            isEvent = true;
          }
        });
      }
      return isEvent;
    }),
  })),
}));

describe('Test_Runner test cases', () => {
  beforeEach(() => {
    runner = new Test_Runner();
    runner.reportGenenration = jest.fn().mockResolvedValue('');
    runner.invokeLifecycleAPI = jest.fn().mockImplementation((tempParams) => {
      if (tempParams.methodName === CONSTANTS.LIFECYCLE_METHOD_LIST[1]) {
        return 'initializing';
      } else {
        return { _history: [{ someKey: 'someValue' }] };
      }
    });
  });

  describe('northBoundSchemaValidationAndReportGeneration Scenarios', () => {
    test('should return empty result when dereference call fails for SDK', async () => {
      mockShouldDereferencerFail = true;
      result = await runner.northBoundSchemaValidationAndReportGeneration('SDK');
      /** when the dereference fails it should not execute any api and the result list will have 0 elements  */
      expect(result.length).toEqual(0);
    });

    describe('northBoundSchemaValidationAndReportGeneration Scenarios for CORE', () => {
      beforeAll(async () => {
        result = await runner.northBoundSchemaValidationAndReportGeneration(CONSTANTS.CORE);
      });
      test('should return valid response for Account.id API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Account.id');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Passed');
        expect(extractedResult.code.Response.result).toBeDefined();
      });

      test('should fail for Account.uid API due to undefined response', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Account.uid');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response).toBeNull();
        expect(extractedResult.code.Message).toContain('No result or error in response.');
      });

      test('should handle different type of response for Device.id API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.id');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response.result).toBeDefined();
        expect(extractedResult.code.Message).toContain('instance.result is not of a type(s) string');
      });

      test('should handle unexpected error for Device.platform API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.platform');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response.error).toBeDefined();
        expect(extractedResult.code.Message).toContain('Unexpected error encountered in the response');
      });

      test('should handle unexpected error: "method not implemented" for Device.uid API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.uid');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response.error).toBeDefined();
        expect(extractedResult.code.Message).toContain('Method not implemented by platform');
      });

      test('should handle expecting error but received result for Device.distributor API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.distributor');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response.result).toBeDefined();
        expect(extractedResult.code.Message).toContain('Expected error, received result');
      });

      test('should handle expecting error but incorrect error format for Device.type API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.type');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Failed');
        expect(extractedResult.code.Response.error).toBeDefined();
        expect(extractedResult.code.Message).toContain('Expected error, incorrect error format');
      });

      test('should handle expected error but received error for Device.model API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.model');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Passed');
        expect(extractedResult.code.Response.error).toBeDefined();
        expect(extractedResult.code.Message).toContain('Expected error, received error');
      });

      test('should handle method not implemented error for Device.sku API', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.sku');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Passed');
        expect(extractedResult.code.Response.error).toBeDefined();
        expect(extractedResult.code.Message).toContain('Method not implemented by platform');
      });

      test('should skip validation for Device.make API due to missing example', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Device.make');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Skipped');
        expect(extractedResult.code.Response).toBeNull();
        expect(extractedResult.code.Message).toContain('Could not find an example for Device.make');
      });

      test('should return valid response for Accessibility.onClosedCaptionsSettingsChanged Event', async () => {
        const extractedResult = result.find((obj) => obj.title === 'Accessibility.onClosedCaptionsSettingsChanged');
        extractedResult.code = JSON.parse(extractedResult.code);
        expect(extractedResult.code['Schema Validation']).toEqual('Passed');
        expect(extractedResult.code.Response.result).toBeDefined();
      });
    });

    test('should return error when invalid mode is passed', async () => {
      mockShouldDereferencerFail = false;
      result = await runner.northBoundSchemaValidationAndReportGeneration('undefined', navigation, mockvalidationViewObj);
      expect(result.error).toEqual(CONSTANTS.NOTPERFORMED);
    });
  });

  describe('UUID Generation Validation', () => {
    let firstuuid, seconduuid;
    test('validate uuid when generated two uuid are different', () => {
      firstuuid = runner.createUUID();
      seconduuid = runner.createUUID();
      expect(firstuuid).not.toEqual(seconduuid);
    });
    test('validate uuid when uuid having length 36', () => {
      result = runner.createUUID();
      expect(result).toHaveLength(36);
    });
    test('validate uuid when uuid not to be undefined', () => {
      result = runner.createUUID();
      expect(result).not.toBe(undefined);
    });
  });
  describe("Validation for lifecycle API's methods scenarios", () => {
    test('Validate the invoke lifecycle.ready() method in LifcyleValidation  ', async () => {
      mockShouldDereferencerFail = false;
      const tempParams = {
        mode: 'Lifecycle.validation',
        methodName: CONSTANTS.LIFECYCLE_METHOD_LIST[0],
      };
      result = await runner.invokeLifecycleAPI(tempParams);
      // There will not be any events in the history.
      expect(result).not.toBe(undefined);
      // validate if the result is of LifecylceHistory type and has an _history variable of array type.
      expect(result._history instanceof Array).toBe(true);
      expect(result._history).not.toBe(undefined);
      expect(result._history.length).toEqual(1);
    });
    test('Validate the invoke lifecycle.state() method in LifecylceValidation', async () => {
      mockShouldDereferencerFail = false;
      const tempParams = {
        mode: 'Lifecycle.validation',
        methodName: CONSTANTS.LIFECYCLE_METHOD_LIST[1],
      };
      const response = await runner.invokeLifecycleAPI(tempParams);
      expect(response).not.toBe(undefined);
      /*
       *We have mocked Lifecycle.state() to always returning initializing as the value.
       *The schema of Lifecycle.state() ,it is a LifecycleState object which is
       *basically a enum of type LifecycleState = 'initializing' | 'inactive' |
       *'background' | 'foreground' | 'suspended' | 'unloading'
       */
      expect(response).toBe('initializing');
    });

    test('Validate the invoke lifecycle.close() method in LifecycleValidation', async () => {
      mockShouldDereferencerFail = false;
      const tempParams = {
        mode: 'Lifecycle.validation',
        methodName: CONSTANTS.LIFECYCLE_METHOD_LIST[2],
        reason: 'userExit',
      };
      result = await runner.invokeLifecycleAPI(tempParams);
      expect(result).not.toBe(undefined);
      // validate if the result is of LifecylceHistory type and has an _history variable of array type.
      // This need to be mocked from LifecycleHistory.get().. the array can have 1 element
      expect(result._history instanceof Array).toBe(true);
      expect(result._history).not.toBe(undefined);
      expect(result._history.length).toEqual(1);
    });
    test('Validate the invoke lifecycle.history() method in LifecycleValidation ', async () => {
      const tempParams = {
        mode: 'Lifecycle.validation',
        methodName: CONSTANTS.LIFECYCLE_METHOD_LIST[4],
      };
      result = await runner.invokeLifecycleAPI(tempParams);
      expect(result).not.toBe(undefined);
      // validate if the result is of LifecylceHistory type and has an _history variable of array type.
      // This has been mocked from LifecycleHistory.get().. the array can have 1 element
      expect(result._history instanceof Array).toBe(true);
      expect(result._history).not.toBe(undefined);
      expect(result._history.length).toEqual(1);
    });
  });
  describe('Validate for external invoker sdk', () => {
    test('Validate northBoundSchemaValidationAndReportGeneration(externalSDK) with example with valid response from FireboltExapmpleInvoker', async () => {
      mockShouldDereferencerFail = false;
      // Mock a valid response coming back from the Firebolt Invoker
      mockFireboltExampleInvoker.invoke = () => Promise.resolve({ id: 18, result: {}, jsonrpc: '2.0' });

      result = await runner.northBoundSchemaValidationAndReportGeneration('externalSDK');
      console.log('result', result);
      /**
       * Since the mocked OPEN_RPC has 2 documents we will have 2 results
       */
      expect(result.length).toEqual(2);
      const v = new Validator();
      const schemaMapResult = v.validate(result[0], CUSTOM_REPORT_STRUCTURE_SCHEMA);
      // This would make sure that the result json that is created is in valid strcuture
      // we are not bothered about the value in the json.
      expect(schemaMapResult.errors.length).toEqual(0);
      /**
       * Validate if the response title is populated correctly
       */
      expect(result[1].fullTitle).toEqual('invoker.mockUid.Getting the unique ID');
    });
    test('Validate northBoundSchemaValidationAndReportGeneration(externalSDK) with a invalid schema response coming back from FireboltExampleInvoker', async () => {
      mockShouldDereferencerFail = false;
      // Mock an invalid schema response coming back from the Firebolt Invoker
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(null);

      result = await runner.northBoundSchemaValidationAndReportGeneration('externalSDK');
      /**
       * Since the mocked OPEN_RPC has 2 documents we will have 2 results
       */
      expect(result.length).toEqual(2);
      // Both results should have resulted in schema validation failure
      expect(result[0].state).toEqual('failed');
    });
  });
});
