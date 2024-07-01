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
const logger = require('../utils/Logger')('KeyboardUIProvider.js');

export default class KeyboardUIProvider {
  constructor(app) {
    this._app = app;
  }

  standard(keyboardSession, providerSession) {
    if (!keyboardSession) return;
    return new Promise((resolve, reject) => {
      this.showKeyboardUi(keyboardSession, false, resolve);
      providerSession.focus();
    });
  }

  email(keyboardSession, providerSession) {
    if (!keyboardSession) return;
    return new Promise((resolve, reject) => {
      this.showKeyboardUi(keyboardSession, false, resolve);
      providerSession.focus();
    });
  }

  password(keyboardSession, providerSession) {
    if (!keyboardSession) return;
    return new Promise((resolve, reject) => {
      this.showKeyboardUi(keyboardSession, true, resolve);
      providerSession.focus();
    });
  }

  async showKeyboardUi(session, mask, responder) {
    if (!session) return;
    logger.info('Got session ' + JSON.stringify(session), 'showKeyboardUi');
    if (this._app.overlayed === true) {
      clearTimeout(this._app.overlayDismissTimer);
      this._app.$dismissOverlay();
    }
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
          onDone: (keyboard, text) => {
            this._app.overlayDismissTimer = setTimeout(() => this._app.$dismissOverlay(), 500); // Try and get lightning-ui component to use onkeyup
            responder(text);
          },
          onCancel: (keyboard) => {
            this._app.$dismissOverlay();
            responder('');
          },
          mask: mask,
          title: session.message,
        },
      },
    });
    this._app._refocus();
  }
}
