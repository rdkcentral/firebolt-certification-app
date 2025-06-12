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

import { dereferenceOpenRPC, errorSchemaCheck } from './utils/Utils';
import { MODULE_MAP } from './FireboltExampleInvoker';
import { CONSTANTS } from './constant';
import Transport from 'Transport';

const Validator = require('jsonschema').Validator;
const validator = new Validator();
const eventHandlerMap = new Map();
const eventHistoryMap = new Map();
const logger = require('./utils/Logger')('EventInvocation.js');

class EventHandler {
  constructor(moduleWithEventName, schemaList) {
    this.moduleWithEventName = moduleWithEventName;
    const event = moduleWithEventName.split('.')[1];
    this.eventName = moduleWithEventName;
    this.event = this.parseEventName(event);
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
    return this.event;
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
        eventResponse: eventData,
        eventSchemaResult: eventSchemaResponse,
        eventTime: new Date(),
      };
    } else {
      eventDataObject = {
        eventName: this.eventName,
        eventResponse: eventData,
        eventTime: new Date(),
      };
    }
    const eventMap = eventHistoryMap.get(this.eventName);
    if (!eventMap) {
      eventHistoryMap.set(this.eventName, [eventDataObject]);
    } else {
      eventMap.push(eventDataObject);
    }
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
    return eventHistoryMap.slice(-numberOfEvents);
  }
}

class EventRegistrationInterface {
  async clearEventListeners(event) {
    try {
      const [sdkType, module, _eventMethodWithoutModule, eventName] = this.parseEventNameAndModuleAndSDKType(event);
      if (process.env.COMMUNICATION_MODE == CONSTANTS.SDK) {
        MODULE_MAP[sdkType][module].clear(eventName);
      } else if (process.env.COMMUNICATION_MODE == CONSTANTS.TRANSPORT) {
        const args = { listen: false };
        if (process.env.IS_BIDIRECTIONAL_SDK === true || (typeof process.env.IS_BIDIRECTIONAL_SDK === 'string' && process.env.IS_BIDIRECTIONAL_SDK.toLowerCase() === 'true')) {
          await Transport.request(`${module}.on${eventName[0].toUpperCase()}${eventName.substr(1)}`, args);
        } else {
          await Transport.send(module, 'on' + eventName[0].toUpperCase() + eventName.substr(1), args);
        }
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

  /**
   * parseEventNameAndModuleAndSDKType
   * This method parses the module with event name to extract SDK type, module, event name without module, and formatted event name.
   * @param {String} moduleWithEventName - The module with event name in the format 'sdkType_moduleName.onEventName'.
   * @returns - array containing sdkType, module, eventNameWithoutModule, and formatted eventName.
   * @example
   * parseEventNameAndModuleAndSDKType('firebolt_foo.onExampleEvent')
   * returns ['firebolt', 'foo', 'onExampleEvent', 'exampleEvent']
   */
  parseEventNameAndModuleAndSDKType(moduleWithEventName) {
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
    const eventMethodWithoutModule = moduleWithEventName.split('.')[1];
    let eventName = eventMethodWithoutModule.slice(2);
    eventName = eventName.charAt(0).toLowerCase() + eventName.slice(1);
    return [sdkType, module, eventMethodWithoutModule, eventName];
  }

  // Return event history for the provided unique key
  getHistory(eventKey, numberOfEvents) {
    return eventHandlerMap.get(eventKey).getHistory(numberOfEvents);
  }
  // Registering the event in Transport mode
  async registerEventInTransport(methodName, params) {
    const module = methodName.split('.')[0].toLowerCase();
    const method = methodName.split('.')[1];
    const args = Object.assign({ listen: true }, params);
    return await Transport.listen(module, method, args);
  }

  clearAllListeners(eventHandlerMap) {
    logger.info('Clearing registered listeners' + JSON.stringify(Object.fromEntries(eventHandlerMap)), 'clearAllListeners');
    try {
      eventHistoryMap.clear();
      if (eventHandlerMap.size >= 1) {
        eventHandlerMap.forEach(async (EventHandlerObject, _uniqueListenerKey) => {
          // The key in the eventhHanldermap is in the format SDK_ModuleName-<registrationID>
          const eventNameWithModuleName = EventHandlerObject.moduleWithEventName;
          const eventName = EventHandlerObject.event;
          const [sdkType, module, eventMethodWithoutModule] = this.parseEventNameAndModuleAndSDKType(eventNameWithModuleName);
          logger.info('Unregistered event- ' + eventNameWithModuleName, 'clearAllListeners');

          // Events are cleared using Firebolt SDK
          if (process.env.COMMUNICATION_MODE == CONSTANTS.SDK) {
            MODULE_MAP[sdkType][module].clear(eventName);
          }
          // Events are cleared by using Transport layer and thus bypassing SDK
          else if (process.env.COMMUNICATION_MODE == CONSTANTS.TRANSPORT) {
            const args = { listen: false };
            if (process.env.IS_BIDIRECTIONAL_SDK === true || (typeof process.env.IS_BIDIRECTIONAL_SDK === 'string' && process.env.IS_BIDIRECTIONAL_SDK.toLowerCase() === 'true')) {
              await Transport.request(eventNameWithModuleName, args);
            } else {
              await Transport.send(module, eventMethodWithoutModule, args);
            }
          }
        });
        eventHandlerMap.clear();
        logger.info('After clearing listeners' + JSON.stringify(eventHandlerMap), 'clearAllListeners');
        return CONSTANTS.CLEARED_LISTENERS;
      } else {
        logger.info('No active Listeners', 'clearAllListeners');
        return CONSTANTS.NO_ACTIVE_LISTENERS;
      }
    } catch (err) {
      logger.error('Error while clearing all event listeners' + err.message, 'clearAllListeners');
      const response = { error: { code: 'FCAError', message: 'Error while clearing all event listeners: ' + err.message } };
      return response;
    }
  }
}

// 1.0 Implementation
class EventRegistration extends EventRegistrationInterface {
  // This method will listen to event and capture the event response after triggering
  async registerEvent(moduleWithEventName, params) {
    const paramlist = [];
    const [sdkType, module] = this.parseEventNameAndModuleAndSDKType(moduleWithEventName);
    const [schemaList, invokedSdk] = await dereferenceOpenRPC(sdkType);
    const EventHandlerObject = new EventHandler(moduleWithEventName, schemaList);
    const eventName = EventHandlerObject.getEventName();
    let eventRegistrationID;
    for (const key in params) {
      paramlist.push(params[key]);
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

    // Construct unique key for event handler. Using the event registration ID.
    if (eventRegistrationID) {
      const eventNameWithoutSDK = moduleWithEventName.includes('_') ? moduleWithEventName.split('_')[1] : moduleWithEventName;
      const uniqueListenerKey = eventNameWithoutSDK + '-' + eventRegistrationID;
      eventHandlerMap.set(uniqueListenerKey, EventHandlerObject);
      return [eventRegistrationID, uniqueListenerKey];
    }
  }

  eventListenerResponseHandler(moduleWithEventName, response) {
    const [listenerResponse, uniqueListenerKey] = response;
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
          schemaValidationResult = errorSchemaCheck(listenerResponse);
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
        const schemaValidationResult = errorSchemaCheck(listenerResponse);
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

  // Return the event response object for the eventName passed as the param
  getEventResponse(message) {
    try {
      let filteredEventDataObjectList;
      const eventName = message.params.event;
      if (process.env.STANDALONE == true) {
        filteredEventDataObjectList = eventHistoryMap.get(eventName.split('-')[0]);
      } else {
        filteredEventDataObjectList = eventHistoryMap.get(eventName);
      }
      if (filteredEventDataObjectList && filteredEventDataObjectList.length) {
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

  // This method will clear the eventListeners and the event hsitory for the listener as a part of FCA
  clearAllListeners() {
    return super.clearAllListeners(eventHandlerMap);
  }
}

// 2.0 Implementation
class EventRegistrationV2 extends EventRegistrationInterface {
  // This method will listen to an event and capture the event response after triggering
  async registerEvent(moduleWithEventName, params) {
    const [sdkType, module] = this.parseEventNameAndModuleAndSDKType(moduleWithEventName);
    const [schemaList] = await dereferenceOpenRPC(sdkType);
    const EventHandlerObject = new EventHandler(moduleWithEventName, schemaList);
    const eventName = EventHandlerObject.getEventName();
    let eventRegistrationID;

    try {
      if (process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
        eventRegistrationID = await this.handleTransportEvent(moduleWithEventName, eventName, EventHandlerObject);
      } else if (process.env.COMMUNICATION_MODE === CONSTANTS.SDK) {
        eventRegistrationID = await this.handleSdkEvent(sdkType, module, eventName, moduleWithEventName, EventHandlerObject);
      }
    } catch (err) {
      logger.error(`Error registering event: ${JSON.stringify(err)}`, 'registerEvent');
      return err;
    }

    if (eventRegistrationID) {
      eventHandlerMap.set(moduleWithEventName, EventHandlerObject);
      return eventRegistrationID;
    }
  }

  // Helper method to handle Transport events
  async handleTransportEvent(moduleWithEventName, eventName, EventHandlerObject) {
    const event = moduleWithEventName.charAt(0).toLowerCase() + moduleWithEventName.slice(1);
    const args = { listen: true };
    const emit = (value) => {
      if (!CONSTANTS.EXCLUDED_VALUES.includes(value)) {
        EventHandlerObject.handleEvent(value);
      }
    };
    Transport.subscribe(event, emit);
    return await Transport.request(event, args);
  }

  // Helper method to handle SDK events
  async handleSdkEvent(sdkType, module, eventName, moduleWithEventName, EventHandlerObject) {
    const resolvedModule = MODULE_MAP[sdkType][module];
    return await resolvedModule.listen(eventName, (result) => {
      if (!CONSTANTS.EXCLUDED_VALUES.includes(result)) {
        EventHandlerObject.handleEvent(result);
      }
    });
  }

  // Construct a unique listener key
  constructUniqueListenerKey(moduleWithEventName, eventRegistrationID) {
    const eventNameWithoutSDK = moduleWithEventName.includes('_') ? moduleWithEventName.split('_')[1] : moduleWithEventName;
    return `${eventNameWithoutSDK}-${eventRegistrationID}`;
  }

  // Return the event response object for the eventName passed as the param
  getEventResponse(message) {
    try {
      const eventName = message.params.event;
      const filteredEvents = eventHistoryMap.get(eventName);
      return filteredEvents && filteredEvents.length ? filteredEvents[filteredEvents.length - 1] : { [eventName]: null };
    } catch (err) {
      return { error: { code: 'FCAError', message: `Event response fetch error: ${err.message}` } };
    }
  }

  eventListenerResponseHandler(moduleWithEventName, response) {
    const registrationResponse = {};
    registrationResponse['jsonrpc'] = '2.0';
    if (response && Number.isInteger(response) && response > 0) {
      registrationResponse['id'] = response;
      registrationResponse['result'] = {
        listening: true,
        event: moduleWithEventName,
      };
      eventHandlerMap.get(moduleWithEventName).setEventListener(registrationResponse);
    } else if (response && response.hasOwnProperty('listening') && response.listening) {
      registrationResponse['jsonrpc'] = '2.0';
      registrationResponse['id'] = null;
      registrationResponse['result'] = response;
      eventHandlerMap.get(moduleWithEventName).setEventListener(registrationResponse);
    } else {
      registrationResponse['error'] = response;
      registrationResponse['id'] = null;
    }
    return registrationResponse;
  }

  // This method will clear the eventListeners and the event hsitory for the listener as a part of FCA
  clearAllListeners() {
    return super.clearAllListeners(eventHandlerMap);
  }
}

export class EventInvocation {
  constructor() {
    this.eventRegistration = this.initializeEventRegistration();
  }

  // Initialize Event Registration based on SDK version
  initializeEventRegistration() {
    if (process.env.IS_BIDIRECTIONAL_SDK === true || (typeof process.env.IS_BIDIRECTIONAL_SDK === 'string' && process.env.IS_BIDIRECTIONAL_SDK.toLowerCase() === 'true')) {
      return new EventRegistrationV2();
    } else {
      return new EventRegistration();
    }
  }

  async northBoundEventHandling(message) {
    try {
      const { event: moduleWithEventName, params } = message.params;
      const response = await this.eventRegistration.registerEvent(moduleWithEventName, params);
      return this.eventRegistration.eventListenerResponseHandler(moduleWithEventName, response);
    } catch (error) {
      return this.handleError('northBoundEventHandling', error);
    }
  }

  async clearEventListeners(event) {
    try {
      return await this.eventRegistration.clearEventListeners(event);
    } catch (error) {
      return this.handleError('clearEventListeners', error);
    }
  }

  // This method will clear the eventListeners and the event hsitory for the listener as a part of FCA
  clearAllListeners() {
    try {
      return this.eventRegistration.clearAllListeners();
    } catch (error) {
      return this.handleError('clearAllListeners', error);
    }
  }

  // Check and assign SDK type from incoming params
  parseEventNameAndModuleAndSDKType(moduleWithEventName) {
    try {
      return this.eventRegistration.parseEventNameAndModuleAndSDKType(moduleWithEventName);
    } catch (error) {
      return this.handleError('parseEventNameAndModuleAndSDKType', error);
    }
  }

  // Return event history for the provided unique key
  getHistory(eventKey, numberOfEvents) {
    try {
      return this.eventRegistration.getHistory(eventKey, numberOfEvents);
    } catch (error) {
      return this.handleError('getHistory', error);
    }
  }

  // Return the event response object for the eventName passed as the param
  getEventResponse(message) {
    try {
      return this.eventRegistration.getEventResponse(message);
    } catch (error) {
      return this.handleError('getEventResponse', error);
    }
  }

  // Registering the event in Transport mode
  async registerEventInTransport(methodName, params) {
    try {
      return await this.eventRegistration.registerEventInTransport(methodName, params);
    } catch (error) {
      return this.handleError('registerEventInTransport', error);
    }
  }

  // Centralized error handling
  handleError(methodName, error) {
    console.error(`Error in ${methodName}:`, error.message);
    return { error: { code: 'FCAError', message: `Error in ${methodName}: ${error.message}` } };
  }
}
