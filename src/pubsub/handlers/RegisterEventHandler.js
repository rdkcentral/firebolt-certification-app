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
import { EventInvocation } from 'EventInvocation';

require('dotenv').config();

export default class RegisterEventHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    const validationReport = await this.eventSwitchMode(message);
    if (process.env.STANDALONE == true) {
      return JSON.stringify({ report: validationReport });
    } else {
      return JSON.stringify(validationReport);
    }
  }

  async eventSwitchMode(message) {
    if (message.context) {
      process.env.COMMUNICATION_MODE = message.context.communicationMode;
    }
    const eventInvokerInfo = new EventInvocation();
    let sdkType;
    if (!message.params.event.includes('_')) {
      sdkType = CONSTANTS.CORE.toLowerCase();
    } else {
      sdkType = message.params.event.split('_')[0].toLowerCase();
    }
    if (message.action != null && message.action != 'NA') {
      sdkType = message.action;
      process.env.SDK_TYPE = sdkType;
    }

    let validatedMenu;
    // Switch creation for the type of invocation that needs to happen.
    if ([CONSTANTS.CORE.toLowerCase(), CONSTANTS.MANAGE.toLowerCase()].includes(sdkType)) {
      validatedMenu = await eventInvokerInfo.northBoundEventHandling(message);
    } else {
      validatedMenu = {
        error: {
          code: 'FCA Error',
          message: "Not supported. sdkType '" + sdkType + "' not in ['core','manage']",
        },
      };
    }
    return validatedMenu;
  }
}
