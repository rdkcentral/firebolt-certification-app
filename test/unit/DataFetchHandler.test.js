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

import DataFetchHandler from '../../src/pubsub/handlers/DataFetchHandler';
import BaseHandler from '../../src/pubsub/handlers/BaseHandler';
require('dotenv').config();

jest.mock('../../src/pubsub/handlers/BaseHandler', () => {
  return jest.fn().mockImplementation(() => {});
});

describe('dataFetchHandler', () => {
  let dataFetchHandler;
  beforeEach(async () => {
    dataFetchHandler = new DataFetchHandler('dataFetch');
  });

  describe('constructor', () => {
    test('should inherit from BaseHandler', () => {
      expect(dataFetchHandler instanceof BaseHandler).toBeTruthy();
    });
  });

  describe('handle', () => {
    test('Return null', async () => {
      const message = {
        task: 'dataFetch',
        params: {
          data: {
            target: 'Ripple',
            sdk: '0.9.0',
          },
        },
      };
      const responseString = await dataFetchHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeFalsy();
      expect(process.env.deviceData).toEqual('{"target":"Ripple","sdk":"0.9.0"}');
    });
    test('Environment variable set check - no action', async () => {
      const message = {
        task: 'dataFetch',
        params: {
          deta: { invalid: 'request' },
        },
      };
      const expectedData = process.env.deviceData;
      const responseString = await dataFetchHandler.handle(message);
      console.log(expect.getState().currentTestName + ' : ' + responseString);
      expect(responseString).toBeFalsy();
      expect(process.env.deviceData).toEqual(expectedData);
    });
  });
});
