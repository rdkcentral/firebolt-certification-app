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

import FireboltExampleInvoker from './FireboltExampleInvoker';
import FireboltTransportInvoker from './FireboltTransportInvoker';
import { handleAsyncFunction, dereferenceOpenRPC, errorSchemaCheck } from './utils/Utils';
import { CONSTANTS } from './constant';
import { MODULE_MAP } from './FireboltExampleInvoker';
import { removeSetInMethodName, findTypeInOneOF } from './utils/Utils';
const Validator = require('jsonschema').Validator;
const logger = require('./utils/Logger')('MethodInvoker.js');
const validator = new Validator();
const responseList = [];
let id = 0;
export class MethodInvoker {
  // This method accepts the message(method name, params) and return Api response with Schema validation result.
  async invoke(message) {
    let response, method, params, mode, err, paramNames, module, methodObj;
    id = id + 1;
    process.env.COMMUNICATION_MODE = message.context.communicationMode;
    params = message.params.methodParams;
    if (message.params.method.includes('_')) {
      method = message.params.method.split('_')[1];
      module = method.split('.')[0].toLowerCase();
      mode = message.params.method.split('_')[0];
    } else {
      method = message.params.method;
      module = method.split('.')[0].toLowerCase();
      mode = CONSTANTS.CORE.toLowerCase();
    }

    mode = message.action != null && message.action != 'NA' ? message.action : mode;

    if (process.env.COMMUNICATION_MODE === CONSTANTS.SDK) {
      const paramlist = [];
      if (method.includes('set') && method.split('.')[1] !== 'set' && !CONSTANTS.METHODS_T0_IGNORE_WHICH_HAS_SET.includes(method)) {
        paramlist.push(params['value']);
      } else {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            paramlist.push(params[key]);
          }
        }
      }
      params = paramlist;
    } else if (process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
      paramNames = params ? Object.keys(params) : [];
      params = params ? Object.values(params) : [];
    }

    const [deSchemaList, invokedSdk] = await dereferenceOpenRPC(mode);

    method = method.charAt(0).toUpperCase() + method.slice(1);
    const updatedMethod = method.split('.')[0] + '.' + removeSetInMethodName(method);
    try {
      // Fetching the method Object from the deSchemaList
      if (method.includes('set') && params[0] == undefined && !CONSTANTS.METHODS_T0_IGNORE_WHICH_HAS_SET.includes(method)) {
        methodObj = deSchemaList.methods.some((obj) => obj.name.toLowerCase() == updatedMethod.toLowerCase());
      } else {
        methodObj = deSchemaList.methods.some((obj) => obj.name.toLowerCase() == method.toLowerCase());
      }
      if (methodObj) {
        const moduleClass = MODULE_MAP[invokedSdk][module];

        if (moduleClass) {
          const methodFn = moduleClass[updatedMethod.split('.')[1]];
          if (methodFn && process.env.COMMUNICATION_MODE === CONSTANTS.SDK) {
            [response, err] = await handleAsyncFunction(FireboltExampleInvoker.get().invoke(invokedSdk, updatedMethod, params), process.env.TimeoutInMS);
          } else if (process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
            [response, err] = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramNames), process.env.TimeoutInMS);
          }
        } else if (process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
          [response, err] = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramNames), process.env.TimeoutInMS);
        }
      } else if (!methodObj && process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
        [response, err] = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramNames), process.env.TimeoutInMS);
      } else {
        err = CONSTANTS.ERROR_MESSAGE_WRONG_METHOD_NAME;
      }
      // if the method is not supported and it gives a valid response, validate against errorschema instead of api schema

      // ---------------Need to check how to manage this in FCS side---------------
      // if (message.params.isNotSupportedApi == true && response != undefined) {
      //   schemaValidationResult = errorSchemaCheck(response, process.env.COMMUNICATION_MODE);
      // }
    } catch (error) {
      logger.error('Error: ', error);
      err = { code: 'FCAError', message: error.message };
    }

    // Pushing the response to global list
    const resultObject = {
      method: method,
      result: {
        result: response,
        error: err ? err : null,
      },
    };
    responseList.push(resultObject);

    if (response !== undefined) {
      return { id: id, result: response, jsonrpc: '2.0' };
    } else {
      return { id: id, error: err, jsonrpc: '2.0' };
    }
  }

  // Return the method response object for the passed method
  getMethodResponse(message) {
    const methodName = message.params.method;
    console.log('responseList', responseList);
    const filteredList = responseList.filter((element) => element.method.toLowerCase() == methodName.toLowerCase());
    let responseObject;
    if (filteredList.length) {
      responseObject = filteredList[filteredList.length - 1];
      return responseObject.result;
    } else {
      responseObject = { [method]: null };
      return responseObject;
    }
  }
}
