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

import BaseHandler from './BaseHandler';
import { CONSTANTS } from '../../constant';
const logger = require('../../utils/Logger')('lifecycleRecordHandler.js');

require('dotenv').config();

export default class LifecycleRecordHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    logger.info('Message in Lifecycle record handler: ' + message, 'handle');
    let reportstring;
    if (message.params.appId == process.env.CURRENT_APPID) {
      if (message.task == 'startLifecycleRecording') {
        logger.info('Starting lifecycle recording', 'handle');
        process.env.enableLifecycleRecording = true;
        if (!process.env.globalLifecycleHistory || process.env.globalLifecycleHistory) {
          process.env.globalLifecycleHistory = [];
        }
        reportstring = JSON.stringify({
          report: CONSTANTS.LIFECYCLE_RECORDING_STARTED + message.params.appId,
        });
      } else if (message.task == 'stopLifecycleRecording') {
        process.env.enableLifecycleRecording = false;
        const currentRecordedHistory = {
          appId: process.env.CURRENT_APPID,
          history: process.env.globalLifecycleHistory,
        };
        logger.info('Secondary history list to be sent: ' + currentRecordedHistory, 'handle');
        process.env.globalLifecycleHistory = [];
        logger.info('Secondary history list after clearing: ' + process.env.globalLifecycleHistory, 'handle');

        reportstring = JSON.stringify({ report: currentRecordedHistory });
      } else {
        const lifecycleRecordErrorMessage = {
          error: { code: 'FCAError', message: CONSTANTS.INVALID_LIFECYCLE_RECORD },
        };
        logger.info(lifecycleRecordErrorMessage, 'handle');
        reportstring = JSON.stringify({ report: lifecycleRecordErrorMessage });
      }
    } else {
      reportstring = JSON.stringify({
        report: 'AppId ' + message.params.appId + CONSTANTS.APPID_DOESNOT_MATCH + process.env.CURRENT_APPID,
      });
    }
    return reportstring;
  }
}
