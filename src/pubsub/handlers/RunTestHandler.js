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

import BaseHandler from './BaseHandler';
import { CONSTANTS } from '../../constant';
import { Test_Runner } from 'Test_Runner';
import { getMethodExcludedListBasedOnMode } from '../../utils/Utils';
const logger = require('../../utils/Logger')('RunTestHandler.js');

const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

export default class RunTestHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    if (message.context != undefined && message.metadata != undefined) {
      this.populateReportTitleValues(message);
    }

    const communicationMode = message.context.communicationMode;

    // Disable PENDING state in suite report via intent override [FIRECERT-838]
    if (message.params && message.params.methodsToBeExcluded && (message.params.certification != null || message.params.certification != undefined)) {
      process.env.CERTIFICATION = message.params.certification;
      process.env.METHODS_TO_BE_EXCLUDED = message.params.methodsToBeExcluded;
    } else {
      process.env.CERTIFICATION = CONSTANTS.CERTIFICATION;
      process.env.METHODS_TO_BE_EXCLUDED = getMethodExcludedListBasedOnMode(communicationMode);
    }
    if (message.params && message.params.exceptionMethods) {
      process.env.EXCEPTION_METHODS = message.params.exceptionMethods;
    } else {
      process.env.EXCEPTION_METHODS = CONSTANTS.EXCEPTION_METHODS;
    }

    const validationReport = await this.getValidationReport(message);
    return JSON.stringify({ report: validationReport });

    /* removing asyncReports support.    
        if (message.asynchronous == true) {
            // JobId to be returned immediately when asynchronous parameter in message is true
            let reportId = uuidv4()
            let reportIdString = JSON.stringify({ "jobId": reportId })
            client.publish(responseTopic, reportIdString, headers)

            let validationReport = await this.getValidationReport(message)
            let reportString = JSON.stringify(validationReport);
            // Adding message to report queue
            asyncReports.enqueue({ "reportId": reportId, "report": reportString })
        }
        else if (!message.asynchronous || message.asynchronous == undefined || message.asynchronous == null) {
            let validationReport = await this.getValidationReport(message)
            let reportstring = JSON.stringify({ "report": validationReport });
            client.publish(responseTopic, reportstring, headers)
        }
        else {
            let responseString = JSON.stringify({ "error": "Invalid asynchronous field" })
            client.publish(responseTopic, responseString, headers)
        }
        */
  }

  // Method to populate env variables for report title
  populateReportTitleValues(message) {
    try {
      process.env.TARGET = message.metadata.target;
      process.env.FIREBOLT_SDK_VERSION = message.metadata.fireboltVersion;
      process.env.TARGET_VERSION = message.metadata.targetVersion;
      process.env.MODE = message.context.communicationMode;
      const platformTarget = CONSTANTS.PLATFORM_TARGET_MAPPING;
      process.env.TARGET_PLATFORM = platformTarget[process.env.TARGET];
    } catch (error) {
      logger.error('Error while fetching env variables from pubsub payload', 'populateReportTitleValues');
    }
  }

  async getValidationReport(message) {
    const sdkMode = message.action;
    process.env.COMMUNICATION_MODE = message.context.communicationMode ? message.context.communicationMode : CONSTANTS.TRANSPORT;

    const sdkInvokerInfo = new Test_Runner();
    let validatedMenu;
    const navigation = CONSTANTS.APP_NAVIGATION_MESSENGER;
    // Gamma APP invokes a method based on the sdk mode selection through Messenger
    if (CONSTANTS.PLATFORM_LIST.includes(process.env.PLATFORM)) {
      let sdks;
      if (sdkMode === CONSTANTS.FIREBOLT_ALL) {
        sdks = CONSTANTS.defaultSDKs.map((sdkObject) => sdkObject.name.toUpperCase());
        validatedMenu = await sdkInvokerInfo.northBoundSchemaValidationAndReportGeneration(sdks, navigation);
      } else if (sdkMode === CONSTANTS.LIFECYLCE_VALIDTION_METHOD) {
        validatedMenu = await sdkInvokerInfo.invokeLifecycleAPI(message.params);
      } else {
        validatedMenu = await sdkInvokerInfo.northBoundSchemaValidationAndReportGeneration(sdkMode, navigation);
      }
      return validatedMenu;
    } else {
      validatedMenu = { error: CONSTANTS.PLATFORM_ERROR_MESSAGE };
      return validatedMenu;
    }
  }
}
