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

import clearEventHandler from '../../src/pubsub/handlers/clearEventHandler';
import BaseHandler from '../../src/pubsub/handlers/BaseHandler';

jest.mock('../../src/EventInvocation', () => {
  return {
    EventInvocation: jest.fn().mockImplementation(() => {
      return {
        clearEventListeners: jest.fn().mockImplementation((event) => {
          if (event !== undefined) return true;
          else throw new Error('Event undefined error');
        }),
      };
    }),
  };
});

describe('clearEventHandler', () => {
  let clearEvent;
  beforeEach(async () => {
    jest.clearAllMocks();
    clearEvent = new clearEventHandler();
  });

  describe('constructor', () => {
    describe('constructor', () => {
      test('should inherit from BaseHandler', () => {
        expect(clearEvent instanceof BaseHandler).toBeTruthy();
      });
    });
  });

  describe('handle', () => {
    test('clearEventListener call & response', async () => {
      const message = {
        task: 'clearEventHandler',
        params: {
          event: 'accessibility.onClosedCaptionsSettingsChanged',
        },
      };
      const responseString = await clearEvent.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      expect(responseString).toEqual('{"report":true}');
    });
    test('Exception - no message in event', async () => {
      const message = {
        task: 'clearEventHandler',
        params: {
          method: 'accessibility.onClosedCaptionsSettingsChanged',
        },
      };
      const responseString = await clearEvent.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeTruthy();
      expect(responseString).toContain('report');
      const report = JSON.parse(responseString);
      expect(report.report.responseCode).toEqual(1); // indicating failure
      expect(report.report.error.code).toEqual('FCAError'); // indicating failure is within FCA app
      expect(report.report.error.message).toContain('FCA in exception block'); // indicating failure is within FCA app
    });
  });
});
