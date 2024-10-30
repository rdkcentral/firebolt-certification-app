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
 * limitations under the License
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import lng from '@lightningjs/core';
import Menu from './Menu';
import MenuBuilder from './MenuBuilder';
import LifecycleHistory from './LifeCycleHistory';
import { Settings, Accessibility, Discovery } from '@firebolt-js/sdk';
import FireboltExampleInvoker from './FireboltExampleInvoker';
import Modal from './Modal';
import PubSubCommunication from './PubSubCommunication';
import { CONSTANTS } from './constant';
require('dotenv').config({ override: true });
import { checkMockOSRestInterface, TRUE_VALUES, getCurrentAppID } from './utils/Utils';
import { AcknowledgeChallenge, Keyboard, PinChallenge } from '@firebolt-js/manage-sdk';
import PinChallengeProviderDelegater from './providers/PinChallengeDelegater';
import KeyboardProviderDelegater from './providers/KeyboardProviderDelegater';
import AckChallengeProviderDelegater from './providers/AckChallengeDelegater';
import UserInterestDelegater from './providers/UserInterestDelegater';
const logger = require('./utils/Logger')('App.js');
import FireboltTransportInvoker from './FireboltTransportInvoker';
import { handleAsyncFunction } from './utils/Utils';
import { withAnnouncer } from '@lightningjs/ui-components';
const Base = withAnnouncer(lng.Application);
import Toast, { eventEmitter } from './Toast';
import IntentReader from 'IntentReader';

export default class App extends Base {
  static _template() {
    return {
      x: 0,
      y: 0,
      Header: {
        w: 250,
        h: 80,
        x: 1000,
        y: 5,
        Title: {},
      },
      w: 1920,
      h: 1080,
      Main: {
        w: (w) => w - 100,
        h: (h) => h - 100,
      },
      Overlays: {
        w: (w) => w,
        h: (h) => h,
        rect: true,
        color: 0xbb000000,
        zIndex: 50,
        alpha: 0,
      },
      Toast: {
        type: Toast,
        ref: 'Toast',
        alpha: 0,
        y: 380,
      },
      ToastCompl: {
        type: Toast,
        ref: 'ToastCompl',
        y: 540,
        alpha: 0,
      },
    };
  }

  async _init() {
    Settings.setLogLevel('DEBUG');
    eventEmitter.on('showToast', (message, state, tagName, color) => {
      this.showToast(message, state, tagName, color);
    });
    eventEmitter.on('accessibilityCheck', (voiceAnnouncement) => {
      this.accessibilityCheck(voiceAnnouncement);
    });
    this.toastStates = [];
    this.overlayed = false;
    this.overlayDismissTimer = null;
    const appUrl = window.location;
    const lifecycle = new URLSearchParams(appUrl.search).get('lifecycle_validation');
    const mfValue = new URLSearchParams(window.location.search).get('mf');
    const voiceGuidanceOverride = new URLSearchParams(window.location.search).get('voiceGuidance');
    this.accessibilityCheck(voiceGuidanceOverride === 'false' ? CONSTANTS.DISABLE_VOICE_ANNOUNCEMENT : CONSTANTS.ENABLE_VOICE_ANNOUNCEMENT);
    const platform = new URLSearchParams(appUrl.search).get('platform');
    const testContext = new URLSearchParams(window.location.search).get('testContext');
    const reportingId = new URLSearchParams(appUrl.search).get('reportingId');
    const standalone = new URLSearchParams(appUrl.search).get('standalone');
    const standalonePrefix = new URLSearchParams(appUrl.search).get('standalonePrefix');
    this.systemui = new URLSearchParams(window.location.search).get('systemui');
    this.pubSubUuidPresent = false;
    this.appContinue = false;
    process.env.LIFECYCLE_VALIDATION = lifecycle;
    process.env.MOCKOS = false;
    process.env.MF_VALUE = false;
    testContext ? (process.env.TESTCONTEXT = JSON.parse(testContext)) : (process.env.TESTCONTEXT = false);
    process.env.TESTCONTEXT = true; // Making TESTCONTEXT = true by default. This line will be removed in later stages when required
    process.env.REPORTINGID = reportingId;
    process.env.STANDALONE = standalone;
    process.env.STANDALONE_PREFIX = standalonePrefix;
    process.env.ID = 0;
    process.env.REGISTERPROVIDER = true;
    process.env.SDKS_AVAILABLE = [...CONSTANTS.defaultSDKs, ...CONSTANTS.additionalSDKs];

    // Set the pubSub URL if present
    process.env.PUB_SUB_URL = new URLSearchParams(appUrl.search).get('pubSubUrl');
    process.env.PUB_SUB_TOKEN = new URLSearchParams(appUrl.search).get('pubSubToken');
    process.env.MACADDRESS = new URLSearchParams(appUrl.search).get('macaddress');
    process.env.CURRENT_APPID = new URLSearchParams(appUrl.search).get('appId');
    process.env.APP_TYPE = new URLSearchParams(appUrl.search).get('appType');
    process.env.PUBSUB_SUBSCRIBE_TOPIC_SUFFIX = new URLSearchParams(appUrl.search).get('pubSubSubscribeSuffix');
    process.env.PUBSUB_PUBLISH_TOPIC_SUFFIX = new URLSearchParams(appUrl.search).get('pubSubPublishSuffix');

    if (platform) {
      process.env.PLATFORM = platform;
    } else {
      process.env.PLATFORM = CONSTANTS.DEFAULT;
    }
    // Get values from Parameter.initialization - Start
    try {
      await this.getParameterInitializationValues();
    } catch (e) {
      logger.error(JSON.stringify(e), 'init');
    }
    // Get values from Parameter.initialization - End
    if (mfValue) {
      // check whether the mf value passed in url is matches
      if ([...TRUE_VALUES, 'MF', 'MOCK'].includes(mfValue.toUpperCase())) {
        process.env.MF_VALUE = true;
        process.env.PLATFORM = CONSTANTS.PLATFORM_MOCKOS;
        // Making a Rest Call to check MockOs is running
        this.checkStatus();
      }
      const webSocket = new WebSocket(CONSTANTS.MOCKOS_PORT);
      webSocket.onopen = function () {
        process.env.MOCKOS = true;
      };
      this.pubSubListener();
    }
    const pubSubTopicUUID = new URLSearchParams(appUrl.search).get('pubsub_uuid');
    if (pubSubTopicUUID) {
      this.pubSubUuidPresent = true;
      this.pubSubListener();
    } else {
      if (this.systemui == 'true') {
        this.appId = CONSTANTS.FIREBOLT_CERT_UI_APPID;
      }
      this.pubSubListener();
    }
    getCurrentAppID().then((res) => {
      this._setState('LoadingState');
    });
  }

  async pubSubListener() {
    const pubSubListenerCreation = new PubSubCommunication();
    const webSocketConnection = await pubSubListenerCreation.startWebSocket();
  }

  async checkStatus() {
    const res = await checkMockOSRestInterface();
    if (res.status == 200) {
      process.env.MOCKOS = true;
    }
  }
  async showToast(message, state, tagName, color) {
    this.toastStates.push(state);
    this.tag(tagName).setMessage(message);
    if (color) this.tag(tagName).setColor(color);
    this.tag(tagName).show();
    setTimeout(() => {
      this.tag(tagName).hide();
      this.appContinue = true;
      this.toastStates.splice(this.toastStates.indexOf(state), 1);
      this._setState('LoadedState');
      this._refocus();
    }, CONSTANTS.NOTIFICATION_DURATION); // Duration of notification - 5000 milliseconds (5 seconds)
  }

  static _states() {
    return [
      class LoadingState extends this {
        $enter() {
          this._setState('LoadedState');
        }
      },

      class ErrorState extends this {
        $enter() {}
      },

      class LoadedState extends this {
        $enter() {
          if (!this.appContinue) {
            const systemui = new URLSearchParams(window.location.search).get('systemui');

            try {
              if (systemui) {
                AcknowledgeChallenge.provide('xrn:firebolt:capability:usergrant:acknowledgechallenge', new AckChallengeProviderDelegater(this));
                Keyboard.provide('xrn:firebolt:capability:input:keyboard', new KeyboardProviderDelegater(this));
                PinChallenge.provide('xrn:firebolt:capability:usergrant:pinchallenge', new PinChallengeProviderDelegater(this));
              } else {
                if (process.env.REGISTERPROVIDER) {
                  Discovery.provide('xrn:firebolt:capability:discovery:interest', new UserInterestDelegater(this));
                }
              }
            } catch (err) {
              logger.error('Could not set up providers' + err, 'LoadedState');
            }
            process.env.APPOBJECT = this;
            const menusBuilder = new MenuBuilder();
            LifecycleHistory.get().init(this);
            const menu = new URLSearchParams(window.location.search).get('menu');
            this.tag('Main').patch({
              MainMenu: {
                type: Menu,
                menus: menusBuilder.build(),
                initialMenu: menu,
                x: 50,
                y: 50,
              },
            });

            if (!this.pubSubUuidPresent && systemui === 'true') {
              this.setAppId(CONSTANTS.FIREBOLT_CERT_UI_APPID);
            } else {
              this.getAppId();
            }

            this._refocus();
          }
        }
        _getFocused() {
          if (this.overlayed) {
            return this.tag('Overlays.Overlay');
          } else if (this.toastStates.length > 0 && this.toastStates[this.toastStates.length - 1] === CONSTANTS.TOAST_STATE) {
            return this.tag('Toast');
          } else if (this.toastStates.length > 0 && this.toastStates[this.toastStates.length - 1] === CONSTANTS.TOAST_STATE_COMPL) {
            return this.tag('ToastCompl');
          } else {
            return this.tag('Main.MainMenu');
          }
        }
      },

      // display Exit modal after setting ExitState
      class ExitState extends this {
        $enter() {
          Settings.setLogLevel('DEBUG');
          this.patch({
            Modal: {
              type: Modal,
            },
          });
        }
        // shift focus to modal
        _getFocused() {
          return this.tag('Modal');
        }
      },
      class ToastState extends this {
        $enter() {
          this.patch({
            Toast: {
              type: Toast,
            },
          });
        }
        // shift focus to Toast
        _getFocused() {
          return this.tag('Toast');
        }
      },
      class ToastStateCompl extends this {
        $enter() {
          this.patch({
            Toast: {
              type: Toast,
            },
          });
        }
        // shift focus to Toast
        _getFocused() {
          return this.tag('ToastCompl');
        }
      },
    ];
  }

  _captureBack(keyEvent) {
    keyEvent.preventDefault();
  }

  // setting the state to display Exit modal
  _handleBackRelease() {
    if (!this.systemui && this.systemui != true) {
      this._setState('ExitState');
    }
  }

  _getFocused() {
    return this.overlayed ? this.tag('Overlays.Overlay') : this.tag('Main.MainMenu');
  }

  $dismissOverlay() {
    this.overlayed = false;
    this.tag('Overlays').patch({
      Overlay: undefined,
    });
    this.tag('Overlays').alpha = 0;
    this._refocus();
  }

  // Fetching AppID to Display on the Screen
  async getAppId() {
    getCurrentAppID().then((res) => {
      logger.info('Current Appid', res);
      this.appId = res;
      this.tag('Title').patch({ text: { text: process.env.CURRENT_APPID, fontSize: 33 } });
    });
  }

  // Fetching closedCaptions value and setting the announcer to true if the closed caption is enabled
  async accessibilityCheck(voiceAnnouncementVal) {
    const closedCaptionsMethodVal = await Accessibility.voiceGuidance();
    if (closedCaptionsMethodVal && closedCaptionsMethodVal.enabled == true && voiceAnnouncementVal) {
      this.announcerEnabled = voiceAnnouncementVal;
    }
  }

  // Set AppID
  async setAppId(appId) {
    this.appId = appId;
    this.tag('Title').patch({ text: { text: appId, fontSize: 33 } });
    process.env.CURRENT_APPID = appId;
  }

  // passing the value from exit modal based on user selection
  $invokeMethod(value) {
    if (!value) {
      // actions based on user selection true/false

      this.patch({
        Modal: undefined,
      });
      // close the exit modal stay in app
      this.appContinue = true;
      this._setState('LoadedState');
    } else {
      // using lifecycle close method to close the app ['userExit'] or  ['remoteButton']
      FireboltExampleInvoker.get().invoke(CONSTANTS.CORE.toLowerCase(), 'Lifecycle.close', ['userExit']);
    }
  }

  // dismiss toast notification and remove its state
  $dismissToast() {
    this.toastStates.pop();
    this.appContinue = true;
    this._refocus();
  }

  _handleVoiceGuidance() {
    this.announcerEnabled = !this.announcerEnabled;
  }

  _handleDebug() {
    this.debug = !this.debug;
  }
  async getParameterInitializationValues() {
    await handleAsyncFunction(FireboltExampleInvoker.get().invoke(CONSTANTS.CORE.toLowerCase(), 'Parameters.initialization', [], [])).then((res) => {
      console.log('Response of Initialization :: ', res);
      if (res != undefined) {
        const action = res[0].discovery.navigateTo.action;
        if (action == 'search') {
          let query = res[0].discovery.navigateTo.data.query;
          let lifecycle_validationString;
          query = JSON.parse(query);
          query.params.lifecycle_validation ? (lifecycle_validationString = query.params.lifecycle_validation) : (process.env.LIFECYCLE_VALIDATION = 'false');
          if (lifecycle_validationString == true) {
            process.env.LIFECYCLE_VALIDATION = 'true';
          }
          if (query.params.pubSubPublishSuffix) {
            process.env.PUBSUB_PUBLISH_TOPIC_SUFFIX = query.params.pubSubPublishSuffix;
          }

          if (query.params.pubSubSubscribeSuffix) {
            process.env.PUBSUB_SUBSCRIBE_TOPIC_SUFFIX = query.params.pubSubSubscribeSuffix;
          }
          process.env.APP_TYPE = query.params.appType ? query.params.appType.toLowerCase() : CONSTANTS.FIREBOLT_CONST;

          try {
            if (query.params.appId) {
              process.env.CURRENT_APPID = query.params.appId;
              this.tag('Title').patch({ text: { text: process.env.CURRENT_APPID, fontSize: 33 } });
            } else {
              getCurrentAppID().then((res) => {
                this.setAppId(res);
              });
            }
          } catch (err) {
            console.log('Error getting App Id :: ', err);
          }

          if (query.params.macaddress) {
            process.env.MACADDRESS = query.params.macaddress;
          } else {
            logger.error('No Mac Address Found in Parameter Initialization response...', 'getParameterInitializationValues');
          }

          if (query.params.hasOwnProperty(CONSTANTS.REGISTERPROVIDER)) {
            process.env.REGISTERPROVIDER = query.params.registerprovider;
          }

          // Set the pubSub URL if present
          console.log('2507 test log - query params', query.params);
          if (query.params.pubSubUrl) {
            process.env.PUB_SUB_URL = query.params.pubSubUrl;
            console.log('2507 test log - query params pubsuburl', process.env.PUB_SUB_URL);
          }
          // Set the pubSub token if present
          if (query.params.pubSubToken) {
            process.env.PUB_SUB_TOKEN = query.params.pubSubToken;
            console.log('2507 test log - query params pubsubtoken', process.env.PUB_SUB_TOKEN);
          }
          if (query.task) {
            setTimeout(() => {
              const intentReader = new IntentReader();
              intentReader.processIntent(query);
            }, 8000);
          }
        }
      }
    });
  }
}
