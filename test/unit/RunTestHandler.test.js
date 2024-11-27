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

import RunTestHandler from '../../src/pubsub/handlers/RunTestHandler';
import BaseHandler from '../../src/pubsub/handlers/BaseHandler';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-uuid') }));
jest.mock('dotenv', () => ({ config: jest.fn() }));

jest.mock('../../src/Test_Runner', () => {
  return {
    Test_Runner: jest.fn().mockImplementation(() => {}),
  };
});

jest.mock('@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
  return {
    send: () => {
      return {};
    },
  };
});

jest.mock('../../src/FireboltExampleInvoker', () => {
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
  };
});

jest.mock('../../src/utils/Utils', () => {
  return {
    getMethodExcludedListBasedOnMode: () => {
      return ['Mock.Method', 'module.mockMethod', 'event.onMockEvent'];
    },
  };
});

const methodsToBeExcluded = 'Mock.Method,module.mockMethod,event.onMockEvent';

describe('RunTestHandler', () => {
  let runTestHandler;
  const handlerName = 'test-handler';
  let message;

  beforeEach(() => {
    jest.clearAllMocks();
    runTestHandler = new RunTestHandler(handlerName);
    message = {
      context: {
        communicationMode: 'mock-mode',
      },
      metadata: {
        target: 'mock-target',
        fireboltVersion: '1.0.0',
        targetVersion: '2.0.0',
      },
    };
  });

  describe('constructor', () => {
    test('should inherit from BaseHandler', () => {
      expect(runTestHandler instanceof BaseHandler).toBeTruthy();
    });
  });

  describe('handle', () => {
    test('should call populateReportTitleValues', async () => {
      runTestHandler.populateReportTitleValues = jest.fn();

      await runTestHandler.handle(message);
      expect(runTestHandler.populateReportTitleValues).toHaveBeenCalledWith(message);
    });

    test('will not call populateReportTitleValues', async () => {
      message = {
        context: {
          communicationMode: 'mock-mode',
        },
      };
      runTestHandler.populateReportTitleValues = jest.fn();

      await runTestHandler.handle(message);
      expect(runTestHandler.populateReportTitleValues).not.toHaveBeenCalledWith(message);
    });

    test('should set environment values - Certification true & no Exception', async () => {
      message = {
        params: {
          certification: true,
          methodsToBeExcluded: ['methodfoo', 'methodbar'],
        },
        context: {
          communicationMode: 'mock-mode',
        },
      };
      runTestHandler.handle(message, false);
      expect(process.env.CERTIFICATION).toBe('true');
      expect(process.env.METHODS_TO_BE_EXCLUDED).toBe('methodfoo,methodbar');

      expect(process.env.EXCEPTION_METHODS).toBeFalsy();
    });

    test('should set environment values - no params', async () => {
      message = {
        context: {
          communicationMode: 'mock-mode',
        },
      };
      runTestHandler.handle(message, false);
      expect(process.env.CERTIFICATION).toBe('false');
      expect(process.env.METHODS_TO_BE_EXCLUDED).toBe(methodsToBeExcluded);
      expect(process.env.EXCEPTION_METHODS).toBeFalsy();
    });

    test('should set environment values - Cert is false & exception methods', async () => {
      message = {
        params: {
          certification: false,
          exceptionMethods: [{ method: 'authentication.token', param: { type: 'distributor' } }, { method: 'authentication.session' }],
        },
        context: {
          communicationMode: 'mock-mode',
        },
      };
      runTestHandler.handle(message, false);
      expect(process.env.CERTIFICATION).toBe('false');
      expect(process.env.EXCEPTION_METHODS).toBe('[object Object],[object Object]'); // need to check further on this one. doesnt seem right that the data cannot be parsed. Maybe the unit test is not passing the message correctly.
    });

    test('should set environment values - Cert is false', async () => {
      message = {
        params: {
          certification: false,
        },
        context: {
          communicationMode: 'mock-mode',
        },
      };
      runTestHandler.handle(message, false);
      expect(process.env.CERTIFICATION).toBe('false');
      expect(process.env.EXCEPTION_METHODS).toBe(''); // need to check further on this one. doesnt seem right that the data cannot be parsed. Maybe the unit test is not passing the message correctly.
    });
  });

  describe('populateReportTitleValues', () => {
    test('should set env variables for report title', () => {
      const responseString = runTestHandler.populateReportTitleValues(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(process.env.TARGET).toBe(message.metadata.target);
      expect(process.env.FIREBOLT_SDK_VERSION).toBe(message.metadata.fireboltVersion);
      expect(process.env.TARGET_VERSION).toBe(message.metadata.targetVersion);
      expect(process.env.MODE).toBe(message.context.communicationMode);
      expect(process.env.TARGET_PLATFORM).toBe(undefined);
    });

    /* test('should log error if there is an exception', () => {
             Object.defineProperty(process.env, "TARGET", { value: "test-target", writable: false });
             let responseString = runTestHandler.populateReportTitleValues(message);
             console.log(expect.getState().currentTestName + " : " + responseString)
 
             
             expect(logger).toHaveBeenCalled()
 
         });*/
  });

  describe('getValidationReport', () => {
    test('should set env variables for communication mode', () => {
      const responseString = runTestHandler.getValidationReport(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(process.env.COMMUNICATION_MODE).toBe(message.context.communicationMode);
    });
  });
});
