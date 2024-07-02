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

import CallMethodHandler from '../../src/pubsub/handlers/CallMethodHandler';
import BaseHandler from '../../src/pubsub/handlers/BaseHandler';

jest.mock('../../src/MethodInvoker', () => {
  return {
    MethodInvoker: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockImplementation((message) => {
          switch (message.params.method) {
            case 'firebolt.mockMethod':
              return {
                id: 1,
                result: 'mockFireboltResult',
                jsonrpc: '2.0',
              };
            default:
              throw new Error('Firebolt error');
          }
        }),
      };
    }),
  };
});

jest.mock('externalInvokers', () => ({
  myExternalInvoker: function () {
    this.invoke = () =>
      Promise.resolve({
        id: 1,
        result: 'mockResult',
        jsonrpc: '2.0',
      });
  },
}));

describe('CallMethodHandler', () => {
  let callMethodHandler;
  const handlerName = 'test-handler';

  beforeEach(async () => {
    jest.clearAllMocks();
    callMethodHandler = new CallMethodHandler(handlerName);
  });

  describe('constructor', () => {
    test('should inherit from BaseHandler', () => {
      expect(callMethodHandler instanceof BaseHandler).toBeTruthy();
    });
  });

  describe('handle', () => {
    test('External invoker is invoked', async () => {
      const message = {
        task: 'callMethod',
        params: {
          method: 'myExternalInvoker.method',
          methodParams: {},
        },
        action: 'mockAction',
        context: {
          communicationMode: 'Transport',
        },
      };
      const responseString = await callMethodHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('result');
      const report = JSON.parse(responseString);
      expect(report.result).toEqual('mockResult');
    });
    test('Validate method invoker is invoked', async () => {
      const message = {
        task: 'callMethod',
        params: {
          method: 'firebolt.mockMethod',
          methodParams: {},
        },
        action: 'mockAction',
        context: {
          communicationMode: 'Transport',
        },
      };
      const responseString = await callMethodHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('result');
      const report = JSON.parse(responseString);
      expect(report.result).toEqual('mockFireboltResult');
    });
    test('Validate exception handling', async () => {
      const message = {
        task: 'callMethod',
        params: {
          method: 'invalidInvoker.invalidMethod',
          methodParams: {},
        },
        context: {
          communicationMode: 'Transport',
        },
      };
      const responseString = await callMethodHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      const report = JSON.parse(responseString);
      expect(report.error.code).toEqual('FCAError'); // indicating failure is within FCA app
      expect(report.error.message).toContain('FCA in exception block'); // indicating failure is within FCA app
    });
  });
});
