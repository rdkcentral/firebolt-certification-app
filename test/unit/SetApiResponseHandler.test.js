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

import SetApiResponseHandler from '../../src/pubsub/handlers/setApiResponseHandler';

jest.mock('../../src/pubsub/handlers/BaseHandler', () => {
  return jest.fn().mockImplementation(() => {});
});

let setApiResponseHandler;

describe('CallMethodHandler Test Case', () => {
  beforeEach(async () => {
    setApiResponseHandler = new SetApiResponseHandler();
  });
  test('handle pinchallenge', async () => {
    const message = {
      params: {
        apiResponse: {
          module: 'pinchallenge',
          attributes: [
            {
              pinText: 1111,
              isCancelled: false,
              withUi: false,
              maxAttempts: 3,
              noPinRequired: false,
            },
          ],
        },
      },
    };
    const responseString = await setApiResponseHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
  });
  test('handle keyboard', async () => {
    const message = {
      params: {
        apiResponse: {
          module: 'keyboard',
          attributes: [{ ApiText: 'abc@email.com', isCancelled: false, withUi: false }],
        },
      },
    };
    const responseString = await setApiResponseHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
  });
  test('handle federateddata', async () => {
    const message = {
      params: {
        apiResponse: {
          module: 'federateddata',
          attributes: [{ scenario: false, purchasedContentTestCase: 'WITHOUT_TOTALCOUNT' }],
        },
      },
    };
    const responseString = await setApiResponseHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
  });
});
