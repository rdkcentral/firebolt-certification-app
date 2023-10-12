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

import GetEventResponse from '../../src/pubsub/handlers/GetEventResponse';

jest.mock('../../src/pubsub/handlers/BaseHandler', () => {
  return jest.fn().mockImplementation(() => {});
});

jest.mock('../../src/EventInvocation', () => {
  return {
    EventInvocation: jest.fn().mockImplementation(() => {
      return {
        getEventResponse: (message) => {
          if (message.params.event == null) {
            return { undefined: 'null' };
          } else {
            return { event: 'null' };
          }
        },
      };
    }),
  };
});

let getEventResponse;

describe('GetEventResponse Test Case', () => {
  beforeEach(() => {
    getEventResponse = new GetEventResponse();
  });

  test('Event response', async () => {
    const message = {
      task: 'getEventResponse',
      params: { event: 'advertising.onPolicyChanged-8' },
      action: 'NA',
      appType: 'firebolt',
    };
    const responseString = await getEventResponse.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toEqual('{"report":{"event":"null"}}');
  });

  test('Event response- when no event is passed', async () => {
    const message = { task: 'getEventResponse', params: {}, action: 'NA', appType: 'firebolt' };
    const responseString = await getEventResponse.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toEqual('{"report":{"undefined":"null"}}');
  });
});
