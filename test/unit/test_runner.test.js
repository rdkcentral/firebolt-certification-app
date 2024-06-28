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

let MOCK_OPEN_RPC_DOC = {
  methods: [
    {
      name: 'account.id',
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
      name: 'account.uid',
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
const MOCK_OPEN_RPC_RESPONSE = { id: 18, result: {}, jsonrpc: '2.0' };
/**
 * This is the definition of the structure used by Validation view
 * to create the menu and also to show the result.
 * This will be wrapped/transfomed to mocha awesome structure
 * if the call is being invoked from Messnger.( Will be changed in FIRECET-72)
 */
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

jest.mock('@apidevtools/json-schema-ref-parser', () => {
  return {
    dereference: () => {
      return new Promise((resolve, reject) => {
        if (!mockShouldDereferencerFail) {
          resolve(MOCK_OPEN_RPC_DOC);
        } else {
          reject(new Error('Dereferencer Failure'));
        }
      });
    },
  };
});
/**
 * mock object used to emulate the response from
 * FireBoltExampleInvoker
 */
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
jest.mock('../../src/FireboltTransportInvoker', () => {
  return {
    get: () => {
      return mockFireboltTransportInvoker;
    },
  };
});
jest.mock('@firebolt-js/sdk', () => {
  return {
    Accessibility: {},
    Account: {},
    Advertising: {},
    Authentication: {},
    Device: {},
    Discovery: {},
    Keyboard: {},
    Lifecycle: {
      ready: () => {},
      state: () => {
        return 'initializing'; // dummy state value.
      }, // returning a Lifecycle.state object
      close: () => {},
      finish: () => {},
    },
    Localization: {},
    Metrics: {},
    Profile: {},
    Parameters: {},
    SecondScreen: {},
  };
});
jest.mock('../../src/pubsub/handlers/RegisterProviderHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'registered' })),
  }));
});
jest.mock('../../src/Toast', () => {
  const eventEmitter = {
    emit: jest.fn(),
  };

  return {
    eventEmitter: eventEmitter,
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
  pushReportToS3: () => {
    return 'restApiUrl';
  },
  censorData: () => {
    return 'censoredResponse';
  },
  dereferenceOpenRPC: (mode) => {
    if (mode == 'externalsdk') {
      return [EXTERNAL_SDK_MOCK_OPEN_RPC_DOC, mode.toLowerCase()];
    } else if (mode == 'core' || mode == 'manage') {
      return [MOCK_OPEN_RPC_DOC, mode.toLowerCase()];
    }
  },
}));

let mockShouldDereferencerFail = false;
let runner;
let result;
const navigation = '';

describe('Test_Runner test cases', () => {
  beforeEach(() => {
    runner = new Test_Runner();
    (runner.reportGenenration = jest.fn().mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolve('');
      });
    })),
      (runner.invokeLifecycleAPI = jest.fn().mockImplementationOnce((tempParams) => {
        if (tempParams.methodName == CONSTANTS.LIFECYCLE_METHOD_LIST[1]) {
          return 'initializing';
        } else {
          const mockLifecycleHistoryget = { _history: [{ someKey: 'someValue' }] };
          return mockLifecycleHistoryget;
        }
      }));
  });
  describe('northBoundSchemaValidationAndReportGeneration Scenarios', () => {
    test('Validate northBoundSchemaValidationAndReportGeneration(SDK) when OPEN RPC dereferece call fails', async () => {
      mockShouldDereferencerFail = true;
      result = await runner.northBoundSchemaValidationAndReportGeneration('SDK', navigation, mockvalidationViewObj);
      /** when the dereference fails it should not execute any api and the result list will have 0 elements  */
      expect(result.length).toEqual(0);
    });
    test('Validate northBoundSchemaValidationAndReportGeneration(CORE) with example with valid response from FireboltExapmpleInvoker', async () => {
      mockShouldDereferencerFail = false;
      // Mock a valid response coming back from the Firebolt Invoker
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(MOCK_OPEN_RPC_RESPONSE);

      result = await runner.northBoundSchemaValidationAndReportGeneration(CONSTANTS.CORE);
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
      expect(result[1].fullTitle).toEqual('account.uid.Getting the unique ID');
      expect(result[0].state).toEqual('passed');
    });
    test('Validate northBoundSchemaValidationAndReportGeneration(CORE) with a invalid schema response coming back from FireboltExampleInvoker', async () => {
      mockShouldDereferencerFail = false;
      // Mock an invalid schema response coming back from the Firebolt Invoker
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(null);

      result = await runner.northBoundSchemaValidationAndReportGeneration(CONSTANTS.CORE);
      /**
       * Since the mocked OPEN_RPC has 2 documents we will have 2 results
       */
      expect(result.length).toEqual(2);
      // Both results should have resulted in schema validation failure
      expect(result[0].state).toEqual('failed');
    });
    test('Validate northBoundSchemaValidationAndReportGeneration when invalid mode is passed', async () => {
      /** when the invalid mode is passed dereference fails it should not execute any api */
      mockShouldDereferencerFail = false;
      result = await runner.northBoundSchemaValidationAndReportGeneration('undefined', navigation, mockvalidationViewObj);
      expect(result.error).toEqual(CONSTANTS.NOTPERFORMED);
    });

    test('Validate northBoundSchemaValidationAndReportGeneration(CORE) with no example with valid response from FireboltExapmpleInvoker', async () => {
      mockShouldDereferencerFail = false;
      // Mock a valid response coming back from the Firebolt Invoker
      // Overriding MOCK_OPEN_RPC_DOC value for device module test

      MOCK_OPEN_RPC_DOC = {
        methods: [
          {
            name: 'device.uid',
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
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(MOCK_OPEN_RPC_RESPONSE);

      result = await runner.northBoundSchemaValidationAndReportGeneration(CONSTANTS.CORE);
      /**
       * Since the mocked OPEN_RPC has 2 documents we will have 2 results
       */
      expect(result.length).toEqual(1);
      const v = new Validator();
      const schemaMapResult = v.validate(result[0], CUSTOM_REPORT_STRUCTURE_SCHEMA);
      // This would make sure that the result json that is created is in valid strcuture
      // we are not bothered about the value in the json.
      expect(schemaMapResult.errors.length).toEqual(0);
      /**
       * Validate if the response title is populated correctly
       */
      expect(result[0].fullTitle).toEqual('device.uid');
      expect(result[0].code).toContain('Could not find an example for device.uid');
    });
    test('Validate northBoundSchemaValidationAndReportGeneration when module is device (schema and content validation from library)', async () => {
      /** when the module is device, content and schema validation would be done externally */
      mockShouldDereferencerFail = false;
      // Overriding MOCK_OPEN_RPC_DOC value for device module test
      MOCK_OPEN_RPC_DOC = {
        methods: [
          {
            name: 'device.id',
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
        ],
      };
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(MOCK_OPEN_RPC_RESPONSE);
      result = await runner.northBoundSchemaValidationAndReportGeneration(CONSTANTS.CORE, navigation, mockvalidationViewObj);
      const parsedCode = JSON.parse(result[0].code);
      // Schema validation is expected to fail as MOCK_OPEN_RPC_RESPONSE is not in the expected schema for device module
      expect(parsedCode.Schema).toEqual('Failed');
      // Content validation will be skipped when schema validation fails
      expect(parsedCode.Content).toEqual('Pending');

      // Reverting MOCK_OPEN_RPC_DOC to previous value
      MOCK_OPEN_RPC_DOC = {
        methods: [
          {
            name: 'rpc.discover',
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
            name: 'account.id',
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
      mockFireboltExampleInvoker.invoke = () => Promise.resolve(MOCK_OPEN_RPC_RESPONSE);

      result = await runner.northBoundSchemaValidationAndReportGeneration('externalSDK');
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
