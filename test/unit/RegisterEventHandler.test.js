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

import RegisterEventHandler from '../../src/pubsub/handlers/RegisterEventHandler';

jest.mock('../../src/pubsub/handlers/BaseHandler', () => {
  return jest.fn().mockImplementation(() => {});
});

jest.mock('../../src/EventInvocation', () => {
  return {
    EventInvocation: jest.fn().mockImplementation(() => {
      return {
        northBoundEventHandling: (message) => {
          return {
            jsonrpc: '2.0',
            result: {
              listening: true,
              event: message.params.event,
            },
            id: 1,
          };
        },
      };
    }),
  };
});

let registerEventHandler;

describe('RegisterEventHandler', () => {
  beforeEach(() => {
    registerEventHandler = new RegisterEventHandler();
  });

  describe('handle', () => {
    test('validate sdktype is handled correctly - CORE', async () => {
      const message = {
        task: 'registerEvent',
        params: {
          event: 'accessibility.onClosedCaptionsSettingsChanged',
        },
        context: { communicationMode: 'SDK' },
      };
      const responseString = await registerEventHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      const response = JSON.parse(responseString);
      expect(response.result.event).toEqual(message.params.event);
      expect(process.env.COMMUNICATION_MODE).toEqual(message.context.communicationMode);
    });
    test('validate sdktype is handled correctly - MANAGE', async () => {
      const message = {
        task: 'registerEvent',
        params: {
          event: 'manage_accessibility.onClosedCaptionsSettingsChanged',
        },
      };
      const responseString = await registerEventHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      const response = JSON.parse(responseString);
      expect(response.result.event).toEqual(message.params.event);
    });
    test('validate sdktype is handled correctly - no match found', async () => {
      const message = {
        task: 'registerEvent',
        params: {
          event: 'extension_accessibility.onClosedCaptionsSettingsChanged',
        },
      };
      const responseString = await registerEventHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      const response = JSON.parse(responseString);
      expect(response.error.code).toEqual('FCA Error');
      expect(response.error.message).toEqual("Not supported. sdkType 'extension' not in ['core','manage']");
    });
  });
});
