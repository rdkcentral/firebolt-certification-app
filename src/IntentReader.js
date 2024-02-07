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

// ************* Description *************
// * Establish WS connection and initialize report queue
// * Subscribe to topic and parse message
// * Call suitable validation method and generate report
// * Publish report to WS topic or publish jobId
// * Retreieve and publish report from queue if jobId is provided
// Script version : 0.1
// Date : 31 Jan 2022
// ************* End Description **********

import { CONSTANTS } from './constant';
import { eventEmitter } from './Toast';
require('dotenv').config();

import GetPubSubStatusHandler from './pubsub/handlers/GetPubSubStatusHandler';
import CallMethodHandler from './pubsub/handlers/CallMethodHandler';
import DataFetchHandler from './pubsub/handlers/DataFetchHandler';
import GetTestHandler from './pubsub/handlers/GetTestHandler';
import HealthCheckHandler from './pubsub/handlers/HealthCheckHandler';
import RunTestHandler from './pubsub/handlers/RunTestHandler';
import RegisterEventHandler from './pubsub/handlers/RegisterEventHandler';
import ClearEventListeners from './pubsub/handlers/ClearEventListeners';
import ClearEventHandler from './pubsub/handlers/clearEventHandler';
import SetApiResponseHandler from './pubsub/handlers/setApiResponseHandler';
import LifecycleRecordHandler from './pubsub/handlers/lifecycleRecordHandler';
import RegisterProviderHandler from './pubsub/handlers/RegisterProviderHandler';
import GetEventResponse from './pubsub/handlers/GetEventResponse';
import GetMethodResponseHandler from './pubsub/handlers/GetMethodResponseHandler';
import VisibilityStateHandler from '../src/pubsub/handlers/VisibilityStateHandler';

const logger = require('./utils/Logger')('IntentReader.js');

const handlers = {
  getPubSubStatus: new GetPubSubStatusHandler('getPubSubStatus'),
  getTest: new GetTestHandler('getTest'),
  runTest: new RunTestHandler('getPubSubStatus'),
  dataFetch: new DataFetchHandler('dataFetch'),
  registerEvent: new RegisterEventHandler('registerEvent'),
  clearAllListeners: new ClearEventListeners('clearAllListeners'),
  clearEventHandler: new ClearEventHandler('clearEventHandler'),
  setApiResponse: new SetApiResponseHandler('setApiResponseHandler'),
  registerProviderHandler: new RegisterProviderHandler('registerProviderHandler'),
  startLifecycleRecording: new LifecycleRecordHandler('startLifecycleRecording'),
  stopLifecycleRecording: new LifecycleRecordHandler('stopLifecycleRecording'),
  getEventResponse: new GetEventResponse('getEventResponse'),
  getMethodResponse: new GetMethodResponseHandler('getMethodResponse'),
  visibilityState: new VisibilityStateHandler('visibilityState'),
  [CONSTANTS.CALL_METHOD]: new CallMethodHandler(CONSTANTS.CALL_METHOD),
  [CONSTANTS.HEALTH_CHECK]: new HealthCheckHandler(CONSTANTS.HEALTH_CHECK),
};

export default class IntentReader {
  async processIntent(message) {
    // Get the topic to send the response to

    // if no task in the intent, then do nothing and return empty
    if (message.task === undefined) {
      return;
    }

    // Check for standalone and reportingId in the message and set them in process.env
    if ('standalone' in message) {
      process.env.STANDALONE = message.standalone;
    }

    if ('reportingId' in message) {
      process.env.REPORTINGID = message.reportingId;
    }

    if (message.metadata && message.metadata.target === 'MFOS') {
      process.env.MF_VALUE = true;
      process.env.PLATFORM = CONSTANTS.PLATFORM_MOCKOS;
    }

    const handler = handlers[message.task];
    if (handler === undefined) {
      logger.info('Undefined handler: ' + message.task);

      const responseString = JSON.stringify({
        error: `Invalid request. Provide valid method`,
      });
      return responseString;
    }
    // Invoke toast notification for received intent
    let toastMessage = CONSTANTS.INTENT_RECEIVED + message.task;
    eventEmitter.emit('showToast', toastMessage, CONSTANTS.TOAST_STATE, CONSTANTS.TOAST_REF);

    const responseString = await handler.handle(message);
    try {
      toastMessage = CONSTANTS.TASK_COMPL + message.task;
      eventEmitter.emit('showToast', toastMessage, CONSTANTS.TOAST_STATE_COMPL, CONSTANTS.TOAST_REF_COMPL, CONSTANTS.COMPL_COLOR);
    } catch (err) {
      // Invoke toast notification for failed handle
      eventEmitter.emit('showToast', CONSTANTS.INTENT_ERR, CONSTANTS.TOAST_STATE_COMPL, CONSTANTS.TOAST_REF_COMPL, CONSTANTS.ERR_COLOR);
    }

    console.log('Response String: ' + JSON.stringify(responseString));
    return responseString;
  }
}
