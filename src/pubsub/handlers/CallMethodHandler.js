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
import { MethodInvoker } from '../../MethodInvoker';
import externalInvokers from 'externalInvokers';
import { CONSTANTS } from '../../constant';

require('dotenv').config();
export default class CallMethodHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    let invoker;
    const externalInvokerKey = Object.keys(externalInvokers).find((key) => message.params.method.includes(key));

    /*
      If message.params.method includes a key from the externalInvokers object,
      initiate a new instance of the class that is mapped to the key. 
      
      When message.params.method does not include a key from the externalInvokers object,
      the else statement will execute and a new instance of the MethodInvoker class will be
      created.
    */
    try {
      if (externalInvokerKey) {
        invoker = new externalInvokers[externalInvokerKey]();
      } else {
        invoker = new MethodInvoker();
      }

      process.env.TimeoutInMS = message.responseTimeout ? message.responseTimeout : null;
      // TODO: Need to correct after deciding the variable name for SDK 2.0
      if (process.env.FIREBOLT_V2 >= '2.0.0') {
        if (process.env.LIFECYCLE_VALIDATION == true) {
          message.context.communicationMode = CONSTANTS.TRANSPORT;
        }
      }

      const result = await invoker.invoke(message);
      if (process.env.STANDALONE == true) {
        return JSON.stringify({ report: result });
      } else {
        return JSON.stringify(result);
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
