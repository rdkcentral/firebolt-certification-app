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
//   * Parse openRPC
//   * Make calls to Firebolt API through client
//   * Perform validations on response
//   * Return results of all firebolt calls
// Script version : 0.1
// Date : 16 dec 2021
// ************* End Description **********

import FireboltExampleInvoker from './FireboltExampleInvoker';
import FireboltTransportInvoker from './FireboltTransportInvoker';
import { CONSTANTS } from './constant';
import { handleAsyncFunction } from './utils/Utils';
import LifeCycleHistoryV1 from '../src/LifeCycleHistoryV1';
import LifeCycleHistoryV2 from '../src/LifeCycleHistoryV2';
import { MODULE_MAP } from './FireboltExampleInvoker';
const $RefParser = require('@apidevtools/json-schema-ref-parser');
const logger = require('./utils/Logger')('Test_Runner.js');

const LIFE_CYCLE_HISTORY_MAP = {
  1: LifeCycleHistoryV1,
  2: LifeCycleHistoryV2,
};

class LifecycleHandler {
  constructor() {
    const version = (process.env.FIREBOLT_V2 || '').split('.')[0];
    this.version = version && version >= '2' ? 2 : 1;
    logger.info(`LifecycleHandler initialized with version: ${process.env.FIREBOLT_V2}`, 'LifecycleHandler.js');
    this.LifeCycleHistory = LIFE_CYCLE_HISTORY_MAP[this.version];
    this.lifecycleVersionHandlerMap = {
      1: new LifecycleVersion1(this),
      2: new LifecycleVersion2(this),
    };
  }

  async handle(methods) {
    const handler = this.lifecycleVersionHandlerMap[this.version] || this.lifecycleVersionHandlerMap[1];
    return handler.handle(methods);
  }
}

class LifecycleVersion1 {
  constructor(parent) {
    this.parent = parent;
  }

  get LifeCycleHistory() {
    return this.parent.LifeCycleHistory;
  }

  async handle(methods) {
    let response,
      result = null,
      error = null,
      schemaResult,
      contentResult;
    const method = methods.methodName;
    const params = {};
    process.env.APP_TYPE = process.env.APP_TYPE ? process.env.APP_TYPE : CONSTANTS.FIREBOLT_CONST;
    const openRpc = CONSTANTS.defaultSDKs.find((sdk) => sdk.name.toUpperCase().includes(CONSTANTS.CORE)).openRpc;
    try {
      this.dereferenceSchemaList = await $RefParser.dereference(openRpc);
    } catch (err) {
      logger.error(err, 'invokeLifecycleAPI');
    }
    const lifecycleMethods = [];
    for (let methodIndex = 0; this.dereferenceSchemaList !== undefined && methodIndex < this.dereferenceSchemaList.methods.length; methodIndex++) {
      const module = this.dereferenceSchemaList.methods[methodIndex].name;
      if (CONSTANTS.LIFECYCLE_METHOD_LIST.includes(module)) {
        lifecycleMethods.push(this.dereferenceSchemaList.methods[methodIndex]);
      }
    }
    switch (method) {
      case CONSTANTS.LIFECYCLE.READY:
        try {
          result = await this.lifecycleMethodCalls(method, params);
          if (process.env.STANDALONE == true) {
            const stateSchema = this.getMethodSchema('Lifecycle.ready', lifecycleMethods);
            schemaResult = this.schemaValidation(result.response, stateSchema);
          }
        } catch (err) {
          error = err;
          result.error = error;
        }
        if (process.env.STANDALONE == true) {
          response = this.createResultObject(result.response, result.error, schemaResult);
        } else {
          response = this.createResultObject(result.response, result.error);
        }
        break;
      case CONSTANTS.LIFECYCLE.STATE:
        /*
                In this case we dont need to look at history
                we are trying to return the current state of the app 
                which can then be validated at bolt end.
                */
        try {
          result = await this.lifecycleMethodCalls(method, params);
          if (process.env.STANDALONE == true) {
            const stateSchema = this.getMethodSchema('Lifecycle.state', lifecycleMethods);
            schemaResult = this.schemaValidation(result.response, stateSchema);
          }
        } catch (err) {
          error = err;
          result.error = error;
        }
        if (process.env.STANDALONE == true) {
          response = this.createResultObject(result.response, result.error, schemaResult);
        } else {
          response = this.createResultObject(result.response, result.error);
        }
        break;
      case CONSTANTS.LIFECYCLE.CLOSE:
        try {
          result = await this.lifecycleMethodCalls(method, methods.methodParams);
          if (process.env.STANDALONE == true) {
            const stateSchema = this.getMethodSchema('Lifecycle.close', lifecycleMethods);
            schemaResult = this.schemaValidation(result.response, stateSchema);
          }
        } catch (err) {
          error = err;
          result.error = error;
        }
        if (process.env.STANDALONE == true) {
          response = this.createResultObject(result.response, result.error, schemaResult);
        } else {
          response = this.createResultObject(result.response, result.error);
        }
        break;
      case CONSTANTS.LIFECYCLE.HISTORY:
        try {
          result = this.LifeCycleHistory.get();
        } catch (err) {
          error = err;
        }
        response = this.createResultObject(result, error);
        break;
      case CONSTANTS.LIFECYCLE.ON_INACTIVE:
        if (process.env.STANDALONE == true) {
          try {
            const OnInactiveEvent = this.LifeCycleHistory.get();
            const OnInactiveHistory = OnInactiveEvent._history._value[0].event;
            const OnInActiveList = this.getMethodSchema('Lifecycle.onInactive', lifecycleMethods);
            schemaResult = this.schemaValidation(OnInactiveHistory, OnInActiveList);
            if (OnInactiveHistory.state == 'inactive' && OnInactiveHistory.previous == 'initializing') {
              contentResult = CONSTANTS.PASS;
            } else {
              contentResult = CONSTANTS.FAIL;
            }
          } catch (err) {
            error = err;
          }
          response = this.createResultObject(result, error, schemaResult, contentResult);
        } else {
          response = this.createResultObject(result, error);
        }
        break;
      case CONSTANTS.LIFECYCLE.ON_FOREGROUND:
        if (process.env.STANDALONE == true) {
          try {
            const onForegroundEvent = this.LifeCycleHistory.get();
            const onForegroundHistory = onForegroundEvent._history._value[1].event;
            const onForegroundList = this.getMethodSchema('Lifecycle.onForeground', lifecycleMethods);
            schemaResult = this.schemaValidation(onForegroundHistory, onForegroundList);
            if (onForegroundHistory.state == 'foreground' && onForegroundHistory.previous == 'inactive') {
              contentResult = CONSTANTS.PASS;
            } else {
              contentResult = CONSTANTS.FAIL;
            }
          } catch (err) {
            error = err;
          }
          response = this.createResultObject(result, error, schemaResult, contentResult);
        } else {
          response = this.createResultObject(result, error);
        }
        break;
      case CONSTANTS.LIFECYCLE.ON_BACKGROUND:
        if (process.env.STANDALONE == true) {
          try {
            const onBackgroundEvent = this.LifeCycleHistory.get();
            const onBackgroundHistory = onBackgroundEvent._history._value[2].event;
            const onBackgroundList = this.getMethodSchema('Lifecycle.onBackground', lifecycleMethods);
            schemaResult = this.schemaValidation(onBackgroundHistory, onBackgroundList);
            if (onBackgroundHistory.state == 'background' && onBackgroundHistory.previous == 'foreground') {
              contentResult = CONSTANTS.PASS;
            } else {
              contentResult = CONSTANTS.FAIL;
            }
          } catch (err) {
            error = err;
          }
          response = this.createResultObject(result, error, schemaResult, contentResult);
        } else {
          response = this.createResultObject(result, error);
        }
        break;
      case CONSTANTS.LIFECYCLE.FINISHED:
        /**
         * Directly calling finish is not an expected behavior of the app.
         * Finish should ideally be called by the app when unload event is generated.
         * For testing, we expect bolt to launch multiple apps and create a memory crunch
         * which would force the platform to generate and unload event.
         * TODO: Approach for the validation of lifecycle.finish() is yet to be decided.
         */
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE.BACKGROUND:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE.SUSPEND:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE.UNSUSPEND:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      default:
        response = 'Invalid lifecycle method passed';
    }
    return response;
  }

  async lifecycleMethodCalls(method, params) {
    let response, err;
    const paramNames = params ? Object.keys(params) : [];
    if (!(params && typeof params === 'object' && !Array.isArray(params))) {
      params = [];
    }
    try {
      const moduleClass = MODULE_MAP[CONSTANTS.CORE.toLowerCase()][method.split('.')[0].toLowerCase()];
      const methodFn = moduleClass[method.split('.')[1]];
      if (methodFn && process.env.COMMUNICATION_MODE === CONSTANTS.SDK) {
        [response, err] = await handleAsyncFunction(FireboltExampleInvoker.get().invoke(CONSTANTS.CORE.toLowerCase(), method, params));
      } else if (process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
        [response, err] = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramNames));
      } else {
        err = CONSTANTS.ERROR_MESSAGE_WRONG_METHOD_NAME;
      }
    } catch (error) {
      console.log('Error: ', error);
      err = error;
    }
    return {
      response: response === undefined ? 'undefined' : response,
      error: err === undefined ? null : err,
    };
  }

  createResultObject(result, error) {
    let resultObject;
    if (process.env.STANDALONE == true) {
      resultObject = {
        result: result,
        error: error,
        schemaResult: schemaResult,
        contentResult: contentResult,
      };
    } else {
      if (error == null) {
        resultObject = {
          jsonrpc: '2.0',
          result: result,
          id: process.env.ID + 1,
        };
      } else {
        resultObject = {
          jsonrpc: '2.0',
          error: error,
          id: process.env.ID + 1,
        };
      }
    }
    return resultObject;
  }

  getMethodSchema(method, apiSchema) {
    const methodSchema = [];
    for (let i = 0; i < apiSchema.length; i++) {
      if (apiSchema[i].name == method) {
        methodSchema.push(apiSchema[i]);
      }
    }
    return methodSchema;
  }
}

class LifecycleVersion2 {
  constructor(parent) {
    this.parent = parent;
  }

  get LifeCycleHistory() {
    return this.parent.LifeCycleHistory;
  }

  async handle(methods) {
    return 'Lifecycle 2.0 Implementation is pending.';
  }
}

export { LifecycleHandler };
