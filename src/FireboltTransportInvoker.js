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

import Transport from '@firebolt-js/sdk/dist/lib/Transport';
import { CONSTANTS } from './constant';

let invokeManager, invokeProvider;
try {
  invokeManager = require('../plugins/FireboltExtensionInvoker').default.invokeManager;
  invokeProvider = require('../plugins/FireboltExtensionInvoker').default.invokeProvider;
} catch (err) {
  logger.error(`Unable to import additional invoker - ${err.message}`);
}

let instance = null;

export default class FireboltTransportInvoker {
  /**
   *
   * @returns {FireboltTransportInvoker}
   */
  static get() {
    if (instance == null) {
      instance = new FireboltTransportInvoker();
    }
    return instance;
  }

  async invoke(methodName, params, paramNamesArray, invoker = null) {
    const module = methodName.split('.')[0];
    const method = methodName.split('.')[1];
    if (paramNamesArray) {
      const jsonParams = {};
      // param name in array format.
      for (let i = 0; i < paramNamesArray.length; i++) {
        // For each param, construct json using param name and value
        jsonParams[paramNamesArray[i]] = params[i];
      }
      if (invoker == CONSTANTS.INVOKEPROVIDER) {
        return await invokeProvider.send(module, method, jsonParams);
      } else if (invoker == CONSTANTS.INVOKEMANAGER) {
        return await invokeManager.send(module, method, jsonParams);
      } else {
        return await Transport.send(module, method, jsonParams);
      }
    } else {
      throw Error('Could not find params for ' + methodName);
    }
  }
}
