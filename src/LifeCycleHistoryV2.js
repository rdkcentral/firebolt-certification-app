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
require('dotenv').config();
import { BehaviorSubject } from 'rxjs';
import Transport from '@firebolt-js/sdk/dist/lib/Transport/index.mjs';
import { handleAsyncFunction } from './utils/Utils';
import FireboltTransportInvoker from './FireboltTransportInvoker';
import { CONSTANTS } from './constant';
const logger = require('./utils/Logger')('LifeCycleHistoryV2.js');

let instance = null;
let lifecycleValidation;

// To map lifecycle events to their corresponding state history
const EVENT_HISTORY_MAPPING = {
  onPause: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.PAUSED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.ACTIVE,
  },
  onResume: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.PAUSED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.SUSPENDED,
  },
  onStart: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.PAUSED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.INITIALIZING,
  },
  onActivate: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.ACTIVE,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.PAUSED,
  },
  onSuspend: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.SUSPENDED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.PAUSED,
  },
  onHibernate: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.HIBERNATED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.SUSPENDED,
  },
  onRestore: {
    state: CONSTANTS.LIFECYCLE_STATES_V2.SUSPENDED,
    previous: CONSTANTS.LIFECYCLE_STATES_V2.HIBERNATED,
  },
};

export default class LifecycleHistoryV2 {
  /**
   *
   * @returns {LifecycleHistoryV2}
   */
  static get() {
    if (instance == null) {
      instance = new LifecycleHistoryV2();
    }
    return instance;
  }

  constructor() {
    this._history = new BehaviorSubject([]);
  }

  async init(appInstance = null) {
    lifecycleValidation = process.env.LIFECYCLE_VALIDATION;

    const lifecycleEvents = [
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONPAUSE,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONRESUME,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONSTART,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONACTIVATE,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONSUSPEND,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONRESTORE,
      CONSTANTS.LIFECYCLE_EVENTS_V2.ONHIBERNATE,
    ];

    // Register all events in parallel and collect their IDs and promises
    const eventIdToNameMap = new Map();
    const registrations = await Promise.all(
      lifecycleEvents.map(async (eventName) => {
        const { id, promise } = await Transport.listen(CONSTANTS.LIFECYCLE, eventName, { listen: true });
        eventIdToNameMap.set(id, eventName);
        return { id, promise };
      })
    );

    // Check all promises for event registration errors
    for (const { id, promise } of registrations) {
      const result = await promise;
      if (result && result.message) {
        throw new Error(`Error registering lifecycle event: ${result.message}`);
      }
    }

    // Collect all registered IDs for filtering in the handler
    const registeredEventIds = registrations.map((reg) => reg.id);

    // Attach an event handler for all lifecycle events
    Transport.addEventEmitter((eventId, value) => {
      if (registeredEventIds.includes(eventId)) {
        const eventName = eventIdToNameMap.get(eventId);
        if (eventName) {
          this._recordHistory(value, eventName);
        }
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
      if (appLifecycle && typeof appLifecycle.ready === CONSTANTS) {
        // If such a lifecycle exists, call its 'ready' function.
        appLifecycle.ready();
      } else {
        // If no such lifecycle exists, call the default 'Lifecycle.ready()' function.
        const response = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(CONSTANTS.LIFECYCLE_METHODS_V2.READY.toLowerCase(), [], []));
      }
    }
  }

  async _recordHistory(triggeredEventValue, eventName) {
    // Use fallback if the value is null or missing required keys
    let eventPayload = triggeredEventValue;

    if (eventPayload == null) {
      eventPayload = EVENT_HISTORY_MAPPING[eventName];
      logger.info('Received lifecycle event ' + eventName, '_recordHistory');
    }

    if (eventPayload && eventPayload.state) {
      const h = this._history.getValue();
      h.push({
        event: eventPayload,
        source: eventPayload.source || 'n/a',
        timestamp: Date.now(),
      });
      this._history.next(h);

      if (process.env.enableLifecycleRecording) {
        process.env.globalLifecycleHistory.push({
          event: eventPayload,
          timestamp: Date.now(),
        });
      }
    }
  }

  get history() {
    return this._history;
  }
}
