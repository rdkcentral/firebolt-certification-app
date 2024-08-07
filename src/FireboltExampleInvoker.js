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

import { Accessibility, Account, Advertising, Authentication, Capabilities, Device, Discovery, Keyboard, Lifecycle, Localization, Metrics, Profile, Parameters, SecondScreen, SecureStorage } from '@firebolt-js/sdk';
import {
  Advertising as ManageAdvertising,
  AcknowledgeChallenge,
  Device as ManageDevice,
  Wifi,
  Account as ManageAccount,
  ClosedCaptions,
  Keyboard as ManageKeyboard,
  Localization as ManageLocalization,
  PinChallenge,
  Privacy,
  VoiceGuidance,
  UserGrants,
  Metrics as ManageMetrics,
  SecureStorage as ManageSecureStorage,
  Discovery as ManageDiscovery,
  AudioDescriptions,
  HDMIInput,
} from '@firebolt-js/manage-sdk';
import { Content } from '@firebolt-js/discovery-sdk';
import DiscoveryInvoker from './invokers/DiscoveryInvoker';
const discoveryInvoker = new DiscoveryInvoker();
const logger = require('./utils/Logger')('FireboltExampleInvoker.js');
import { removeSetInMethodName } from './utils/Utils';
import { eventEmitter } from './Toast';
import { CONSTANTS } from './constant';

// Commenting the below APIs as they have been deprecated from discovery sdk , can be uncommented when added as ripple-rpc APIs in future ticket
const MAP = {
  'discovery.purchasedContent': discoveryInvoker.purchasedContent.bind(discoveryInvoker),
  'discovery.entityInfo': discoveryInvoker.entityInfo.bind(discoveryInvoker),
  // 'content.purchases': discoveryInvoker.getPurchasedContent.bind(discoveryInvoker),
  // 'content.entity': discoveryInvoker.getEntityInfo.bind(discoveryInvoker),
};

const CORE_MODULE_MAP = {
  accessibility: Accessibility,
  account: Account,
  advertising: Advertising,
  authentication: Authentication,
  capabilities: Capabilities,
  device: Device,
  discovery: Discovery,
  keyboard: Keyboard,
  lifecycle: Lifecycle,
  localization: Localization,
  metrics: Metrics,
  profile: Profile,
  parameters: Parameters,
  secondscreen: SecondScreen,
  securestorage: SecureStorage,
};

const MANAGE_MODULE_MAP = {
  advertising: ManageAdvertising,
  acknowledgechallenge: AcknowledgeChallenge,
  device: ManageDevice,
  wifi: Wifi,
  account: ManageAccount,
  closedcaptions: ClosedCaptions,
  keyboard: ManageKeyboard,
  pinchallenge: PinChallenge,
  privacy: Privacy,
  voiceguidance: VoiceGuidance,
  localization: ManageLocalization,
  usergrants: UserGrants,
  metrics: ManageMetrics,
  securestorage: ManageSecureStorage,
  discovery: ManageDiscovery,
  audiodescriptions: AudioDescriptions,
  hdmiinput: HDMIInput,
};

const DISCOVERY_MODULE_MAP = {
  content: Content,
};

export const MODULE_MAP = {
  core: CORE_MODULE_MAP,
  manage: MANAGE_MODULE_MAP,
  discovery: DISCOVERY_MODULE_MAP,
};

// importing additional invoker which has external sdk's being exported and adding those modules in the MODULE_MAP
try {
  const additionalInvoker = require('../plugins/AdditionalExampleInvoker').default;
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
}
