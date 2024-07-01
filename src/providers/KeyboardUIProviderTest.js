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
import KeyboardEntry from './KeyboardEntry';
const logger = require('../utils/Logger')('KeyboardUIProviderTest.js');

export default class KeyboardUIProviderTest {
  constructor(app) {
    this._app = process.env.APPOBJECT;
    logger.info(' APP OBJECT' + process.env.APPOBJECT);
  }

  standard(keyboardSession, providerSession) {
    if (!keyboardSession) return;

    if (process.env.withUi == true) {
      return new Promise((resolve, reject) => {
        this.showKeyboardUiTest(keyboardSession, false, resolve, process.env.ApiText, process.env.isCancelled);
        providerSession.focus();
        this.sleep(3000).then(() => {
          this.onDone(resolve, process.env.ApiText, process.env.isCancelled);
        });
      });
    } else {
      this._app.$dismissOverlay();
      return Promise.resolve(process.env.ApiText);
    }
  }

  email(keyboardSession, providerSession) {
    if (!keyboardSession) return;

    if (process.env.withUi == true) {
      return new Promise((resolve, reject) => {
        this.showKeyboardUiTest(keyboardSession, false, resolve, process.env.ApiText, process.env.isCancelled);
        providerSession.focus();
        this.sleep(3000).then(() => {
          this.onDone(resolve, process.env.ApiText, process.env.isCancelled);
        });
      });
    } else {
      this._app.$dismissOverlay();
      return Promise.resolve(process.env.ApiText);
    }
  }

  password(keyboardSession, providerSession) {
    if (!keyboardSession) return;

    if (process.env.withUi == true) {
      return new Promise((resolve, reject) => {
        this.showKeyboardUiTest(keyboardSession, false, resolve, process.env.ApiText, process.env.isCancelled);
        providerSession.focus();
        this.sleep(3000).then(() => {
          this.onDone(resolve, process.env.ApiText, process.env.isCancelled);
        });
      });
    } else {
      this._app.$dismissOverlay();
      return Promise.resolve(process.env.ApiText);
    }
  }

  async showKeyboardUiTest(session, mask, responder, text, isCancelled) {
    if (!session) return;

    logger.info('Got session ' + JSON.stringify(session), 'showKeyboardUiTest');
    this._app.overlayed = true;
    this._app.tag('Overlays').alpha = 1;
    this._app.tag('Overlays').patch({
      Overlay: {
        type: KeyboardEntry,
        x: (Window.width - 1000) / 2,
        y: 100,
        w: 1000,
        h: 300,
        session: {
          // onDone: (keyboard, text) => {
          //   setTimeout(() => this._app.$dismissOverlay(), 500) // Try and get lightning-ui component to use onkeyup
          //   responder({ text: process.env.keyboardText, canceled: isCancelled })
          // },
          onDone: (keyboard, text) => {
            this.onDone(responder, text, isCancelled);
          },
          mask: mask,
          title: session.message,
        },
      },
    });
    this._app._refocus();
  }

  onDone(responder, text, isCancelled) {
    setTimeout(() => this._app.$dismissOverlay(), 500); // Try and get lightning-ui component to use onkeyup
    responder(text);
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
