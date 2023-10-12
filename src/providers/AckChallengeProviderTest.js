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

import Window from '../Window';
import AcknowledgePrompt from './AcknowledgePrompt';
const logger = require('../utils/Logger')('AckChallengeProviderTest.js');

export default class AckChallengeProviderTest {
  constructor(app) {
    this._app = process.env.APPOBJECT;
  }

  challenge(challenge, session) {
    if (!challenge) return;
    logger.info('Got challenge ' + JSON.stringify(challenge), 'challenge');
    if (process.env.withUi == true) {
      return new Promise((resolve, reject) => {
        this.showChallengeUiTest(challenge, resolve, process.env.ackChallengeIsCancelled);
        session.focus();
        this.sleep(500).then(() => {
          this.grantDenyCallback(resolve, process.env.ackChallengeIsCancelled, process.env.ackChallengeIsExit);
        });
      });
    } else if (process.env.withUi == false) {
      if (process.env.ackChallengeIsCancelled == true) {
        return Promise.resolve({
          granted: false,
        });
      } else if (process.env.ackChallengeIsCancelled == false) {
        return Promise.resolve({
          granted: true,
        });
      }
    }
  }

  showChallengeUiTest(challenge, responder, ackChallengeIsCancelled) {
    this._app.overlayed = true;
    this._app.tag('Overlays').alpha = 1;
    this._app.tag('Overlays').patch({
      Overlay: {
        type: AcknowledgePrompt,
        x: (Window.width - 1000) / 2,
        y: (Window.height - 300) / 4,
        w: 1000,
        h: 300,
        params: {
          title: 'Do you give access to ' + challenge.requestor.name + ' to ' + challenge.capability + '?',
          grantCallback: () => {
            this.grantDenyCallback(responder, ackChallengeIsCancelled);
          },
          denyCallback: () => {
            this.grantDenyCallback(responder, ackChallengeIsCancelled);
          },
        },
      },
    });
    this._app._refocus();
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  grantDenyCallback(responder, ackChallengeIsCancelled, isExit = false) {
    new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        responder({
          granted: null,
        });
        resolve(true);
      }, 4000);
      if (ackChallengeIsCancelled == true) {
        const granted = isExit ? null : false;
        responder({
          granted: granted,
        });
        clearTimeout(timer);
        resolve(true);
      } else if (ackChallengeIsCancelled == false) {
        responder({
          granted: true,
        });
        clearTimeout(timer);
        resolve(true);
      }
      this._app.$dismissOverlay();
    });
  }
}
