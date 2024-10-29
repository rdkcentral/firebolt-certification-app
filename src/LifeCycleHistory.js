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
import { getschemaValidationDone, getCurrentAppID } from './utils/Utils';
const logger = require('./utils/Logger')('LifeCycleHistory.js');
import FireboltExampleInvoker from './FireboltExampleInvoker';
import IntentReader from 'IntentReader';
import PubSubCommunication from './PubSubCommunication';

let instance = null;
let lifecycleValidation;

export default class LifecycleHistory {
  /**
   *
   * @returns {LifecycleHistory}
   */
  static get() {
    if (instance == null) {
      instance = new LifecycleHistory();
    }
    return instance;
  }

  constructor() {
    this._history = new BehaviorSubject([]);
  }

  async init(appInstance = null) {
    lifecycleValidation = process.env.LIFECYCLE_VALIDATION;
    await Lifecycle.listen('inactive', this._recordHistory.bind(this, 'Lifecycle.onInactive'));
    await Lifecycle.listen('foreground', this._recordHistory.bind(this, 'Lifecycle.onForeground'));
    Lifecycle.listen('background', this._recordHistory.bind(this, 'Lifecycle.onBackground'));
    Lifecycle.listen('suspended', this._recordHistory.bind(this, 'Lifecycle.onSuspended'));
    Lifecycle.listen('unloading', async (event) => {
      let schemaResult, validationResult;
      await getschemaValidationDone('Lifecycle.onUnloading', event, 'core').then((res) => {
        schemaResult = res;
      });
      if (schemaResult.errors.length > 0 || event == undefined) {
        validationResult = CONSTANTS.FAIL;
      } else {
        validationResult = CONSTANTS.PASS;
      }
      if (event && event.state) {
        const h = this._history.getValue();
        h.push({
          event: event,
          source: event.source || 'n/a',
          timestamp: Date.now(),
          schemaValidationStatus: validationResult,
        });
        this._history.next(h);
      }
      if (event && event.state && lifecycleValidation != 'true') {
        Lifecycle.finished();
      }
    });

    if (lifecycleValidation != 'true') {
      /* Require the lifecycle plugins directory, which returns an object
        where each key is a file name in the directory and each value is the 
        default export of that file.
      */
      const lifecyclePlugins = require('../plugins/lifecycle');

      /* Get the lifecycle for the current app type. For example, if
        process.env.APP_TYPE is 'foo', this will return the default export
        of the 'foo.js' file in the lifecycle plugins directory.
      */
      const appLifecycle = lifecyclePlugins[process.env.APP_TYPE];

      // Check if a lifecycle for the current app type exists and if it has a 'ready' function.
      if (appLifecycle && typeof appLifecycle === 'function') {
        // If such a lifecycle exists, call its 'ready' function.
        appLifecycle.ready();
      } else {
        // If no such lifecycle exists, call the default 'Lifecycle.ready()' function.
        Lifecycle.ready();
      }
    }
    // register for Discovery.onNavigateTo event
    Discovery.listen('navigateTo', async (event) => {
      logger.info('Printing onNavigate To event received: ' + JSON.stringify(event));

      try {
        if (event.data.query != undefined) {
          const intentReader = new IntentReader();
          const query = JSON.parse(event.data.query);

          // Establishing a pubSub connection if FCA receives an intent in the navigateTo event with the following parameters.
          if (query.params && query.params.appId && query.params.macaddress) {
            // PUBSUB_CONNECTION environment variable has a pubsub client instance and calls the isConnected function to check the Websocket status.
            if (!process.env.PUBSUB_CONNECTION || (process.env.PUBSUB_CONNECTION && !process.env.PUBSUB_CONNECTION.isConnected())) {
              process.env.APP_TYPE = query.params.appType ? query.params.appType.toLowerCase() : CONSTANTS.FIREBOLT_CONST;
              process.env.CURRENT_APPID = query.params.appId;
              process.env.MACADDRESS = query.params.macaddress;
              process.env.PUB_SUB_TOKEN = query.params.pubSubToken;
              console.log('2507 test log - query params pubsubtoken discovery navigateTo', process.env.PUB_SUB_TOKEN);
              const pubSubListenerCreation = new PubSubCommunication();
              const webSocketConnection = await pubSubListenerCreation.startWebSocket();
            }
          }
          if (query.task) {
            intentReader.processIntent(query);
          }
        }
      } catch (error) {
        logger.error(JSON.stringify(error), 'intentReader error');
      }
    });
  }

  async _recordHistory(eventName, event) {
    logger.info('Got lifecycle eventName' + JSON.stringify(eventName), '_recordHistory');
    logger.info('Got lifecycle event' + JSON.stringify(event), '_recordHistory');
    let schemaResult, validationResult;
    await getschemaValidationDone(eventName, event, 'core').then((res) => {
      schemaResult = res;
    });
    if (schemaResult.errors.length > 0 || event == undefined) {
      validationResult = CONSTANTS.FAIL;
    } else {
      validationResult = CONSTANTS.PASS;
    }
    if (event && event.state) {
      const h = this._history.getValue();
      h.push({
        event: event,
        source: event.source || 'n/a',
        timestamp: Date.now(),
        schemaValidationStatus: validationResult,
      });
      this._history.next(h);
      if (process.env.enableLifecycleRecording) {
        process.env.globalLifecycleHistory.push({
          event: event,
          timestamp: Date.now(),
        });
      }
    }
  }
  get history() {
    return this._history;
  }
}
