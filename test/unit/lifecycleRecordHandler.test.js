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

import lifecycleRecordHandler from '../../src/pubsub/handlers/lifecycleRecordHandler';
require('dotenv').config();

jest.mock('../../src/pubsub/handlers/BaseHandler', () => {
  return jest.fn().mockImplementation(() => {});
});

jest.mock('../../src/LifeCycleHistoryV1', () => {
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
  };
});

let LifecycleRecordHandler;

describe('LifecycleRecordHandler Test Case', () => {
  beforeEach(async () => {
    LifecycleRecordHandler = new lifecycleRecordHandler('dataFetch');
    jest.resetModules();
    process.env.CURRENT_APPID = 'currentAppId';
  });
  test('When app id in request is not the same as the current appid', async () => {
    const message = {
      task: 'startLifecycleRecording',
      params: { appId: 'requestedAppId', params: [] },
      action: 'NA',
      appType: 'firebolt',
    };
    const responseString = await LifecycleRecordHandler.handle(message);
    console.log(process.env.CURRENT_APPID);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toContain(
      JSON.stringify({
        report: 'AppId ' + message.params.appId + ' passed does not match launched app ' + process.env.CURRENT_APPID,
      })
    );
  });
  test('When app id in request is the same as the current appid & request for startLifecycleRecording', async () => {
    const message = {
      task: 'startLifecycleRecording',
      params: { appId: 'currentAppId', params: [] },
      action: 'NA',
      appType: 'firebolt',
    };
    const responseString = await LifecycleRecordHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toContain(
      JSON.stringify({
        report: 'Lifecycle History Recording has been started for ' + message.params.appId,
      })
    );
    expect(process.env.enableLifecycleRecording).toEqual('true');
    console.log('From unit test due to undefined' + process.env.globalLifecycleHistory);
    expect(process.env.globalLifecycleHistory).toEqual(''); // though code goes through the [] assignment. when printed we see empty striing for globalLifecycleHistory
  });
  test('When app id in request is the same as the current appid & request for startLifecycleRecording', async () => {
    const message = {
      task: 'startLifecycleRecording',
      params: { appId: 'currentAppId', params: [] },
      action: 'NA',
      appType: 'firebolt',
    };
    const responseString = await LifecycleRecordHandler.handle(message);
    process.env.globalLifecycleHistory = '["initializing"]';
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toContain(
      JSON.stringify({
        report: 'Lifecycle History Recording has been started for ' + message.params.appId,
      })
    );
    expect(process.env.enableLifecycleRecording).toEqual('true');
    expect(process.env.globalLifecycleHistory).toEqual('["initializing"]');
  });
  test('When app id in request is the same as the current appid & request for stopLifecycleRecording', async () => {
    const message = {
      task: 'stopLifecycleRecording',
      params: { appId: 'currentAppId', params: [] },
      action: 'NA',
      appType: 'firebolt',
    };
    process.env.globalLifecycleHistory = '["initializing", "inactive", "foreground"]';
    const expectedrecordedHistory = {
      appId: 'currentAppId',
      history: '["initializing", "inactive", "foreground"]',
    };
    const responseString = await LifecycleRecordHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    expect(responseString).toContain(JSON.stringify({ report: expectedrecordedHistory }));
    expect(process.env.enableLifecycleRecording).toEqual('false');
    expect(process.env.globalLifecycleHistory).toEqual(''); // though code goes through assignment of []. When retrieved the value is empty string.
  });

  test('When task in request is faulty. //though this shouldnt happen in end to end case. ', async () => {
    const message = {
      task: 'stopLifecyceRecording',
      params: { appId: 'currentAppId', params: [] },
      action: 'NA',
      appType: 'firebolt',
    };
    process.env.globalLifecycleHistory = '["initializing", "inactive", "foreground"]';

    const responseString = await LifecycleRecordHandler.handle(message);
    console.log(expect.getState().currentTestName + ' : ' + responseString);
    expect(responseString).toBeTruthy();
    expect(responseString).toContain('report');
    const response = JSON.parse(responseString);
    expect(response.report.error.code).toEqual('FCAError');
    expect(response.report.error.message).toEqual('Invalid lifecycle record request');
  });
});
