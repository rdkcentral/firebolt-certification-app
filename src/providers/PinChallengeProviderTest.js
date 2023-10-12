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

import PinPrompt from './PinPrompt';
import { CONSTANTS } from '../constant';
import { PinChallenge } from '@firebolt-js/manage-sdk';
const logger = require('../utils/Logger')('PinChallengeProviderTest.js');

export default class PinChallengeProviderTest {
  constructor(app) {
    this._app = process.env.APPOBJECT;
    this.numFailures = 0;
    this.lockedTime = 0;
  }

  challenge(challenge, session) {
    if (!challenge) return;
    logger.info('Got challenge ' + JSON.stringify(challenge), 'challenge');
    // If no pin is required
    if (process.env.noPinRequired) {
      // no pin set for content
      this._app.$dismissOverlay();
      return Promise.resolve({
        granted: true,
        reason: PinChallenge.ResultReason.NO_PIN_REQUIRED,
      });
    }
    // If pin request is cancelled for withOut UI
    if (!process.env.withUi && process.env.pinChallengeIsCancelled) {
      this._app.$dismissOverlay();
      return Promise.resolve({
        granted: false,
        reason: PinChallenge.ResultReason.CANCELLED,
      });
    }
    if (Date.now() < this.lockedTime + CONSTANTS.LOCK_TIME) {
      return Promise.resolve({
        granted: false,
        reason: PinChallenge.ResultReason.EXCEEDED_PIN_FAILURES,
      });
    }

    /** Locked out time expired, reset it */
    if (this.lockedTime) {
      this.lockedTime = 0;
      this.numFailures = 0;
    }

    if (process.env.withUi) {
      return new Promise((resolve, reject) => {
        this.showChallengeUiTest(challenge, resolve);
        session.focus();
        this.sleep(3000).then(() => {
          if (process.env.pinChallengeIsCancelled) {
            this.dismissPinOverlay(resolve, process.env.pinChallengeIsExit);
          } else {
            this.afterPinEntered(process.env.pinText, resolve);
            session.focus();
          }
        });
      });
    } else {
      if (process.env.pinText === CONSTANTS.PINS.purchase) {
        this._app.$dismissOverlay();
        return Promise.resolve({
          granted: true,
          reason: PinChallenge.ResultReason.CORRECT_PIN,
        });
      } else {
        for (let numOfFailures = 1; numOfFailures <= process.env.maxAttempts; numOfFailures++) {
          if (numOfFailures == process.env.maxAttempts) {
            this._app.$dismissOverlay();
            return Promise.resolve({
              granted: false,
              reason: PinChallenge.ResultReason.EXCEEDED_PIN_FAILURES,
            });
          }
        }
      }
    }
  }

  showChallengeUiTest(challenge, responder) {
    this._app.overlayed = true;
    this._app.tag('Overlays').alpha = 1;
    this._app.tag('Overlays').patch({
      Overlay: {
        type: PinPrompt,
        params: {
          header: challenge.requestor.name + ' is requesting that you enter your ' + challenge.pinSpace + ' pin.',
          detail: ' ',
          listener: new (class extends PinPrompt.PinPromptListener {
            onPinEntered(pin) {
              afterPinEntered(pin, responder, challenge);
            }
            onDismissRequested() {
              dismissPinOverlay(responder);
            }
            onLoaded(view) {
              prompt = view;
            }
          })(),
        },
      },
    });
    this._app._refocus();
  }

  afterPinEntered(pin, responder, challenge) {
    new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        responder({
          granted: null,
          reason: PinChallenge.ResultReason.CANCELLED,
        });
        resolve(true);
      }, 5000);
      if (pin) {
        if (pin === CONSTANTS.PINS.purchase) {
          // Check whether challenge.pinspace is feteching the pin '1111'
          responder({
            granted: true,
            reason: PinChallenge.ResultReason.CORRECT_PIN,
          });
          // prompt.fireAncestors('$dismissOverlay')
          this._app.$dismissOverlay();
          clearTimeout(timer);
          resolve(true);
        } else {
          for (let numOfFailures = 1; numOfFailures <= process.env.maxAttempts; numOfFailures++) {
            if (numOfFailures == process.env.maxAttempts) {
              this._app.$dismissOverlay();
              responder({
                granted: false,
                reason: PinChallenge.ResultReason.EXCEEDED_PIN_FAILURES,
              });
              clearTimeout(timer);
              resolve(true);
            }
          }
        }
      }
    });
  }

  dismissPinOverlay(responder, isExit = false) {
    const granted = isExit ? null : false;
    responder({
      granted: granted,
      reason: PinChallenge.ResultReason.CANCELLED,
    });
    this._app.$dismissOverlay();
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
