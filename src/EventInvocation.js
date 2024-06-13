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

// ************* Description *************
//   * Get message params
//   * Make event call- listen for that event
//   * Once after the set call get the event response and publish it back
//   * Return results of all the events
// ************* End Description **********

import { dereferenceOpenRPC, errorSchemaCheck, rpcEventHandler } from './utils/Utils';
import { MODULE_MAP } from './FireboltExampleInvoker';
import { CONSTANTS } from './constant';
import Transport from '@firebolt-js/sdk/dist/lib/Transport/index.mjs';

const Validator = require('jsonschema').Validator;
const validator = new Validator();
const eventHandlerMap = new Map();
const eventHistory = [];
const logger = require('./utils/Logger')('EventInvocation.js');

class EventHandler {
  constructor(moduleWithEventName, schemaList) {
    this.moduleWithEventName = moduleWithEventName;
    const event = moduleWithEventName.split('.')[1];
    this.eventName = this.parseEventName(event);
    if (process.env.STANDALONE == true) {
      this.eventSchema = this.getSchema(moduleWithEventName, schemaList);
    }
    this.initializationTime = new Date();
    this.eventListener = null;
  }
  // Parse shortened event name from 'module with event name'
  parseEventName(event) {
    const eventName = event.slice(2);
    return eventName.charAt(0).toLowerCase() + eventName.slice(1);
  }
  // Return short event name
  getEventName() {
    return this.eventName;
  }
  // Fetch schema from dereferenced RPC using event name
  getSchema(moduleWithEventName, schemaList) {
    let schemaMap = null;
    if (moduleWithEventName.includes('_')) {
      moduleWithEventName = moduleWithEventName.split('_')[1];
    }
    for (let methodIndex = 0; schemaList != undefined && schemaList.methods && methodIndex < schemaList.methods.length; methodIndex++) {
      const eventName = schemaList.methods[methodIndex].name;
      if (eventName.toLowerCase() == moduleWithEventName.toLowerCase()) {
        const methodObj = schemaList.methods[methodIndex];
        schemaMap = methodObj.result.schema;
      }
    }
    return schemaMap;
  }
  // Handle, parse and store the resolved event data from listener
  handleEvent(eventData) {
    let eventDataObject;
    if (process.env.STANDALONE == true) {
      const eventSchemaResponse = this.eventSchemaValidation(eventData);
      eventDataObject = {
        eventName: this.eventName,
        eventListenerId: this.eventListener.eventListenerId,
        eventResponse: eventData,
        eventSchemaResult: eventSchemaResponse,
        eventTime: new Date(),
      };
    } else {
      eventDataObject = {
        eventName: this.eventName,
        eventListenerId: this.eventListener.id,
        eventResponse: eventData,
        eventTime: new Date(),
      };
    }
    eventHistory.push(eventDataObject);
  }
  // Schema validation for resolved event data
  eventSchemaValidation(eventResponse) {
    const eventSchemaResult = {};
    if (this.eventSchema) {
      const validationResult = validator.validate(eventResponse, this.eventSchema);
      if (validationResult.errors && validationResult.errors.length > 0 && validationResult.errors[0].message) {
        eventSchemaResult['status'] = CONSTANTS.FAIL;
        eventSchemaResult['eventSchemaResult'] = validationResult.errors[0].message;
      } else {
        eventSchemaResult['status'] = CONSTANTS.PASS;
        eventSchemaResult['eventSchemaResult'] = validationResult.errors;
      }
    }
    return eventSchemaResult;
  }
  // Store listener data in object
  setEventListener(eventListener) {
    this.eventListener = eventListener;
  }
  // Return queried number of events from history
  getEventHistory(numberOfEvents) {
    return eventHistory.slice(-numberOfEvents);
  }
}

export class EventInvocation {
  // This method accepts the message params and return the listener response and schema response
  async northBoundEventHandling(message) {
    const eventParams = message.params;
    const moduleWithEventName = eventParams.event;
    const params = eventParams.params;
    const [listenerResponse, uniqueListenerKey] = await this.registerEvent(moduleWithEventName, params);

    const registrationResponse = {};
    if (process.env.STANDALONE == true) {
      registrationResponse['eventName'] = moduleWithEventName;
      registrationResponse['eventListenerId'] = uniqueListenerKey;
      if (listenerResponse && Number.isInteger(listenerResponse) && listenerResponse > 0) {
        registrationResponse['eventListenerResponse'] = {
          listenerResponse: listenerResponse,
          error: null,
        };
        // Handling not supported api to check error schema if it gives a valid response
        let schemaValidationResult = {};
        let schemaValidationStatus = CONSTANTS.PASS;
        if (message.params.isNotSupportedApi == true) {
          schemaValidationResult = errorSchemaCheck(listenerResponse, process.env.COMMUNICATION_MODE);
          schemaValidationStatus = CONSTANTS.FAIL;
        }
        registrationResponse['eventListenerSchemaResult'] = {
          status: schemaValidationStatus,
          eventSchemaResult: schemaValidationResult,
        };
        eventHandlerMap.get(uniqueListenerKey).setEventListener(registrationResponse);
      } else {
        if (CONSTANTS.ERROR_LIST.includes(listenerResponse.message)) {
          const responseCode = CONSTANTS.STATUS_CODE[3];
          registrationResponse['responseCode'] = responseCode;
        }
        registrationResponse['eventListenerResponse'] = { result: null, error: listenerResponse };
        // In case of error, validate error against errorschema
        const schemaValidationResult = errorSchemaCheck(listenerResponse, process.env.COMMUNICATION_MODE);
        if (schemaValidationResult && schemaValidationResult.errors && schemaValidationResult.errors.length > 0) {
          registrationResponse['eventListenerSchemaResult'] = {
            status: CONSTANTS.FAIL,
            eventSchemaResult: {},
          };
        } else {
          registrationResponse['eventListenerSchemaResult'] = {
            status: CONSTANTS.PASS,
            eventSchemaResult: schemaValidationResult,
          };
        }
      }
      return registrationResponse;
    } else {
      registrationResponse['jsonrpc'] = '2.0';
      registrationResponse['id'] = null;
      if (listenerResponse && Number.isInteger(listenerResponse) && listenerResponse > 0) {
        registrationResponse['id'] = listenerResponse;
        registrationResponse['result'] = {
          listening: true,
          event: moduleWithEventName,
        };
        eventHandlerMap.get(uniqueListenerKey).setEventListener(registrationResponse);
      } else {
        registrationResponse['error'] = listenerResponse;
      }
      return registrationResponse;
    }
  }

  // This method will listen to event and capture the event response after triggering
  async registerEvent(moduleWithEventName, params) {
    const paramlist = [];
    const [sdkType, module] = this.getSdkTypeAndModule(moduleWithEventName);
    const [schemaList, invokedSdk] = await dereferenceOpenRPC(sdkType);
    const EventHandlerObject = new EventHandler(moduleWithEventName, schemaList);
    const eventName = EventHandlerObject.getEventName();
    let eventRegistrationID;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        paramlist.push(params[key]);
      }
    }
    // To prevent uncaught exceptions when it received invalid eventName or module names.
    try {
      if (process.env.COMMUNICATION_MODE == CONSTANTS.TRANSPORT) {
        if (moduleWithEventName.includes('_')) {
          moduleWithEventName = moduleWithEventName.split('_')[1];
        }

        const { id, promise } = await this.registerEventInTransport(moduleWithEventName);
        const result = await promise;
        if (result && result.message) {
          throw result.message;
        }

        // Recieving Event Response
        const emit = (eventId, value) => {
          if (id == eventId && !CONSTANTS.EXCLUDED_VALUES.includes(value)) {
            EventHandlerObject.handleEvent(value);
          }
        };
        Transport.addEventEmitter(emit);
        eventRegistrationID = id;
      } else if (process.env.COMMUNICATION_MODE == CONSTANTS.SDK) {
        const resolvedModule = MODULE_MAP[sdkType][module];
        eventRegistrationID = await resolvedModule.listen(eventName, (result) => {
          if (!CONSTANTS.EXCLUDED_VALUES.includes(result)) {
            EventHandlerObject.handleEvent(result);
          }
        });
      }
    } catch (err) {
      logger.error('No listener Id :' + JSON.stringify(err), 'registerEvent');
      return [err, null];
    }

    // Construct unique key for event handler. A UUID can be added to the key to make it more unique.
    if (eventRegistrationID) {
      const eventNameWithoutSDK = moduleWithEventName.includes('_') ? moduleWithEventName.split('_')[1] : moduleWithEventName;
      const uniqueListenerKey = eventNameWithoutSDK + '-' + eventRegistrationID;
      eventHandlerMap.set(uniqueListenerKey, EventHandlerObject);
      return [eventRegistrationID, uniqueListenerKey];
    }
  }

  clearEventListeners(event) {
    try {
      const [sdkType, module] = this.getSdkTypeAndModule(event);
      let eventName = event.split('.')[1];
      eventName = eventName.slice(2);
      eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1);
      if (process.env.COMMUNICATION_MODE == CONSTANTS.SDK) {
        MODULE_MAP[sdkType][module].clear(eventName);
      } else if (process.env.COMMUNICATION_MODE == CONSTANTS.TRANSPORT) {
        const args = Object.assign({ listen: false });
        Transport.send(module, 'on' + eventName[0].toUpperCase() + eventName.substr(1), args);
      }
      return true;
    } catch (err) {
      logger.error('Error while clearing event listeners: ' + err.message);
      const response = {
        error: {
          code: 'FCAError',
          message: 'Error while clearing event listeners: ' + err.message,
        },
      };
      return response;
    }
  }

  // This method will clear the eventListeners and the event hsitory for the listener as a part of FCA
  clearAllListeners() {
    logger.info('Clearing registered listeners' + JSON.stringify(eventHandlerMap), 'clearAllListeners');
    try {
      if (eventHandlerMap.size >= 1) {
        eventHandlerMap.forEach((EventHandlerObject, uniqueListenerKey) => {
          // The key in the eventhHanldermap is in the format SDK_ModuleName-<registrationID>
          const eventNameWithModuleName = EventHandlerObject.moduleWithEventName;
          const eventName = EventHandlerObject.eventName;
          const eventRegistrationID = uniqueListenerKey.split('-')[1];
          const [sdkType, module] = this.getSdkTypeAndModule(eventNameWithModuleName);
          logger.info('Unregister event ' + eventNameWithModuleName + ' registration ID ' + eventRegistrationID, 'clearAllListeners');

          // Events are cleared using Firebolt SDK
          if (process.env.COMMUNICATION_MODE == CONSTANTS.SDK) {
            MODULE_MAP[sdkType][module].clear(eventName);
          }
          // Events are cleared by using Transport layer and thus bypassing SDK
          else if (process.env.COMMUNICATION_MODE == CONSTANTS.TRANSPORT) {
            const args = Object.assign({ listen: false });
            Transport.send(module, 'on' + eventName[0].toUpperCase() + eventName.substr(1), args);
          }
        });
        eventHandlerMap.clear();
        logger.info('After clearing listeners' + JSON.stringify(eventHandlerMap), 'clearAllListeners');
        return 'Cleared Listeners';
      } else {
        logger.info('No active Listeners', 'clearAllListeners');
        return 'No active listeners';
      }
    } catch (err) {
      logger.error('Error while clearing all event listeners' + err, 'clearAllListeners');
      const response = { error: { code: 'FCAError', message: 'Error while clearing all event listeners: ' + err.message } };
      return response;
    }
  }

  // Check and assign SDK type from incoming params
  getSdkTypeAndModule(moduleWithEventName) {
    let sdkType;
    let module;
    if (!moduleWithEventName.includes('_')) {
      sdkType = CONSTANTS.CORE.toLowerCase();
      module = moduleWithEventName.split('.')[0].toLowerCase();
    } else {
      sdkType = moduleWithEventName.split('_')[0].toLowerCase();
      module = moduleWithEventName.split('.')[0].toLowerCase();
      module = module.split('_')[1];
    }
    sdkType = process.env.SDK_TYPE ? process.env.SDK_TYPE : sdkType;
    return [sdkType, module];
  }

  // Return event history for the provided unique key
  getHistory(eventKey, numberOfEvents) {
    return eventHandlerMap.get(eventKey).getHistory(numberOfEvents);
  }

  // Return the event response object for the eventName passed as the param
  getEventResponse(message) {
    try {
      let filteredEventDataObjectList;
      const eventName = message.params.event;
      if (process.env.STANDALONE == true) {
        filteredEventDataObjectList = eventHistory.filter((element) => element.eventListenerId == eventName);
      } else {
        filteredEventDataObjectList = eventHistory.filter((element) => element.eventListenerId.toString() == eventName.split('-').pop());
      }
      if (filteredEventDataObjectList.length) {
        const eventDataObject = filteredEventDataObjectList[filteredEventDataObjectList.length - 1];
        return eventDataObject;
      } else {
        const eventDataObject = { [eventName]: null };
        return eventDataObject;
      }
    } catch (err) {
      return { error: { code: 'FCAError', message: 'Event response fetch error: ' + err.message } };
    }
  }

  // Registering the event in Transport mode
  async registerEventInTransport(methodName, params) {
    const module = methodName.split('.')[0].toLowerCase();
    const method = methodName.split('.')[1];
    const args = Object.assign({ listen: true }, params);
    return await Transport.listen(module, method, args);
  }
}
