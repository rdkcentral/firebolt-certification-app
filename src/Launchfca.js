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

import lng from '@lightningjs/core';
import { Discovery } from '@firebolt-js/sdk';
import { CONSTANTS } from './constant';
const logger = require('./utils/Logger')('Launchfca.js');

export default class Launchfca extends lng.Component {
  _init() {}

  set params(params) {
    const additionalParams = {
      params: { appId: params.appId },
      // TODO: Below is added if testoken and macaddress needs to be passed in intent.
      // "params" : {"appId": params.appId, "testtoken":"", "macaddress":""}
    };

    Discovery.launch(params.appId || CONSTANTS.APPID_FIRECERT, {
      action: 'search',
      context: { source: 'voice' },
      data: { query: JSON.stringify(additionalParams) },
    })
      .then((success) => {
        logger.info(success, 'launchapp');
      })
      .catch((error) => {
        logger.error(error, 'launchapp');
      });
  }
}
