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

require('dotenv').config();

export default class SetApiResponseHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    // Assign message value to process env. Use this env var to resolve values in keyboard interface
    const module = message.params.apiResponse.module;
    if (!module) {
      const defaultIdString = JSON.stringify({
        report: 'Selected module provider is not available',
      });
      return defaultIdString;
    }
    switch (module.toLowerCase()) {
      case 'pinchallenge':
        return this.setResponsePinChallenge(message);
      case 'keyboard':
        return this.setResponseKeyboard(message);
      case 'federateddata':
        return this.setResponseFederatedDataPurchasedContent(message);
      case 'ackchallenge':
        return this.setResponseAckChallenge(message);
      case 'userinterest':
        return this.setResponseUserInterestChallenge(message);
      case 'external':
        return this.setExternalResponse(message);
      default:
        const defaultIdString = JSON.stringify({
          report: 'Selected module provider is not available',
        });
        return defaultIdString;
    }
  }

  setResponsePinChallenge(message) {
    const pinChallengeParams = message.params.apiResponse.attributes[0];
    process.env.pinText = pinChallengeParams.pinText;
    process.env.pinChallengeIsCancelled = pinChallengeParams.isCancelled;
    process.env.withUi = pinChallengeParams.withUi;
    process.env.maxAttempts = pinChallengeParams.maxAttempts;
    process.env.noPinRequired = pinChallengeParams.noPinRequired;
    process.env.pinChallengeIsExit = pinChallengeParams.isExit;
    const reportIdString = JSON.stringify({ report: 'Received ApiResponse parameters' });

    return reportIdString;
  }

  setResponseKeyboard(message) {
    const keyboardParams = message.params.apiResponse.attributes[0];
    process.env.ApiText = keyboardParams.ApiText;
    process.env.isCancelled = keyboardParams.isCancelled;
    process.env.withUi = keyboardParams.withUi;
    const reportIdString = JSON.stringify({ report: 'Received keyboard ApiResponse parameters' });
    return reportIdString;
  }

  setResponseFederatedDataPurchasedContent(message) {
    const attributes = message.params.apiResponse.attributes[0];
    process.env.scenario = attributes.scenario;
    process.env.purchasedContentTestCase = attributes.purchasedContentTestCase;
    const reportIdString = JSON.stringify({
      report: 'Received federateData ApiResponse parameters',
    });
    return reportIdString;
  }

  setResponseAckChallenge(message) {
    const ackChallengeParams = message.params.apiResponse.attributes[0];
    process.env.ackChallengeIsCancelled = ackChallengeParams.isCancelled;
    process.env.withUi = ackChallengeParams.withUi;
    process.env.ackChallengeIsExit = ackChallengeParams.isExit;
    const reportIdString = JSON.stringify({ report: 'Received ApiResponse parameters' });

    return reportIdString;
  }

  setResponseUserInterestChallenge(message) {
    const userInterestData = message.params.apiResponse.attributes[0];
    process.env.userInterestKey = userInterestData.userInterestKey;
    process.env.userInterestError = userInterestData.userInterestError;
    const reportIdString = JSON.stringify({ report: 'Received UserInterest apiResponse parameters' });
    return reportIdString;
  }

  // importing external Api resonse function, which can set the pre-requisite values to external modules
  setExternalResponse(message) {
    try {
      const externalFunction = require('../../../plugins/setExternalApiResponse');
      return externalFunction.setExternalApiResponse(message);
    } catch (err) {
      return JSON.stringify({ report: 'Unable to import and set the data for external module' });
    }
  }
}
