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
const logger = require('../utils/Logger')('PinChallengeProvider.js');

export default class PinChallengeProvider {
  constructor(app) {
    this._app = app;
    this.numFailures = 0;
    this.lockedTime = 0;
  }

  challenge(challenge, session) {
    if (!challenge) return;
    logger.info('Got challenge ' + JSON.stringify(challenge), 'challenge');
    if (challenge.pinSpace === 'content') {
      // no pin set for content
      return Promise.resolve({
        granted: true,
        reason: PinChallenge.ResultReason.NO_PIN_REQUIRED,
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

    return new Promise((resolve, reject) => {
      this.showChallengeUi(challenge, resolve);
      session.focus();
    });
  }

  showChallengeUi(challenge, responder) {
    new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        responder({
          granted: null,
          reason: PinChallenge.ResultReason.CANCELLED,
        });
        resolve(true);
      }, 15000);

      const self = this;
      let prompt = null;
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
                if (pin === CONSTANTS.PINS[challenge.pinSpace]) {
                  responder({
                    granted: true,
                    reason: PinChallenge.ResultReason.CORRECT_PIN,
                  });
                  clearTimeout(timer);
                  resolve(true);
                  prompt.fireAncestors('$dismissOverlay');
                } else {
                  self.numFailures++;
                  if (self.numFailures >= CONSTANTS.MAX_FAILURES) {
                    self.lockedTime = Date.now();
                    responder({
                      granted: false,
                      reason: PinChallenge.ResultReason.EXCEEDED_PIN_FAILURES,
                    });
                    clearTimeout(timer);
                    resolve(true);
                    prompt.fireAncestors('$dismissOverlay');
                  } else {
                    // show again
                    prompt.params = {
                      detail: 'That was wrong, try again.',
                    };
                    clearTimeout(timer);
                    resolve(true);
                  }
                }
              }
              onDismissRequested() {
                responder({
                  granted: null,
                  reason: PinChallenge.ResultReason.CANCELLED,
                });
                clearTimeout(timer);
                resolve(true);
                prompt.fireAncestors('$dismissOverlay');
              }
              onLoaded(view) {
                prompt = view;
              }
            })(),
          },
        },
      });
    });
    this._app._refocus();
  }
}
