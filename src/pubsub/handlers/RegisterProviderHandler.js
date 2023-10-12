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
import KeyboardUIProviderTest from '../../providers/KeyboardUIProviderTest';
import PinChallengeProviderTest from '../../providers/PinChallengeProviderTest';
import AckChallengeProviderTest from '../../providers/AckChallengeProviderTest';
import { CONSTANTS } from '../../constant';
const logger = require('../../utils/Logger')('RegisterProviderHandler.js');
require('dotenv').config();
export default class RegisterProviderHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }
  async handle(message) {
    let reportString;
    try {
      const providerClass = message.params.provider;
      switch (providerClass.toLowerCase()) {
        case 'keyboard':
          const keyboardDelegater = process.env.KeyboardProviderDelegater;
          keyboardDelegater.setDelegate(new KeyboardUIProviderTest());
          reportString = JSON.stringify({ report: 'Keyboard ' + CONSTANTS.PROVIDER_REGISTRATION });
          break;
        case 'pinchallenge':
          const pinChallengeDelegater = process.env.PinChalllengeProviderDelegater;
          pinChallengeDelegater.setDelegate(new PinChallengeProviderTest());
          reportString = JSON.stringify({
            report: 'PinChallenge ' + CONSTANTS.PROVIDER_REGISTRATION,
          });
          break;
        case 'ackchallenge':
          const ackChallengeDelegater = process.env.AckChallengeDelegater;
          ackChallengeDelegater.setDelegate(new AckChallengeProviderTest());
          reportString = JSON.stringify({
            report: 'AcknowledgeChallenge ' + CONSTANTS.PROVIDER_REGISTRATION,
          });
          break;
        default:
          reportString = JSON.stringify({ report: CONSTANTS.PROVIDER_REGISTRATION_FAILED });
          break;
      }
    } catch (err) {
      logger.error('Could not set up providers' + err, 'handle');
      reportString = JSON.stringify({ report: { result: CONSTANTS.PROVIDER_REGISTRATION_FAILED } });
    }
    return reportString;
  }
}
