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
import { EventInvocation } from 'EventInvocation';
import { CONSTANTS } from '../../constant';

require('dotenv').config();

export default class clearEventHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    const eventInvokerInfo = new EventInvocation();
    let sdkType;
    if (message.params && message.params.event && message.params.event.includes('_')) {
      sdkType = message.params.event.split('_')[0].toLowerCase();
    }
    if (message.action != null && message.action != 'NA') {
      sdkType = message.action;
      process.env.SDK_TYPE = sdkType;
    }
    try {
      const validationReport = eventInvokerInfo.clearEventListeners(message.params.event);
      return JSON.stringify({ report: validationReport });
    } catch (e) {
      const result = {
        responseCode: CONSTANTS.STATUS_CODE[1],
        error: { message: 'FCA in exception block: ' + e.message, code: 'FCAError' },
      };
      return JSON.stringify({ report: result });
    }
  }
}
