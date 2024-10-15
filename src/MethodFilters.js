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

const INCLUDE_EVENT_METHODS = [];
import { CONSTANTS } from './constant';
import { getMethodExcludedListBasedOnMode } from './utils/Utils';
const _ = require('lodash');
const xreExclusionList = require('./platform/XClass/XREExclusionList');
require('dotenv').config();

export default class MethodFilters {
  isEventMethod(method) {
    let isEvent = false;
    if (method.tags && INCLUDE_EVENT_METHODS.indexOf(method.name) === -1) {
      method.tags.forEach((tag) => {
        if (tag.name && tag.name === 'event') {
          isEvent = true;
        }
      });
    }
    return isEvent;
  }

  isRpcMethod(method, invokedSdk, communicationMode = 'sdk') {
    let isRpc = false;

    const mergedSDKs = CONSTANTS.defaultSDKs.concat(CONSTANTS.additionalSDKs);
    const sdkNames = mergedSDKs.map((sdkObjectCopy) => sdkObjectCopy.name.toLowerCase());
    if (sdkNames.includes(invokedSdk.toLowerCase()) && communicationMode == CONSTANTS.TRANSPORT) {
      return isRpc;
    } else if (invokedSdk == CONSTANTS.MANAGE.toLowerCase() && method.name.split('.')[1].startsWith('set')) {
      return isRpc;
    } else {
      if (method.tags) {
        method.tags.forEach((tag) => {
          if (tag.name && tag.name === 'rpc-only') {
            isRpc = true;
          }
        });
      }
    }
    return isRpc;
  }

  isPolymorphicPullMethod(method) {
    let isPolyPull = false;
    if (method.tags) {
      method.tags.forEach((tag) => {
        if (tag.name && tag.name === 'polymorphic-pull') {
          isPolyPull = true;
        }
      });
    }
    return isPolyPull;
  }

  isSubscribeMethod(method) {
    let isSubscribe = false;
    if (method.name && method.name.split(' ')[0] === CONSTANTS.SUBSCRIBE) {
      isSubscribe = true;
    }
    return isSubscribe;
  }

  isSetMethod(method) {
    let isSet = false;
    if (method.name && method.name.split('-')[0] === CONSTANTS.SET) {
      isSet = true;
    }
    return isSet;
  }

  /*
   * This method will filter the API call if the sdk method name is listed in the constant
   * This method has been used in Test_Runner.js > northBoundSchemaValidationAndReportGeneration()
   */
  isMethodToBeExcluded(method, communicationMode) {
    let isExcluded = false;
    if (!process.env.METHODS_TO_BE_EXCLUDED) {
      process.env.METHODS_TO_BE_EXCLUDED = getMethodExcludedListBasedOnMode(communicationMode);
    }
    if (method.name && ((process.env.METHODS_TO_BE_EXCLUDED && process.env.METHODS_TO_BE_EXCLUDED.includes(method.name)) || CONSTANTS.METHODS_TO_BE_EXCLUDED_ONLY_DEVICES.includes(method.name))) {
      isExcluded = true;
    }
    return isExcluded;
  }

  /*
   * This method will filter the API call if the sdk method name is listed in the constant
   * This method has been used in Test_Runner.js > northBoundSchemaValidationAndReportGeneration()
   */
  isExceptionMethod(methodName, methodParams) {
    const exceptionMethods = process.env.EXCEPTION_METHODS;
    let isException = false;
    if (exceptionMethods && Array.isArray(exceptionMethods)) {
      const methodInExceptionList = exceptionMethods.find((object) => {
        if (object.hasOwnProperty('param') && object.method == methodName && methodParams.find((paramsObj) => _.isEqual(object.param[paramsObj.name], paramsObj.value))) {
          return true;
        } else if (!object.hasOwnProperty('param') && object.method && object.method == methodName) {
          return true;
        } else {
          return false;
        }
      });
      if (methodInExceptionList) {
        isException = true;
      }
    }
    return isException;
  }

  shouldExcludeExample(example) {
    const platform = process.env.PLATFORM;
    const target = process.env.TARGET;
    if ((platform && platform !== CONSTANTS.PLATFORM_XCLASS) || (target && target !== CONSTANTS.PLATFORM_XCLASS)) {
      return xreExclusionList.default.exlusionList.some((e) => _.isEqual(e.examples[0].name, example.name) && _.isEqual(e.examples[0].params, example.params));
    } else {
      return false;
    }
  }
}
