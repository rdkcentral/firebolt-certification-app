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
import { Test_Runner } from 'Test_Runner';
const logger = require('../../utils/Logger')('LifecycleMethodHandler.js');
import { CONSTANTS } from '../../constant';

const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

export default class LifecycleMethodHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }
  async handle(message) {
    process.env.COMMUNICATION_MODE = message.context.communicationMode;
    const sdkInvokerInfo = new Test_Runner();
    try {
      const lifecycleApiResponse = await sdkInvokerInfo.invokeLifecycleAPI(message.params);
      if (process.env.STANDALONE == true) {
        return JSON.stringify({ report: lifecycleApiResponse });
      } else {
        return JSON.stringify(lifecycleApiResponse);
      }
    } catch (e) {
      const result = {
        responseCode: CONSTANTS.STATUS_CODE[1],
        error: { message: 'FCA in exception block: ' + e.message, code: 'FCAError' },
      };
      if (process.env.STANDALONE == true) {
        return JSON.stringify({ report: result });
      } else {
        return JSON.stringify(result);
      }
    }
  }
}
