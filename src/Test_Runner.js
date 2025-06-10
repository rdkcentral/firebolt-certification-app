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
import LifeCycleHistoryV1 from './LifeCycleHistoryV1';
import LifeCycleHistoryV2 from './LifeCycleHistoryV2';
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
        // Get the global sla based on the OpenRPC object and message and store in environment variable if present
        await utils.getGlobalSla();
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
                  slaValue: process.env.SLA_VALUE,
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
                    slaValue: process.env.SLA_VALUE,
                  };
                } else {
                  obj = {
                    error: errorResponse,
                    param: example.params,
                    methodWithExampleName: methodWithExampleName,
                    methodUuid: methodUuid,
                    apiExecutionStartTime: apiExecutionStartTime,
                    apiExecutionEndTime: apiExecutionEndTime,
                    slaValue: process.env.SLA_VALUE,
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
          const apiValidationResult = this.generateAPIValidationResult(schemaValidationRes, methodObj, executionStartTime, executionEndTime, suitesUuid, schema);
          if (!apiValidationResult) {
            throw new Error('Unable to generate validation result for ' + method.name);
          }
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
    const version = (process.env.FIREBOLT_V2 || '').split('.')[0]; // Get major version as string, e.g., '2'
    const lifecycleHistoryVersion = {
      1: LifeCycleHistoryV1,
      2: LifeCycleHistoryV2,
    };
    const LifecycleHistoryClass = lifecycleHistoryVersion[version];
    const lifecycleVersionHandlers = {
      version1: async () => {
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
              result = LifecycleHistoryClass.get();
            } catch (err) {
              error = err;
            }
            response = this.createResultObject(result, error);
            break;
          case CONSTANTS.LIFECYCLE_METHOD_LIST[5]:
            if (process.env.STANDALONE == true) {
              try {
                const OnInactiveEvent = LifecycleHistoryClass.get();
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
                const onForegroundEvent = LifecycleHistoryClass.get();
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
                const onBackgroundEvent = LifecycleHistoryClass.get();
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
      },
      version2: async () => {
        return 'Lifecycle 2.0 Implementation is pending.';
      },
    };
    const handler = version && version >= '2' ? lifecycleVersionHandlers.version2 : lifecycleVersionHandlers.version1;
    if (handler) {
      return await handler();
    } else {
      throw new Error('Invalid version specified');
    }
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
  generateAPIValidationResult(result, methodObj, apiExecutionStartTime, apiExecutionEndTime, suitesUuid, schemaMap) {
    // Calculate the API invocation duration
    const apiInvocationDuration = apiExecutionEndTime - apiExecutionStartTime;
    // Destructure the result object to extract necessary properties
    const { slaValue, methodWithExampleName, methodUuid: uuid, error, response, param: params, validationResult: schemaValidationResult } = result;
    let doesErrorMessageContainMethodNotFound = false;

    // Extract the method name from the methodWithExampleName
    const methodName = methodWithExampleName.split('.').slice(0, 2).join('.');
    // Check if the method is an exception method
    let isExceptionMethod = this.methodFilters.isExceptionMethod(methodName, params);
    if (methodObj.error) {
      isExceptionMethod = true;
    }
    // Determine the parsed response, prioritizing error over response
    let parsedResponse = error || response;
    // Initialize the result state object
    let resultState = {
      bool: { passed: false, failed: false, skipped: false, pending: false },
      state: CONSTANTS.REPORT_STATUS.SKIPPED,
    };
    let formattedResponse = null,
      testContext = { params, result: null, error: null },
      formattedError = null;
    testContext.value = `Specification: ${CONSTANTS.OPENRPC_URL}`;

    // Check if the error message contains "Method not found"
    if (parsedResponse && parsedResponse.error && parsedResponse.error.message) {
      doesErrorMessageContainMethodNotFound = CONSTANTS.ERROR_LIST.some((i) =>
        JSON.stringify(parsedResponse.error.message || '')
          .toLowerCase()
          .includes(i.toLowerCase())
      );
    }
    // Handle cases where there is no schema validation result and an error exists
    if (!schemaValidationResult && error) {
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
      formattedError = { err: parsedResponse };
      // Skipping the test case if the response has skipped message
      if (parsedResponse === CONSTANTS.SKIPPED_MESSAGE) {
        resultState = this.setResultState(CONSTANTS.REPORT_STATUS.SKIPPED);
        formattedResponse = JSON.stringify(
          {
            Message: parsedResponse,
            [CONSTANTS.SCHEMA_VALIDATION]: {
              Status: CONSTANTS.SCHEMA_CONTENT_SKIPPED,
            },
          },
          null,
          1
        );
      } else {
        formattedResponse = utils.formatResponse(parsedResponse, CONSTANTS.REPORT_STATUS.SKIPPED, null, params, schemaMap);
      }
    } else if (isExceptionMethod) {
      // Handle exception methods
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
      // Check if parsed response contains an error
      if (parsedResponse.error) {
        if (parsedResponse.error instanceof Error) {
          parsedResponse.error = parsedResponse.error.message;
        }
        testContext.error = parsedResponse.error;
        formattedError = { err: parsedResponse.error };

        if (schemaValidationResult.errors.length) {
          // If the response is undefined and the response doesnot have a valid result or error field
          if (parsedResponse.error == CONSTANTS.UNDEFINED_RESPONSE_MESSAGE) {
            testContext.error = null;
            let message = CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE;

            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            if (process.env.SLA_VALIDATION) {
              message =
                slaValue === null
                  ? CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                  : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                    ? CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                    : CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE;
              formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, null, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
            } else {
              // Else slaValidation flag is set to false, return formatted response without SLA Validation property
              formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, null, params, schemaMap);
            }
          } else {
            // If the API is an exception method and expects error, but the error received is not as per expected error schema format
            let message = 'Expected error, incorrect error format';
            if (process.env.SLA_VALIDATION) {
              // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
              message =
                slaValue === null
                  ? 'Expected error, incorrect error format' + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                  : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                    ? 'Expected error, incorrect error format' + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                    : 'Expected error, incorrect error format';
              formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
            } else {
              // Else slaValidation flag is set to false, return formatted response without SLA Validation property
              formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap);
            }
          }
        } else {
          // If the API is an exception method expecting error and error as per error schema is received
          resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
          // If error as per schema, error message contains method not found, marking the test case as pending or failed based on certification flag.
          if (doesErrorMessageContainMethodNotFound) {
            // If the certification flag is enabled, fail the test case; otherwise, mark it as pending.
            if (!process.env.CERTIFICATION) {
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PENDING);
            }
          }
          const enumValue = utils.checkForEnum(schemaMap) === null ? 'No enums' : utils.checkForEnum(schemaMap);
          let message = doesErrorMessageContainMethodNotFound ? 'Method not implemented by platform' : 'Expected error, received error';
          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            if (utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED || utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.SKIPPED) {
              // If slaValidation fails or skipped due to non availability of sla field, fail the test case and update sla status to failed
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
            } else {
              // If slaValidation passes, pass the test case and update sla status to passed
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
            }
            message =
              slaValue === null
                ? CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                  ? 'Expected error, received error' + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                  : 'Expected error, received error';

            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.PASSED, parsedResponse, params, null, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue, enumValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.PASSED, parsedResponse, params, null, null, null, null, enumValue);
          }
        }
      } else {
        // If the API is an exception method expecting error but received result
        let message = 'Expected error, received result';
        parsedResponse = utils.censorData(methodObj.name, parsedResponse.result);
        const formattedParsedResponse = { result: parsedResponse };
        testContext.result = parsedResponse;
        formattedError = { err: CONSTANTS.NO_ERROR_FOUND };
        if (process.env.SLA_VALIDATION) {
          // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
          message =
            slaValue === null
              ? 'Expected error, received result' + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
              : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                ? 'Expected error, received result' + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                : 'Expected error, received result';

          formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, formattedParsedResponse, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
        } else {
          // Else slaValidation flag is set to false, return formatted response without SLA Validation property
          formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, formattedParsedResponse, params, schemaMap);
        }
      }
    } else {
      // Handle non-exception methods
      resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
      // Check if parsed response contains an error
      if (parsedResponse.error) {
        if (parsedResponse.error instanceof Error) {
          parsedResponse.error = parsedResponse.error.message;
        }
        testContext.error = parsedResponse.result;
        formattedError = { err: parsedResponse };
        resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
        // If error message contains method not found, marking the test case as pending or failed based on certification flag.
        if (doesErrorMessageContainMethodNotFound) {
          let message = 'Method not implemented by platform';
          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            message =
              slaValue === null
                ? 'Method not implemented by platform' + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                  ? 'Method not implemented by platform' + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                  : 'Method not implemented by platform';
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap);
          }
          // If the certification flag is enabled, fail the test case; otherwise, mark it as pending.
          if (!process.env.CERTIFICATION) {
            resultState = this.setResultState('pending');
          }
        }
        // If received response does not have a valid result or error field
        if (parsedResponse.error == CONSTANTS.UNDEFINED_RESPONSE_MESSAGE) {
          let message = CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE;
          testContext.error = null;
          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            message =
              slaValue === null
                ? CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                  ? CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                  : CONSTANTS.NO_RESULT_OR_ERROR_MESSAGE;
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, null, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, null, params, schemaMap);
          }
        } else {
          // If the API is not an exception method and expects result, but received an unexpected error
          let message = 'Unexpected error encountered in the response';

          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            message =
              slaValue === null
                ? 'Unexpected error encountered in the response' + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                  ? 'Unexpected error encountered in the response' + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                  : 'Unexpected error encountered in the response';
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, parsedResponse, params, schemaMap);
          }
        }
      } else {
        // If no error is expected and received a response without error
        // Censor data in response
        parsedResponse = utils.censorData(methodObj.name, parsedResponse.result);
        const formattedParsedResponse = { result: parsedResponse };
        testContext.result = parsedResponse;
        formattedError = { err: CONSTANTS.NO_ERROR_FOUND };
        // If the API is not an exception method and expects result, but received result is not as per openRPC schema
        if (schemaValidationResult.errors.length) {
          let message = schemaValidationResult.errors[0].stack;
          resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            message =
              slaValue === null
                ? schemaValidationResult.errors[0].stack + '. ' + CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE
                : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED
                  ? schemaValidationResult.errors[0].stack + '. ' + CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE
                  : schemaValidationResult.errors[0].stack;
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, formattedParsedResponse, params, schemaMap, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.FAILED, formattedParsedResponse, params, schemaMap);
          }
        } else {
          // Else if the API is not an exception method and expects result and result as per openRPC schema is received
          const enumValue = utils.checkForEnum(schemaMap) === null ? 'No enums' : utils.checkForEnum(schemaMap);
          let message = null;
          if (process.env.SLA_VALIDATION) {
            // If slaValidation flag is set to true, add SLA Validation property with relevant fields to formatted response
            message = slaValue === null ? CONSTANTS.SLA_VALIDATION_SKIPPED_MESSAGE : utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED ? CONSTANTS.SLA_VALIDATION_FAILED_MESSAGE : null;
            if (utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.FAILED || utils.setSLAStatus(apiInvocationDuration, slaValue) === CONSTANTS.REPORT_STATUS.SKIPPED) {
              // If slaValidation fails or gets skipped due to non availability of sla field, fail the test case and update sla status to failed
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.FAILED);
            } else {
              // If slaValidation passes, pass the test case and update sla status to passed
              resultState = this.setResultState(CONSTANTS.REPORT_STATUS.PASSED);
            }
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.PASSED, formattedParsedResponse, params, null, process.env.SLA_VALIDATION, apiInvocationDuration, slaValue, enumValue);
          } else {
            // Else slaValidation flag is set to false, return formatted response without SLA Validation property
            formattedResponse = utils.formatResponse(message, CONSTANTS.REPORT_STATUS.PASSED, formattedParsedResponse, params, null, null, null, null, enumValue);
          }
        }
      }
    }

    // Handle cases where formattedError is a string, array, or undefined
    if (typeof formattedError == CONSTANTS.STRING || Array.isArray(formattedError) || typeof formattedError == CONSTANTS.UNDEFINED) {
      formattedError = { err: formattedError };
    }

    // Format the test context if TESTCONTEXT environment variable is set
    testContext = process.env.TESTCONTEXT ? JSON.stringify(testContext, null, 1) : null;

    // Return the formatted validation object
    return {
      title: methodWithExampleName,
      fullTitle: methodObj.name,
      duration: apiInvocationDuration,
      state: resultState.state.toLowerCase(),
      pass: resultState.bool.passed,
      fail: resultState.bool.failed,
      code: formattedResponse,
      err: formattedError,
      uuid,
      parentUUID: suitesUuid,
      timedOut: false,
      speed: CONSTANTS.FAST,
      pending: resultState.bool.pending,
      context: testContext,
      isHook: false,
      skipped: resultState.bool.skipped,
    };
  }

  // Method that will set the result state
  setResultState(status) {
    const resultState = {
      bool: { passed: false, failed: false, skipped: false, pending: false },
      state: 'skipped',
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
