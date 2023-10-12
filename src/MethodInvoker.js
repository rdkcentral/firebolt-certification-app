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
export class MethodInvoker {
  // This method accepts the message(method name, params) and return Api response with Schema validation result.
  async invoke(message) {
    let response, method, params, mode, err, paramNames, module, methodObj;
    let schemaMap;
    let schemaValidationResult;
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
        methodObj = deSchemaList.methods.find((obj) => obj.name.toLowerCase() == updatedMethod.toLowerCase());
      } else {
        methodObj = deSchemaList.methods.find((obj) => obj.name.toLowerCase() == method.toLowerCase());
      }
      if (methodObj) {
        schemaMap = methodObj.result.schema;
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
        schemaValidationResult = validator.validate(response, schemaMap);
      } else if (!methodObj && process.env.COMMUNICATION_MODE === CONSTANTS.TRANSPORT) {
        [response, err] = await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramNames), process.env.TimeoutInMS);
        schemaValidationResult = [];
      } else {
        err = CONSTANTS.ERROR_MESSAGE_WRONG_METHOD_NAME;
      }
      // if the method is not supported and it gives a valid response, validate against errorschema instead of api schema
      if (message.isNotSupportedApi == true && response != undefined) {
        schemaValidationResult = errorSchemaCheck(response);
      }
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

    return this.formatResult(message.task, response, err, schemaValidationResult, params, schemaMap);
  }

  formatResult(task, response, err, schemaValidationResult, params, schemaMap) {
    let apiResponse, responseCode, schemaValidationStatus;
    if (err) {
      apiResponse = { result: null, error: err };
      schemaValidationResult = errorSchemaCheck(err);
      if (schemaValidationResult && schemaValidationResult.errors && schemaValidationResult.errors.length > 0) {
        if (err.message != undefined && CONSTANTS.ERROR_LIST.includes(err.message)) {
          responseCode = CONSTANTS.STATUS_CODE[3];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[1];
        } else {
          responseCode = CONSTANTS.STATUS_CODE[1];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[1];
        }
      } else {
        if (err.message != undefined && CONSTANTS.ERROR_LIST.includes(err.message)) {
          responseCode = CONSTANTS.STATUS_CODE[3];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[0];
        } else {
          responseCode = CONSTANTS.STATUS_CODE[0];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[0];
        }
      }
    } else {
      if (response == undefined || (schemaValidationResult && schemaValidationResult.errors && schemaValidationResult.errors.length > 0)) {
        // Handling expected null scenarios from Open RPC
        if (response === null && schemaMap && (Object.values(schemaMap).includes('null') || Object.values(schemaMap).includes(null) || findTypeInOneOF(schemaMap))) {
          apiResponse = { result: response, error: null };
          responseCode = CONSTANTS.STATUS_CODE[0];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[0];
        } else if (schemaMap == undefined) {
          apiResponse = { result: response, error: null };
          responseCode = CONSTANTS.STATUS_CODE[0];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[0];
        } else if (response == undefined) {
          apiResponse = { result: null, error: 'undefined' };
          responseCode = CONSTANTS.STATUS_CODE[2];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[2];
        } else {
          apiResponse = { result: response, error: null };
          responseCode = CONSTANTS.STATUS_CODE[1];
          schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[1];
        }
      } else {
        apiResponse = { result: response, error: null };
        responseCode = CONSTANTS.STATUS_CODE[0];
        schemaValidationStatus = CONSTANTS.SCHEMA_VALIDATION_STATUS_CODE[0];
      }
    }

    return {
      method: task,
      params: params,
      responseCode: responseCode,
      apiResponse: apiResponse,
      schemaValidationStatus: schemaValidationStatus,
      schemaValidationResponse: schemaValidationResult,
    };
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
