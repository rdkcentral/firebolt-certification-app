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

import { CONSTANTS } from '../constant';
import FireboltExampleInvoker from '../FireboltExampleInvoker';
import errorSchemaObject from '../source/errorSchema.json';
import censorDataJson from 'CensorData';

const { v4: uuidv4 } = require('uuid');
const $RefParser = require('@apidevtools/json-schema-ref-parser');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const xml2js = require('xml2js');
const logger = require('../utils/Logger')('Utils.js');

let deSchemaList, invokedSdk;
const uuid = uuidv4().replace(/-/g, '');

/**
 * This function returns a list with the result (if successful) or the error (on failure),
 * and will never in any scenario return both result and error at the same time.
 *
 * @usage let [result, err] = await handleAsyncFunction(someAsyncFunction())
 *
 * @param asyncFunc an "Asynchronous" function
 * @param timeoutInMilliSeconds timeout in milliseconds before throwing an error
 *                              as the provided promise did not resolve
 * @returns either [result, undefined] OR [undefined, err] BUT NEVER [result, err]
 */
const handleAsyncFunction = (asyncFunc, timeoutInMilliSeconds) => {
  timeoutInMilliSeconds = timeoutInMilliSeconds ? timeoutInMilliSeconds : 10000;
  const errorMessage = {
    code: 'TimeOutError',
    message: `Timed out in ${timeoutInMilliSeconds} ms.`,
  };
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(errorMessage);
    }, timeoutInMilliSeconds);
  });

  return Promise.race([asyncFunc, timeout])
    .then((result) => [result, undefined])
    .catch((err) => Promise.resolve([undefined, err]));
};

async function checkMockOSRestInterface() {
  const response = await fetch('http://localhost:3333/api/v1');
  return response;
}

const TRUE_VALUES = ['T', 'TRUE', 'YES', 'Y', '1', 'ON'];

// Dereferencing the OpenRPC json
async function dereferenceOpenRPC(mode) {
  try {
    const mergedSDKs = CONSTANTS.defaultSDKs.concat(CONSTANTS.additionalSDKs);
    const matchedConfig = mergedSDKs.filter(function (obj) {
      if (mode.includes(obj.name.toLowerCase())) {
        return obj;
      }
    });
    matchedConfig.forEach(function (obj) {
      invokedSdk = obj.name.toLowerCase();
      deSchemaList = obj.openRpc;
    });
    deSchemaList = await $RefParser.dereference(deSchemaList);
  } catch (error) {
    logger.error(error, 'dereferenceOpenRPC');
  }
  return [deSchemaList, invokedSdk];
}

/**
 * @function getschemaValidationDone
 * @description To validate schema
 * @param name - the name of the api/event to search in open rpc
 * @param response - response of the method or the event received on which the schema validation is done
 * @param sdkType -  core/manage - open rpc to fetch the schemamap
 */
async function getschemaValidationDone(name, response, sdkType) {
  let schemaValidationResult;
  [deSchemaList, invokedSdk] = await dereferenceOpenRPC(sdkType);
  return new Promise((resolve, reject) => {
    for (let methodIndex = 0; deSchemaList != undefined && deSchemaList.methods && methodIndex < deSchemaList.methods.length; methodIndex++) {
      const methodName = deSchemaList.methods[methodIndex].name;
      const methodObj = deSchemaList.methods[methodIndex];
      const schemaMap = methodObj.result.schema;
      if (methodName == name) {
        schemaValidationResult = validator.validate(response, schemaMap);
      }
    }
    resolve(schemaValidationResult);
  });
}

/**
 * @function censorData
 * @description To censor sensitive information
 * @param methodName -  the name of the method whose response needs to be masked to hide sensitive information
 * @param response - response of the method
 */
function censorData(methodName, response) {
  try {
    const json = censorDataJson;
    methodName = methodName.charAt(0).toUpperCase() + methodName.slice(1);
    if (methodName in json) {
      for (let i = 0; i < json[methodName].field.length; i++) {
        if (response[json[methodName].field[i]]) {
          const response_length = response[json[methodName].field[i]].length;
          response[json[methodName].field[i]] = response[json[methodName].field[i]].replace(response[json[methodName].field[i]].substring(2, response_length - 2), '*******');
        } else if (json[methodName].field[i] === '' && typeof response == 'string') {
          const response_length = response.length;
          response = response.replace(response.substring(2, response_length - 2), '*******');
        }
      }
    }
  } catch (err) {
    logger.error('err - missing censorData', err);
  }
  return response;
}

// Push report to S3 and return report URL
function pushReportToS3(report) {
  return new Promise(async (resolve, reject) => {
    const request = new XMLHttpRequest();
    let macAddress, reportName;
    let result, err;

    const dt = new Date();
    const fileNameAppend = String(dt.getUTCFullYear()) + String(dt.getUTCMonth()) + String(dt.getUTCDate()) + String(dt.getUTCHours()) + String(dt.getUTCMinutes()) + String(dt.getUTCSeconds());

    try {
      const parser = new xml2js.Parser();
      let parsingSuccessful = false;
      if (!process.env.MACADDRESS) {
        [result, err] = await handleAsyncFunction(FireboltExampleInvoker.get().invoke(CONSTANTS.CORE.toLowerCase(), 'Authentication.root', []));
        if (result && result.value && !err) {
          const bufferObj = Buffer.from(result.value, 'base64');
          const xmlData = bufferObj.toString('utf8');
          await new Promise((resolve, reject) => {
            parser.parseString(xmlData, function (err, result) {
              if (err) {
                parsingSuccessful = false;
                resolve();
              } else {
                const res = result['ns2:xcal-auth-message']['attribute'];
                parsingSuccessful = true;
                for (const resItem of res) {
                  if (resItem.$.key === 'device:ccpPki:estbMac') {
                    logger.info(resItem._, 'pushReportToS3');
                    macAddress = resItem._;
                  }
                }
                resolve();
              }
            });
          });
        }
      } else {
        macAddress = process.env.MACADDRESS;
        parsingSuccessful = true;
      }

      macAddress = macAddress.split(':').join('');
      reportName = macAddress + '-' + 'refAppExecReport' + '-' + fileNameAppend;
      if (parsingSuccessful && process.env.REPORTINGID && process.env.STANDALONE) {
        reportName = process.env.REPORTINGID + '-' + 'refAppExecReport' + '-' + fileNameAppend;
      }
      if (typeof parsingSuccessful !== 'undefined' && !parsingSuccessful) {
        reportName =
          process.env.REPORTINGID && process.env.STANDALONE
            ? process.env.REPORTINGID + '-' + 'refAppExecReport' + '-' + fileNameAppend
            : !process.env.REPORTINGID && process.env.STANDALONE
              ? uuid + '-' + 'refAppExecReport' + '-' + fileNameAppend
              : 'refAppExecReport' + '-' + fileNameAppend;
      }
    } catch (error) {
      logger.error(error, 'pushReportToS3');
      reportName = process.env.REPORTINGID && process.env.STANDALONE ? process.env.REPORTINGID + '-' + 'refAppExecReport' + '-' + fileNameAppend : uuid + '-' + 'refAppExecReport' + '-' + fileNameAppend;
    }

    // Uplaods to standalone url if standalone param is passed in url
    if (process.env.STANDALONE == 'true') {
      logger.debug('standalone', process.env.STANDALONE);
      const prefix = process.env.STANDALONE_PREFIX ? process.env.STANDALONE_PREFIX : 'standaloneReports';
      const reportNameSplit = reportName.split('-');
      const reportId = reportNameSplit[0];
      const restApiUrl = CONSTANTS.REPORT_PUBLISH_STANDALONE_URL + prefix + '-' + reportName + '.json';
      logger.info(`You will be able to access your report shortly at: ${CONSTANTS.REPORT_PUBLISH_STANDALONE_REPORT_URL}${prefix}/${reportId}/report.html`, 'pushReportToS3');
      request.open('POST', restApiUrl);
      request.setRequestHeader('content-type', 'application/json');
      request.send(report);
      request.onload = () => {
        logger.info('Response on load: ' + request, 'pushReportToS3');
        if (request.status == 200) {
          resolve(restApiUrl);
        } else {
          logger.error(`Error ${request.status}: ${request.statusText}`, 'pushReportToS3');
          reject(request.status);
        }
      };
    }
  });
}

/**
 * @function testDataHandler
 * @description Fetching and parsing params/content
 * @param {String} requestType - Type of request. param or content. Currently only content is supported
 * @param {String} dataIdentifier - Key to be used to fetch param or content data from external repo
 */
function testDataHandler(requestType, dataIdentifier) {
  if (requestType == 'param') {
    // Params are not used by FCA for now
    logger.info('RequestType: params. Skipping repo fetch');
    return;
  } else if (requestType == 'content') {
    const moduleName = dataIdentifier.toLowerCase();
    if (moduleName) {
      try {
        const moduleImportPath = require(`../../plugins/${moduleName}.json`);
        const stringifyData = JSON.stringify(eval(moduleImportPath));
        const parsedData = JSON.parse(stringifyData);
        if (parsedData) {
          return parsedData;
        } else {
          logger.error('Error: Requested data not found in external repo');
        }
      } catch (err) {
        logger.error('Test data repo error: ', err);
      }
    }
  } else if (requestType == 'overrideParams') {
    try {
      const moduleImportPath = require(`../../plugins/overrideParams.json`);
      return moduleImportPath;
    } catch (error) {
      logger.error('Test data repo error: ', error);
    }
  } else {
    throw CONSTANTS.INVALID_REQUEST_TYPE;
  }
}

/**
 * @function filterExamples
 * @description Filltering the programlist based on programType and offeringType
 * @param {array} programlist - Contains the number of objects related to programs like movie, series etc
 * @param {String} programType - Key to be used to filter the programlist
 * @param {String} offeringType - Key to be used to filter the programlist
 */
function filterExamples(programlist, programType, offeringType) {
  let list;
  list = programType ? programlist.filter((doc) => doc.programType === programType) : programlist;
  if (list.length == 0) {
    list = programlist;
  }
  let offeringList = offeringType ? list.filter((doc) => doc.waysToWatch[0].offeringType == offeringType) : list;
  if (offeringList.length == 0) {
    offeringList = list;
  }

  return offeringList;
}

function errorSchemaCheck(err) {
  let schemaValidationResult;
  if (errorSchemaObject) {
    schemaValidationResult = validator.validate(err, errorSchemaObject.errorSchema);
  }
  return schemaValidationResult;
}

/**
 * @function removeSetInMethodName
 * @description Remove set keyword from the method name
 * @param {String} apiName - Api name eg : closedCapions.setEnabled
 */
function removeSetInMethodName(apiName) {
  const method = apiName.split('.')[1];
  apiName = `${apiName.split('.')[0].toLowerCase()}.${apiName.split('.')[1]}`;
  let updatedMethod;
  if (method.includes('set') && !CONSTANTS.METHODS_T0_IGNORE_WHICH_HAS_SET.includes(apiName)) {
    if (method.startsWith('set') && method !== 'set') {
      const splitMethod = method.replace('set', '');
      updatedMethod = splitMethod.charAt(0).toLowerCase() + splitMethod.slice(1);
    } else {
      updatedMethod = method;
    }
  } else {
    updatedMethod = method;
  }
  return updatedMethod;
}

/**
 * @function getCurrentAppID
 * @description get the current appid with Advertising.appBundleId
 */
async function getCurrentAppID() {
  if (!process.env.CURRENT_APPID) {
    try {
      let res = await FireboltExampleInvoker.get().invoke(CONSTANTS.CORE.toLowerCase(), 'Advertising.appBundleId', []);
      const lastIndex = res.lastIndexOf('.');
      res = res.slice(0, lastIndex);
      process.env.CURRENT_APPID = res;
      return res;
    } catch (error) {
      logger.error('Error while calling Advertising.appBundleId : ' + error, 'App getAppId');
      return error;
    }
  }
}

/**
 * @function parseXACT
 * @description Parse the XACT and get the mac address
 */
async function parseXACT(xactString) {
  let macAddress = Buffer.from(xactString, 'base64').toString('ascii');
  if (macAddress.includes('estbMac')) {
    macAddress = macAddress.slice(macAddress.indexOf('estbMac') + 9, macAddress.indexOf('estbMac') + 26);
    return macAddress;
  } else {
    const decodedJwt = jwt(macAddress);
    return decodedJwt['device:ccpPki:estbMac'];
  }
}

/**
 * @function getMethodExcludedListBasedOnMode
 * @description return method exclusion list with combination of common list and list based on communicationMode
 */
function getMethodExcludedListBasedOnMode(communicationMode) {
  if (process.env.MOCKOS) {
    return CONSTANTS.EXCLUDED_METHODS_FOR_MFOS;
  } else if (communicationMode == CONSTANTS.SDK) {
    return [...CONSTANTS.METHODS_TO_BE_EXCLUDED, ...CONSTANTS.EXCLUDED_METHODS_FOR_SDK];
  } else if (communicationMode == CONSTANTS.TRANSPORT) {
    return [...CONSTANTS.METHODS_TO_BE_EXCLUDED, ...CONSTANTS.EXCLUDED_METHODS_FOR_TRANSPORT];
  } else {
    return CONSTANTS.METHODS_TO_BE_EXCLUDED;
  }
}

/**
 * @function findTypeInOneOF
 * @description To validate schema of result inside oneOf in openRPC
 * @param schemaMap - schema of result inside oneOf
 */
function findTypeInOneOF(schemaMap) {
  const values = Object.values(schemaMap)[0];
  for (let type = 0; type < values.length; type++) {
    if (values[type] && (values[type].const == 'null' || values[type].const == null || values[type].type == 'null' || values[type].type == null)) {
      return true;
    }
  }
  return false;
}

/**
 * @function overrideParamsFromTestData
 * @description To modify the params in openRPC from the external repo based on App.
 * @param methodObj - Method object taken from OPEN-RPC
 */
async function overrideParamsFromTestData(methodObj) {
  try {
    const paramsJson = testDataHandler('overrideParams');
    if (paramsJson && typeof paramsJson == 'object' && Object.keys(paramsJson).length) {
      const appID = process.env.CURRENT_APPID;
      // Checking if any data present for the passed appId
      const parsedMethod = paramsJson[appID];
      // Fetching the examples from the parsedMethod
      if (parsedMethod) {
        // Fetching the examples from the parsedMethod
        const result = parsedMethod.find((res) => res.name == methodObj.name);
        if (result) {
          // Overriding the params of copy of OPENRPC from the testData
          result.examples.forEach((example) => {
            const extractedMethod = methodObj.examples.find((exampleName) => exampleName.name == example.name);
            if (extractedMethod) {
              extractedMethod.params = example.params;
            }
          });
        }
      }
    }
  } catch (error) {
    logger.error(JSON.stringify(error), 'overrideParams');
  }
}

/**
 * @module utils
 * @function formatResponse
 * @description Formats the response based on the given parameters.
 * @param {string} message - The message to include in the response.
 * @param {string} schemaStatus - The status of schema validation.
 * @param {object} response - The response data.
 * @param {object} params - Additional parameters
 * @param {object|null} expected - The expected data (optional, defaults to null).
 * @param {boolean} sla_validation - Whether to include SLA validation (optional, defaults to false).
 * @param {number|null} apiInvocationDuration - The actual API invocation duration in milli seconds (defaults to null when sla_validation is false).
 * @param {number|null} slaValue - The expected SLA value in  illi seconds (optional, defaults to null when sla_validation is false).
 * @param {number|null} enumValue - The enum value if present (optional, defaults to null).
 * @returns {object} The formatted response.
 */
function formatResponse(message, schemaStatus, response, params, expected = null, sla_validation = false, apiInvocationDuration = null, slaValue = null, enumValue = null) {
  const formattedResponse = {
    [CONSTANTS.MESSAGE]: message,
    [CONSTANTS.SCHEMA_VALIDATION]: {
      [CONSTANTS.STATUS]: schemaStatus,
      [CONSTANTS.RESPONSE]: response,
    },
  };

  if (expected !== null) {
    formattedResponse[CONSTANTS.SCHEMA_VALIDATION].Expected = expected;
  }
  if (enumValue !== null) {
    formattedResponse[CONSTANTS.SCHEMA_VALIDATION]['Expected enums'] = enumValue;
  }
  if (params !== null) {
    formattedResponse[CONSTANTS.SCHEMA_VALIDATION].params = params;
  }

  if (sla_validation) {
    formattedResponse[CONSTANTS.SLA_VALIDATION] = {
      [CONSTANTS.STATUS]: setSLAStatus(apiInvocationDuration, slaValue),
      [CONSTANTS.ACTUAL]: apiInvocationDuration + 'ms',
      [CONSTANTS.EXPECTED]: slaValue ? slaValue + 'ms' : null,
    };
  }

  return JSON.stringify(formattedResponse, null, 1);
}

/**
 * @module utils
 * @function checkForEnum
 * @description Checks if the schema contains enum values and provides relevant information.
 * @param {object} schemaMap - The schema map containing properties and result information.
 * @returns {string|null} A message indicating enum validation or complex value, or null if not applicable.
 */
function checkForEnum(schemaMap) {
  if (schemaMap && schemaMap.properties && schemaMap.properties.result && schemaMap.properties.result.enum) {
    return `Response was validated to be one of: [ ${schemaMap.properties.result.enum} ]`;
  } else {
    const checkNestedEnums = (obj) => {
      if (obj && typeof obj === CONSTANTS.OBJECT) {
        return Object.values(obj).some((value) => value && typeof value === CONSTANTS.OBJECT && (value.enum || checkNestedEnums(value)));
      }
      return false;
    };

    if (schemaMap.properties && checkNestedEnums(schemaMap.properties.result)) {
      return CONSTANTS.COMPLEX_VALUE_TO_DISPLAY;
    } else {
      return null;
    }
  }
}

/**
 * @module utils
 * @function setSLAStatus
 * @description Determines the SLA status based on actual and expected values.
 * @param {number} actual - The actual value (e.g., API invocation duration).
 * @param {number} expected - The expected value (e.g., SLA threshold).
 * @returns {string} The SLA status ("PASSED", "FAILED", or "SKIPPED").
 */

function setSLAStatus(actual, expected) {
  if (expected == null) {
    return CONSTANTS.REPORT_STATUS.SKIPPED;
  } else if (actual < expected) {
    return CONSTANTS.REPORT_STATUS.PASSED;
  } else {
    return CONSTANTS.REPORT_STATUS.FAILED;
  }
}

/**
 * @module utils
 * @function getGlobalSla
 * @description Retrieves the global SLA value from intent
 * @returns {void} Sets the global SLA value in the environment variable if found.
 */
async function getGlobalSla() {
  // Check if GLOBAL_SLA is not null and set SLA_VALUE accordingly
  process.env.SLA_VALUE = process.env.GLOBAL_SLA !== null ? process.env.GLOBAL_SLA : CONSTANTS.DEFAULT_SLA !== null ? CONSTANTS.DEFAULT_SLA : null;
}

/**
 * @function assignModuleCapitalization
 * @description To assign module capitalization based on open-rpc.
 */

async function assignModuleCapitalization(moduleName, execution = 'core') {
  const [deSchemaList, invokedSdk] = await dereferenceOpenRPC(execution);
  const dereferenceSchemaList = _.cloneDeep(deSchemaList);
  for (let methodIndex = 0; dereferenceSchemaList != undefined && methodIndex < dereferenceSchemaList.methods.length; methodIndex++) {
    const module = dereferenceSchemaList.methods[methodIndex].name.split('.')[0];
    if (moduleName.toLowerCase() === module.toLowerCase()) {
      return module;
    }
  }
  return moduleName;
}

export {
  handleAsyncFunction,
  checkMockOSRestInterface,
  TRUE_VALUES,
  dereferenceOpenRPC,
  getschemaValidationDone,
  pushReportToS3,
  testDataHandler,
  censorData,
  filterExamples,
  errorSchemaCheck,
  removeSetInMethodName,
  getCurrentAppID,
  getMethodExcludedListBasedOnMode,
  findTypeInOneOF,
  overrideParamsFromTestData,
  parseXACT,
  formatResponse,
  getGlobalSla,
  setSLAStatus,
  checkForEnum,
  assignModuleCapitalization,
};
