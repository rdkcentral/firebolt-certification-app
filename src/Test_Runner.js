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

import { dereferenceOpenRPC } from './utils/Utils';
import FireboltExampleInvoker from './FireboltExampleInvoker';
import FireboltTransportInvoker from './FireboltTransportInvoker';

import MethodFilters from './MethodFilters';
import { CONSTANTS } from './constant';
import { handleAsyncFunction, errorSchemaCheck, overrideParamsFromTestData } from './utils/Utils';
const utils = require('./utils/Utils');
import LifecycleHistory from './LifeCycleHistory';
import { Device } from '@firebolt-js/sdk';
import { MODULE_MAP } from './FireboltExampleInvoker';
import errorSchemaObject from './source/errorSchema.json';
const $RefParser = require('@apidevtools/json-schema-ref-parser');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
const logger = require('./utils/Logger')('Test_Runner.js');
const _ = require('lodash');
const TAG = '[Test_Runner]: ';

/**
 * The following list just holds the list of UUIDs of methods having failure
 */
let execMode;
let invokedSdk;
let errorSchemaValue;

/*
Start and End time of API invocation
*/
let apiExecutionEndTime;
let apiExecutionStartTime;

export class Test_Runner {
  /**
   * Function responsible for invoking the Firebolt SDK APIs defined
   * in the Firebolt Open RPC document.
   *
   *
   * @param {*} sdkMode
   * @param {*} navigation
   * @param {*} validationViewObj
   */
  async northBoundSchemaValidationAndReportGeneration(sdkMode, navigation, validationViewObj) {
    // Holds the reference to the de referenanced Schma from Open RPC.
    this.dereferenceSchemaList;
    this.methodFilters = new MethodFilters();
    const suitesUuid = this.createUUID();
    let execModes = [];
    let reportTitle;
    let innerReport;
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    let pendingCount = 0;
    const innerMochaReport = [];
    const validationViewMenu = [];

    await this.getFireboltVersionFromSDK();
    if (sdkMode == 'undefined') {
      return { error: CONSTANTS.NOTPERFORMED };
    }
    // Logic to handle single sdk mode or array of sdk modes passed from Pubsub/ValidationView
    if (Array.isArray(sdkMode)) {
      execModes = sdkMode;
      reportTitle = this.generateReportTitleFromInputs(sdkMode);
    } else {
      execModes.push(sdkMode);
      // Setting up of reportTitle depends on sdk mode passed
      reportTitle = this.generateReportTitleFromInputs(sdkMode);
    }

    // Start time of all API invocation
    const resultStartTime = new Date();
    let suiteStartTime = new Date();
    errorSchemaValue = errorSchemaObject.errorSchema;

    // This is the list of validation Results for each api ,This is the list that will be used for creating the report
    for (const executionMode of execModes) {
      execMode = executionMode; // This is just to get the last execution mode stored globally.Not used anywhere else in the function.
      const sdkTitle = execMode;
      const validationResultList = [];
      const successList = [];
      const failureList = [];
      const skippedList = [];
      const pendingList = [];
      let deSchemaList;
      // Dereferrencing of firebolt open rpc schema
      try {
        // The deSchema is stored in the global object , if it is already initialized we dont need to do it again.
        [deSchemaList, invokedSdk] = await dereferenceOpenRPC(executionMode.toLowerCase());
        this.dereferenceSchemaList = _.cloneDeep(deSchemaList);
      } catch (error) {
        logger.error(JSON.stringify(error), 'northBoundSchemaValidationAndReportGeneration');
        // We could throw the error here and stop further processing
      }
      const communicationMode = process.env.COMMUNICATION_MODE;
      logger.info('communicationMode: ' + communicationMode, 'northBoundSchemaValidationAndReportGeneration');

      suiteStartTime = new Date(); // suite execution start time

      // Invocation of methods based on the openrpc file starts here
      // traverse the json data inside loop to get methodname & properties
      for (let methodIndex = 0; this.dereferenceSchemaList != undefined && methodIndex < this.dereferenceSchemaList.methods.length; methodIndex++) {
        const module = this.dereferenceSchemaList.methods[methodIndex].name.split('.')[0];
        apiExecutionEndTime = 0;
        apiExecutionStartTime = 0;
        let methodUuid = this.createUUID(); // uuid of this method
        const method = this.dereferenceSchemaList.methods[methodIndex];
        const methodObj = this.dereferenceSchemaList.methods[methodIndex];
        let schemaMap = methodObj.result;
        let methodWithExampleName;
        const hasContentValidationExecuted = false;
        // Logic to check for the content validation

        /**
         * Check if the module is present in the external libary.
         * if so iterate through the list of test cases in the module.
         * and invoke before,validate and after
         */

        /* list holding the result set received during each iteration, this could be from individual test or from execution of examples*/
        const schemaValidationResultSet = [];

        /*
         * if the schemaValidationResult is null at this stage. It means that external module invocation of validate
         * has failed or was not possible continue with defaultSchema validation.
         *
         * We will not go into the default schema validation if the module is Keyboard or lifecycle or discvoery.launch
         */
        if (this.methodFilters.isMethodToBeExcluded(methodObj, communicationMode) || this.methodFilters.isRpcMethod(methodObj, invokedSdk, communicationMode)) {
          const obj = {
            error: CONSTANTS.SKIPPED_MESSAGE,
            param: undefined,
            methodWithExampleName: methodObj.name,
            methodUuid: this.createUUID(),
            schemaData: schemaMap.schema,
            apiExecutionStartTime: apiExecutionStartTime,
            apiExecutionEndTime: apiExecutionEndTime,
          };
          schemaValidationResultSet.push(obj);
        } else if (!this.methodFilters.isRpcMethod(methodObj, invokedSdk, communicationMode)) {
          let example;
          if (method.examples && method.examples.length > 0) {
            overrideParamsFromTestData(method);
            for (let exampleIndex = 0; exampleIndex < method.examples.length; exampleIndex++) {
              let paramValues = [];
              if (this.methodFilters.isSubscribeMethod(method.examples[exampleIndex]) || this.methodFilters.isSetMethod(method.examples[exampleIndex])) {
                break;
              }
              if (this.methodFilters.isSetMethod(method.examples[exampleIndex])) {
                continue;
              }

              if (this.methodFilters.shouldExcludeExample(method.examples[exampleIndex])) {
                continue;
              }

              try {
                methodWithExampleName = methodObj.name + '.' + methodObj.examples[exampleIndex].name;
                methodUuid = this.createUUID();
                example = method.examples[exampleIndex];
                paramValues = example.params.map((p) => p.value);

                let result = null;

                // Overriding the schema with the below format
                const schemaFormat = {
                  type: 'object',
                  properties: {},
                };
                if (method.examples[exampleIndex].schema) {
                  schemaMap = method.examples[exampleIndex];
                } else {
                  schemaMap = method.result;
                }

                // Check if the method is an exception method
                const isExceptionMethod = this.methodFilters.isExceptionMethod(methodObj.name, example.params);
                const propertyKey = isExceptionMethod ? 'error' : 'result';

                // If the schema already has a "properties" field and does not have "error" or "result", override the schema
                if ((schemaMap.schema.hasOwnProperty('properties') && !schemaMap.schema.properties.hasOwnProperty(propertyKey)) || !schemaMap.schema.hasOwnProperty('properties')) {
                  schemaFormat.properties[propertyKey] = isExceptionMethod ? errorSchemaValue : schemaMap.schema;
                  schemaFormat.required = [propertyKey];
                  schemaMap.schema = schemaFormat;
                }

                if (communicationMode == CONSTANTS.TRANSPORT) {
                  const paramNames = method.params ? method.params.map((p) => p.name) : [];
                  result = await this.apiInvoker(method.name, paramValues, executionMode, invokedSdk, paramNames);
                } else {
                  result = await this.apiInvoker(method.name, paramValues, executionMode, invokedSdk);
                }

                const response = { result: result };
                let schemaValidationResultForEachExample = validator.validate(response, schemaMap.schema);

                if (this.methodFilters.isEventMethod(methodObj)) {
                  logger.info(TAG + `${methodObj.name} Result => ${JSON.stringify(response)}`, 'northBoundSchemaValidationAndReportGeneration');
                  if (response && response.result && typeof response.result.includes === 'function' && response.result.includes('Successful')) {
                    schemaValidationResultForEachExample = { errors: [] };
                  }
                }
                const schemaValidationResultForEachExampleSet = {
                  response: response,
                  param: example.params,
                  validationResult: schemaValidationResultForEachExample,
                  methodWithExampleName: methodWithExampleName,
                  methodUuid: methodUuid,
                  schemaData: schemaMap.schema,
                  apiExecutionStartTime: apiExecutionStartTime,
                  apiExecutionEndTime: apiExecutionEndTime,
                };
                schemaValidationResultSet.push(schemaValidationResultForEachExampleSet);
              } catch (error) {
                const errorResponse = { error: error };
                let obj;
                if (error instanceof Error) {
                  errorResponse.error = error.message;
                }
                logger.debug('TestContext Debug: Error block on api execution - has error message: ' + errorResponse.error + ' for method: ' + methodWithExampleName, 'northBoundSchemaValidationAndReportGeneration');
                // Doing schema validation for error response only if schema is present
                if (schemaMap.schema) {
                  const schemaValidationResult = validator.validate(errorResponse, schemaMap.schema);
                  obj = {
                    error: errorResponse,
                    param: example.params,
                    methodWithExampleName: methodWithExampleName,
                    validationResult: schemaValidationResult,
                    methodUuid: methodUuid,
                    schemaData: schemaMap.schema,
                    apiExecutionStartTime: apiExecutionStartTime,
                    apiExecutionEndTime: apiExecutionEndTime,
                  };
                } else {
                  obj = {
                    error: errorResponse,
                    param: example.params,
                    methodWithExampleName: methodWithExampleName,
                    methodUuid: methodUuid,
                    apiExecutionStartTime: apiExecutionStartTime,
                    apiExecutionEndTime: apiExecutionEndTime,
                  };
                }
                schemaValidationResultSet.push(obj);
              }
            }
          } else {
            // Adding on more element to err Object to display method name on the screen for multiple testcases
            logger.debug('TestContext Debug: could not find example for method: ' + methodWithExampleName, 'northBoundSchemaValidationAndReportGeneration');
            const obj = {
              error: 'Could not find an example for ' + method.name,
              param: null,
              methodWithExampleName: methodObj.name,
              methodUuid: methodUuid,
              schemaData: schemaMap.schema,
              apiExecutionStartTime: apiExecutionStartTime,
              apiExecutionEndTime: apiExecutionEndTime,
            };
            schemaValidationResultSet.push(obj);
          }
        }
        /**
         * Now we have executed and got the validation result for a particular api.
         * Either via the external module testCaseList execution or via the Example based invocation.
         * Now we need to convert this list "schemaValidationResultSet" to the appropriate structure
         * that can be put in mochaReport or in the view
         */
        for (const schemaValidationRes of schemaValidationResultSet) {
          let schema;
          if (schemaValidationRes.schemaData == undefined) {
            schema = 'Schema is undefined';
          } else {
            schema = schemaValidationRes.schemaData;
          }
          delete schemaValidationRes.schemaData;
          const executionStartTime = schemaValidationRes.apiExecutionStartTime;
          const executionEndTime = schemaValidationRes.apiExecutionEndTime;
          const apiValidationResult = this.generateAPIValidaionResult(schemaValidationRes, methodObj, executionStartTime, executionEndTime, suitesUuid, hasContentValidationExecuted, schema);
          if (apiValidationResult.pass) {
            successList.push(apiValidationResult.uuid);
          } else if (apiValidationResult.skipped) {
            skippedList.push(apiValidationResult.uuid);
          } else if (apiValidationResult.pending) {
            pendingList.push(apiValidationResult.uuid);
          } else {
            failureList.push(apiValidationResult.uuid);
          }
          validationResultList.push(apiValidationResult);
          // call function returns response of each api to display progress in console
          await this.delay(100);
          if (validationViewObj) {
            validationViewObj.fetchResult(apiValidationResult);
          }
        }
      }
      validationViewMenu.push(validationResultList);
      const suiteEndTime = new Date(); // suite execution end time
      skippedCount += skippedList.length;
      pendingCount += pendingList.length;
      successCount += successList.length;
      failureCount += failureList.length;
      innerReport = true;
      innerMochaReport.push(this.generateMochaReport(suiteStartTime, suiteEndTime, sdkTitle, validationResultList, suitesUuid, successList, failureList, skippedList, pendingList, innerReport));
    }

    const resultEndTime = new Date(); // result end time. should be the same as suite end time in case of single suite execution.
    const viewMenu = [];
    for (let i = 0; i < validationViewMenu.length; i++) {
      for (const menus of validationViewMenu[i]) {
        viewMenu.push(menus);
      }
    }
    innerReport = false;

    // TODO: Call report generation logic with start time end time,title and the validatedResultSet,
    const mochaReport = this.generateMochaReport(resultStartTime, resultEndTime, reportTitle, innerMochaReport, suitesUuid, successCount, failureCount, skippedCount, pendingCount, innerReport);

    // Send report to S3 for all the executions
    utils.pushReportToS3(JSON.stringify(mochaReport));

    if (navigation == CONSTANTS.APP_NAVIGATION_MESSENGER) {
      return mochaReport;
    }
    const finalReport = this.swapTitlesMochaReport(viewMenu);
    return finalReport;
  }

  extractParamsFromExamplesInJson(example) {
    const jsonObj = {};
    if (!example) {
      return jsonObj;
    }

    for (const param of example.params) {
      jsonObj[param.name] = param.value;
    }

    return jsonObj;
  }

  async invokingApiFromExternalModule(testCaseObject, schemaMap, methodUuid, methodWithExampleName, method, execMode) {
    if (typeof testCaseObject.before === 'function') {
      await testCaseObject.before(method.name, execMode);
    }
    // send the callback function pointer for api invocation and the schema map to the external module
    let schemaValidationResult;
    if (typeof testCaseObject.validate === 'function') {
      schemaValidationResult = await testCaseObject.validate(this.apiInvoker, schemaMap);
    }

    schemaValidationResult.methodWithExampleName = methodWithExampleName;
    schemaValidationResult.methodUuid = methodUuid;
    if (typeof testCaseObject.after === 'function') {
      await testCaseObject.after();
    }
    return schemaValidationResult;
  }
  generateMochaReport(validationStartTime, validationEndTime, reportTitle, validationResultList, suitesUuid, successList, failureList, skippedList, pendingList, innerReport) {
    // Mocha Report
    // Below listed values are declared for the report generation
    const reportUuid = this.createUUID();
    const reportValue = {
      uuid: '',
      title: '',
      fullFile: '',
      file: '',
      beforeHooks: [],
      afterHooks: [],
      tests: [],
      suites: [],
      passes: [],
      failures: [],
      pending: [],
      skipped: [],
      duration: 0,
      root: false,
      rootEmpty: false,
      _timeout: 0,
    };
    const mochaReport = {
      stats: {
        pending: 0,
        pendingPercent: 0,
        other: 0,
        hasOther: false,
        skipped: 0,
        hasSkipped: false,
      },
      results: [],
    };
    let validatedReport = {};
    const suitesReport = [];
    let customiseReport = {};
    // Mocha report generation starts here
    if (innerReport) {
      validatedReport = Object.assign(validatedReport, reportValue);
      validatedReport.uuid = suitesUuid;
      validatedReport.tests = validationResultList;
      validatedReport.title = reportTitle;
      validatedReport.passes = successList;
      validatedReport.failures = failureList;
      validatedReport.skipped = skippedList;
      validatedReport.pending = pendingList;
      validatedReport.duration = validationEndTime - validationStartTime;
      return validatedReport;
    } else {
      for (const suites of validationResultList) {
        suitesReport.push(suites);
      }
      customiseReport = Object.assign(customiseReport, reportValue);
      customiseReport.suites = suitesReport;
      customiseReport.title = reportTitle;
      customiseReport.uuid = reportUuid;
      mochaReport.results.push(customiseReport);
    }

    // Mocha report generation starts construction starts here
    // Stats are constructed based on the report generated from list validated

    mochaReport.stats.suites = parseInt(suitesReport.length);
    mochaReport.stats.duration = validationEndTime - validationStartTime;
    mochaReport.stats.tests = successList + failureList + skippedList + pendingList;
    mochaReport.stats.start = validationStartTime.toISOString();
    mochaReport.stats.end = validationEndTime.toISOString();
    mochaReport.stats.testsRegistered = successList + failureList + skippedList + pendingList;
    mochaReport.stats.passes = successList;
    mochaReport.stats.failures = failureList;
    mochaReport.stats.skipped = skippedList;
    mochaReport.stats.pending = pendingList;
    mochaReport.stats.pendingPercent = parseInt((mochaReport.stats.pending / mochaReport.stats.tests).toFixed(2) * 100);
    mochaReport.stats.passPercent = parseInt((mochaReport.stats.passes / mochaReport.stats.tests).toFixed(2) * 100);
    if (mochaReport.stats.skipped > 0) {
      mochaReport.stats.hasSkipped = true;
    }
    return mochaReport;
  }

  /**
   * Function responsible for invoking the API using SDK.
   * @param {*} method
   * @param {*} params
   * @param {*} executionMode
   * @param {*} sdk
   * @param {*} paramsArray
   * @returns
   */
  async apiInvoker(method, params, executionMode, sdk, paramsArray = null) {
    let response;
    let err;
    // if execution mode is not passed by the caller it would take the last execution mode invoked by Test_Runner
    if (!executionMode) {
      executionMode = execMode;
    }
    if (!sdk) {
      sdk = invokedSdk;
    }
    executionMode = executionMode.toUpperCase();

    if (executionMode.includes(CONSTANTS.MANAGE) || executionMode.includes(CONSTANTS.CORE) || executionMode.includes(CONSTANTS.DISCOVERY)) {
      apiExecutionStartTime = new Date(); // api execution start time
      [response, err] = paramsArray
        ? await handleAsyncFunction(FireboltTransportInvoker.get().invoke(method, params, paramsArray))
        : await handleAsyncFunction(FireboltExampleInvoker.get().invoke(sdk, method, params, null, paramsArray));
      apiExecutionEndTime = new Date(); // api execution end time
      // To handle event response trimming observed when events invoked via transport mode
      if (response) {
        if (response.hasOwnProperty('event') == true) {
          const module = method.split('.')[0].toLowerCase();
          const event = response.event;
          if (event.includes('.on') == false) {
            response.event = module + '.' + response.event;
          }
        }
      }
    } else {
      response = CONSTANTS.NOTPERFORMED;
    }
    // If an error happens while invoking the function throw error
    if (err) {
      throw err;
    } else {
      if (response === undefined) {
        throw CONSTANTS.UNDEFINED_RESPONSE_MESSAGE;
      }
    }
    return response;
  }

  /**
   * When  Lifecycle validation is done from bolt. All event handling in
   * all Lifecycle api calls (default behavior of calling lifecycle.ready and lifecycle.finished)
   * will be disabled. API calls will be made based on the messages sent from bolt.
   */
  async invokeLifecycleAPI(methods) {
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[0]:
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[1]:
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[2]:
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

      case CONSTANTS.LIFECYCLE_METHOD_LIST[3]:
        /**
         * Directly calling finish is not an expected behavior of the app.
         * Finish should ideally be called by the app when unload event is generated.
         * For testing, we expect bolt to launch multiple apps and create a memory crunch
         * which would force the platform to generate and unload event.
         * TODO: Approach for the validation of lifecycle.finish() is yet to be decided.
         */
        break;
      case CONSTANTS.LIFECYCLE_METHOD_LIST[4]:
        try {
          result = LifecycleHistory.get();
        } catch (err) {
          error = err;
        }
        response = this.createResultObject(result, error);
        break;
      case CONSTANTS.LIFECYCLE_METHOD_LIST[5]:
        if (process.env.STANDALONE == true) {
          try {
            const OnInactiveEvent = LifecycleHistory.get();
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[6]:
        if (process.env.STANDALONE == true) {
          try {
            const onForegroundEvent = LifecycleHistory.get();
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[7]:
        if (process.env.STANDALONE == true) {
          try {
            const onBackgroundEvent = LifecycleHistory.get();
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
      case CONSTANTS.LIFECYCLE_METHOD_LIST[8]:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE_METHOD_LIST[10]:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE_METHOD_LIST[11]:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      case CONSTANTS.LIFECYCLE_METHOD_LIST[12]:
        result = await this.lifecycleMethodCalls(method, params);
        response = this.createResultObject(result.response, result.error);
        break;
      default:
        response = 'Invalid lifecycle method passed';
    }
    return response;
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

  async lifecycleMethodCalls(method, params) {
    let response, err;
    const paramNames = params ? Object.keys(params) : [];
    params = params ? Object.values(params) : [];
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

  createUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
  /**
        Function to fetch Lifecycle API response and validate the schema
    */
  schemaValidation(response, methodSchema) {
    let validationResult;
    const schemaMapResult = validator.validate(response, methodSchema[0].result.schema);
    if (schemaMapResult.errors.length > 0 || response === undefined) {
      validationResult = {
        status: CONSTANTS.FAIL,
        schemaValidationResult: schemaMapResult,
      };
    } else {
      validationResult = {
        status: CONSTANTS.PASS,
        schemaValidationResult: schemaMapResult,
      };
    }
    return validationResult;
  }

  delay(ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  }

  // Swapping titles to append in mocha report
  swapTitlesMochaReport(validationResultList) {
    for (let i = 0; i < validationResultList.length; i++) {
      const titl = validationResultList[i].title;
      validationResultList[i].title = validationResultList[i].fullTitle;
      validationResultList[i].fullTitle = titl;
    }
    return validationResultList;
  }

  // Consolidated function to generate Validation result for both success case and error case
  generateAPIValidaionResult(result, methodObj, apiExecutionStartTime, apiExecutionEndTime, suitesUuid, hasContentValidationExecuted, schemaMap) {
    let resultState = {
      bool: { passed: false, failed: false, skipped: false, pending: false },
      state: CONSTANTS.REPORT_STATUS.SKIPPED,
    };
    let convertedResponse = null;
    let testContext = null;
    let convertedError = null;
    const methodWithExampleName = result.methodWithExampleName;
    const uuid = result.methodUuid;
    let parsedResponse = result.error ? result.error : result.response;
    let doesErrorMessageContainMethodNotFound = false;
    const params = result.param;
    const methodName = result.methodWithExampleName.split('.')[0] + '.' + result.methodWithExampleName.split('.')[1];
    const isExceptionMethod = this.methodFilters.isExceptionMethod(methodName, params);
    const schemaValidationResult = result.validationResult;
    // Check if the error message contains "Method not found"
    if (parsedResponse && parsedResponse.error && parsedResponse.error.message) {
      doesErrorMessageContainMethodNotFound = CONSTANTS.ERROR_LIST.some((i) =>
        JSON.stringify(parsedResponse.error.message || '')
          .toLowerCase()
          .includes(i.toLowerCase())
      );
    }
    testContext = {
      params: params,
      result: null,
      error: null,
    };

    if (!schemaValidationResult && result.error) {
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
      convertedError = { err: parsedResponse };
      // Skipping the test case if the response having skipped message
      if (parsedResponse === CONSTANTS.SKIPPED_MESSAGE) {
        resultState = this.setResultState(CONSTANTS.REPORT_STATUS.SKIPPED);
        convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.SCHEMA_CONTENT_SKIPPED, Message: parsedResponse }, null, 1);
      } else {
        convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.SCHEMA_CONTENT_SKIPPED, Message: parsedResponse, Response: null, Expected: schemaMap, params: params }, null, 1);
      }
    } else if (isExceptionMethod) {
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
      // Check if parsed response contains an error
      if (parsedResponse && parsedResponse.error) {
        testContext.error = parsedResponse.error;
        convertedError = { err: parsedResponse.error };
        // If it is an exception method, and not as per schema, fail the test case.
        if (schemaValidationResult && schemaValidationResult.errors && schemaValidationResult.errors.length > 0) {
          // Response did not have error or result
          if (parsedResponse.error == CONSTANTS.UNDEFINED_RESPONSE_MESSAGE) {
            testContext.error = null;
            convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE, Response: null, Expected: schemaMap, params: params }, null, 1);
          } else {
            convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: 'Expected error, incorrect error format', Response: parsedResponse, Expected: schemaMap, params: params }, null, 1);
          }
        } else {
          // If error as per schema, error message contains method not found, marking the test case as pending or failed based on certification flag.
          if (doesErrorMessageContainMethodNotFound) {
            convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.PASSED, Message: 'Method not implemented by platform', Response: parsedResponse, params: params }, null, 1);
            // If the certification flag is enabled, fail the test case; otherwise, mark it as pending.
            if (!process.env.CERTIFICATION) {
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PENDING);
            }
          } else {
            // Exception method, and as per schema, marking the test case as passed.
            resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
            convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.PASSED, Message: 'Expected error, received error', Response: parsedResponse, params: params }, null, 1);
          }
        }
      } else {
        // Censoring the response for the specific method
        parsedResponse = utils.censorData(methodObj.name, parsedResponse.result);
        testContext.result = parsedResponse;
        convertedError = { err: CONSTANTS.NO_ERROR_FOUND };
        // Expecting an error, but received a result, marking the test case as failed.
        convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: 'Expected error, received result', Response: { result: parsedResponse }, Expected: schemaMap, params: params }, null, 1);
      }
    } else {
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
      // Check if the response is an error
      if (parsedResponse && parsedResponse.error) {
        testContext.error = parsedResponse.result;
        convertedError = { err: parsedResponse };
        resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
        // If error message contains method not found, marking the test case as pending or failed based on certification flag.
        if (doesErrorMessageContainMethodNotFound) {
          convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: 'Method not implemented by platform', Response: parsedResponse, Expected: schemaMap, params: params }, null, 1);
          // If the certification flag is enabled, fail the test case; otherwise, mark it as pending.
          if (!process.env.CERTIFICATION) {
            resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PENDING);
          }
        }
        // Response did not have error or result
        else if (parsedResponse.error == CONSTANTS.UNDEFINED_RESPONSE_MESSAGE) {
          testContext.error = null;
          convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE, Response: null, Expected: schemaMap, params: params }, null, 1);
        } else {
          // Expecting an result, but received an error, marking the test case as failed.
          convertedResponse = JSON.stringify(
            { [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: 'Unexpected error encountered in the response', Response: parsedResponse, Expected: schemaMap, params: params },
            null,
            1
          );
        }
      } else {
        // Censoring the response for the specific method
        parsedResponse = utils.censorData(methodObj.name, parsedResponse.result);
        testContext.result = parsedResponse;
        convertedError = { err: CONSTANTS.NO_ERROR_FOUND };
        // If the response is not as per schema, marking the test case as failed else passed.
        if (schemaValidationResult && schemaValidationResult.errors && schemaValidationResult.errors.length > 0) {
          resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
          convertedResponse = JSON.stringify(
            { [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.FAILED, Message: schemaValidationResult.errors[0].stack, Response: { result: parsedResponse }, Expected: schemaMap, params: params },
            null,
            1
          );
        } else {
          convertedResponse = JSON.stringify({ [CONSTANTS.SCHEMA_VALIDATION]: CONSTANTS.PASSED, Message: null, Response: { result: parsedResponse }, params: params }, null, 1);
        }
      }
    }
    if (typeof convertedError == 'string' || Array.isArray(convertedError) || typeof convertedError == 'undefined') {
      convertedError = { err: convertedError };
    }

    !process.env.TESTCONTEXT ? (testContext = null) : (testContext = JSON.stringify(testContext, null, 1));
    const apiInvocationDuration = apiExecutionEndTime - apiExecutionStartTime;
    const apiValidationResult = {
      title: methodWithExampleName,
      fullTitle: methodObj.name,
      duration: apiInvocationDuration,
      state: resultState.state.toLowerCase(),
      pass: resultState.bool.passed,
      fail: resultState.bool.failed,
      code: convertedResponse,
      err: convertedError,
      uuid: uuid,
      parentUUID: suitesUuid,
      timedOut: false,
      speed: 'fast',
      pending: resultState.bool.pending,
      context: testContext,
      isHook: false,
      skipped: resultState.bool.skipped,
    };
    return apiValidationResult;
  }

  // Method that will set the result state
  setResultState(status) {
    const resultState = {
      bool: { passed: false, failed: false, skipped: false, pending: false },
      state: CONSTANTS.REPORT_STATUS.SKIPPED,
    };
    for (const state in resultState.bool) {
      if (state === status) {
        resultState.bool[state] = true;
        resultState.state = status;
      } else {
        resultState.bool[state] = false;
      }
    }
    return resultState;
  }

  // Method to generate report title from inputs
  generateReportTitleFromInputs(mode) {
    let reportTitle = mode;

    let reportTitleGenerated = '';
    if (process.env.FIREBOLT_SDK_VERSION) {
      reportTitleGenerated = 'Firebolt SDK Version : ' + process.env.FIREBOLT_SDK_VERSION;
    }
    if (process.env.TARGET_VERSION && process.env.TARGET_PLATFORM) {
      reportTitleGenerated = reportTitleGenerated + ', ' + process.env.TARGET_PLATFORM + ' Version : ' + process.env.TARGET_VERSION;
    }
    if (process.env.COMMUNICATION_MODE) {
      reportTitle = process.env.COMMUNICATION_MODE;
    }
    if (mode) {
      reportTitleGenerated = reportTitleGenerated + ' , Mode : ' + reportTitle;
    }
    if (process.env.FIRMWARE_VERSION) {
      reportTitleGenerated = reportTitleGenerated + ' , Firmware : ' + process.env.FIRMWARE_VERSION;
    }
    if (process.env.HASH_VERSION) {
      reportTitleGenerated = reportTitleGenerated + ' , Hash : ' + process.env.HASH_VERSION;
    }
    if (process.env.CURRENT_APPID) {
      reportTitleGenerated = reportTitleGenerated + ' , AppId : ' + process.env.CURRENT_APPID;
    }

    return reportTitleGenerated;
  }

  // Method to get SDK version from device.version api call
  async getFireboltVersionFromSDK() {
    let platformGeneratorString = '';
    try {
      const versionFromSDK = await Device.version();
      if (!process.env.FIREBOLT_SDK_VERSION) {
        const sdkVersion = versionFromSDK['sdk'];
        const values = Object.values(sdkVersion);
        for (let val = 0; val < values.length - 1; val++) {
          platformGeneratorString = values[val] + '.' + platformGeneratorString;
        }
        const rcVersion = values[values.length - 1].substring(values[values.length - 1].indexOf('[') + 1, values[values.length - 1].lastIndexOf(']'));
        platformGeneratorString = platformGeneratorString.slice(0, -1) + '-';
        const subVersion = rcVersion.split(' ');
        platformGeneratorString = platformGeneratorString + subVersion[0].toLowerCase() + '.' + subVersion[1];
        process.env.FIREBOLT_SDK_VERSION = platformGeneratorString;
      }
      const debug = versionFromSDK['debug'];
      const firmwareData = versionFromSDK['firmware'];
      const firmware = firmwareData.readable;
      process.env.FIRMWARE_VERSION = firmware;
      const hash = debug.split(' ')[1].replace('(', '').replace(')', '');
      process.env.HASH_VERSION = hash;
    } catch (err) {
      logger.info('Error occured while generating sdk version', err, 'getFireboltVersionFromSDK');
    }
  }
}
