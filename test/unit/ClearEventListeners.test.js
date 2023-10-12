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

import ClearEventListeners from '../../src/pubsub/handlers/ClearEventListeners';
import BaseHandler from '../../src/pubsub/handlers/BaseHandler';

jest.mock('../../src/EventInvocation', () => {
  return {
    EventInvocation: jest.fn().mockImplementation(() => {
      return {
        clearAllListeners: jest.fn().mockImplementation(() => {
          return 'Cleared Listeners';
        }),
      };
    }),
  };
});

describe('clearEventListeners', () => {
  let clearEventListeners;
  const handlerName = 'test-handler';
  let message;
  beforeEach(async () => {
    clearEventListeners = new ClearEventListeners(handlerName);
    message = {
      task: 'clearEventListneners',
    };
  });

  describe('constructor', () => {
    test('should inherit from BaseHandler', () => {
      expect(clearEventListeners instanceof BaseHandler).toBeTruthy();
    });
  });

  describe('handle', () => {
    test('Validate clearEvent Listeners', async () => {
      const responseString = await clearEventListeners.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      expect(responseString).toContain('{"report":"Cleared Listeners"}');
    });
  });
});
