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

import { Lifecycle, Parameters, Discovery } from '@firebolt-js/sdk';
import { BehaviorSubject } from 'rxjs';
require('dotenv').config();
import { CONSTANTS } from './constant';
import { getschemaValidationDone, getCurrentAppID, assignModuleCapitalization } from './utils/Utils';
const logger = require('./utils/Logger')('LifeCycleHistoryV2.js');
import FireboltExampleInvoker from './FireboltExampleInvoker';
import IntentReader from 'IntentReader';
import PubSubCommunication from './PubSubCommunication';

let instance = null;
let lifecycleValidation;

export default class LifeCycleHistoryV2 {
  /**
   *
   * @returns {LifeCycleHistoryV2}
   */
  static get() {
    if (instance == null) {
      instance = new LifeCycleHistoryV2();
    }
    return instance;
  }

  constructor() {
    this._history = new BehaviorSubject([]);
  }

  async init(appInstance = null) {
    // TODO: Lifecycle 2.0 changes go here
  };

}
