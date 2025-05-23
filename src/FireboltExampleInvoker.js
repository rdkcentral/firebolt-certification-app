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

import * as CoreSDK from '@firebolt-js/sdk';
import * as ManageSDK from '@firebolt-js/manage-sdk';
import FireboltSdkManager from './utils/FireboltSdkManager';
import DiscoveryInvoker from './invokers/DiscoveryInvoker';
const discoveryInvoker = new DiscoveryInvoker();
const logger = require('./utils/Logger')('FireboltExampleInvoker.js');
import { removeSetInMethodName } from './utils/Utils';
import { eventEmitter } from './Toast';
import { CONSTANTS } from './constant';

/**
 * Dynamically check if the Discovery SDK is available as a dependency.
 * If available, require it. Otherwise, log a warning.
 */
const dependencies = DEPENDENCIES; // Injected by Webpack DefinePlugin
let DiscoverySDK;

if (dependencies.hasOwnProperty('@firebolt-js/discovery-sdk')) {
  try {
    DiscoverySDK = require('@firebolt-js/discovery-sdk');
  } catch (error) {
    console.warn('DiscoverySDK is not available:', error);
  }
}

// Initialize the Firebolt SDK Module Loader
const sdkManager = new FireboltSdkManager(CoreSDK, ManageSDK, DiscoverySDK, dependencies);

// Dynamically generate the module map based on the imported SDKs
const moduleMap = sdkManager.generateModuleMap();

// Export the dynamically created module map
export const MODULE_MAP = moduleMap;

// Commenting the below APIs as they have been deprecated from discovery sdk , can be uncommented when added as ripple-rpc APIs in future ticket
const MAP = {
  'discovery.purchasedContent': discoveryInvoker.purchasedContent.bind(discoveryInvoker),
  'discovery.entityInfo': discoveryInvoker.entityInfo.bind(discoveryInvoker),
  // 'content.purchases': discoveryInvoker.getPurchasedContent.bind(discoveryInvoker),
  // 'content.entity': discoveryInvoker.getEntityInfo.bind(discoveryInvoker),
};

// importing additional invoker which has external sdk's being exported and adding those modules in the MODULE_MAP
try {
  const additionalInvoker = require('../plugins/FireboltExtensionInvoker').default;
  Object.assign(MODULE_MAP, additionalInvoker);
} catch (err) {
  logger.error(`Unable to import additional invoker - ${err.message}`, 'MODULE_MAP');
}
let instance = null;

export default class FireboltExampleInvoker {
  /**
   *
   * @returns {FireboltExampleInvoker}
   */
  static get() {
    if (instance == null) {
      instance = new FireboltExampleInvoker();
    }
    return instance;
  }

  async invoke(sdk, methodName, params, listenerCallback) {
    const module = methodName.split('.')[0].toLowerCase();
    const method = methodName.split('.')[1];
    const invoker = MAP[module + '.' + method];
    if (invoker) {
      if (params == undefined) {
        params = '{}';
      }
      return await invoker(...params);
    }

    const moduleClass = MODULE_MAP[sdk][module];
    const updatedMethod = removeSetInMethodName(methodName);

    if (JSON.stringify(params) === '[true]' && method === 'setEnabled' && module === 'voiceguidance') {
      eventEmitter.emit('accessibilityCheck', CONSTANTS.ENABLE_VOICE_ANNOUNCEMENT);
    } else if (JSON.stringify(params) === '[false]' && method === 'setEnabled' && module === 'voiceguidance') {
      eventEmitter.emit('accessibilityCheck', CONSTANTS.DISABLE_VOICE_ANNOUNCEMENT);
    }

    if (moduleClass) {
      const methodFn = moduleClass[updatedMethod];
      if (methodFn) {
        // use SDK
        if (typeof params === 'object' && !Array.isArray(params)) {
          params = this.getParamsListFromSDK(methodFn, params);
        }
        return await methodFn(...params);
      } else if (method.match(/^on[A-Z][a-zA-Z]+$/) && moduleClass.listen) {
        let id;
        console.log('params:', params);
        const event = method[2].toLowerCase() + method.substr(3);
        if (params.length == 1 && params[0] === true) {
          id = await moduleClass.listen(event, (e) => {
            logger.error(e, 'invoke');
            if (listenerCallback) listenerCallback(e);
          });
        } else {
          id = await moduleClass.listen(event, ...params, (e) => {
            logger.error(e, 'invoke');
            if (listenerCallback) listenerCallback(e);
          });
        }
        if (id >= 0) {
          return `Successful ${module}.listen('${event}')`;
        }
      }
    }
    throw Error('Could not find an example for ' + methodName);
  }

  /**
   *  Extracts and maps function parameters by comparing them with the SDK function
   *
   * @param {Function} methodFn - Function to analyze.
   * @param {Object} params - Object with parameter values.
   * @returns {Array} Array of values or `undefined`.
   */
  getParamsListFromSDK(methodFn, params) {
    const functionString = methodFn.toString();
    const parameterString = functionString.match(/\(([^)]*)\)/)[1];
    const parameterNames = parameterString.split(',').map((param) => param.trim());
    const paramsArray = parameterNames.map((paramName) => (params.hasOwnProperty(paramName) ? params[paramName] : undefined));
    return paramsArray;
  }
}
