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

import { Lightning, Language } from '@lightningjs/sdk';
import { Keyboard, KeyboardNumbers } from '@lightningjs/ui-components';

const SCREEN = { w: 1920, h: 1080 };
const KEYBOARD_KEY_SPACING = 8;
const KEYBOARD_KEY_WIDTH = 60;
const KEYBOARD_KEY_HEIGHT = 60;
const PROMPT_TOP_PADDING = 288;
const KEYBOARD_TOP_PADDING = 40;
const PIN_DISPLAY_TOP_PADDING = 80;
const BODY_Y = PROMPT_TOP_PADDING + 64;
const KEYBOARD_Y = BODY_Y + 40 + KEYBOARD_TOP_PADDING;
const PIN_DISPLAY_Y = KEYBOARD_Y + KEYBOARD_KEY_HEIGHT + PIN_DISPLAY_TOP_PADDING;
const DEFAULT_ANNOUNCER_CONTEXT = 'Press down to clear';

export default class PinPrompt extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        x: 0,
        y: 0,
        w: SCREEN.w,
        h: SCREEN.h,
        color: '#0D0D0F',
        zIndex: -9999,
      },
      Keyboard: {
        type: KeyboardNumbers,
        ref: 'Keyboard',
        inline: true,
        defaultFormat: 'numbers',
        centerKeyboard: true,
        x: (SCREEN.w - 10 * KEYBOARD_KEY_WIDTH - 9 * KEYBOARD_KEY_SPACING) / 2,
        y: KEYBOARD_Y,
      },
      Header: {
        x: 0,
        y: PROMPT_TOP_PADDING,
        w: SCREEN.w,
        text: {
          ...{
            fontFace: 'XfinityBrownBold',
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: -0.4,
            lineHeight: 64,
            verticalAlign: 'middle',
          },
          textColor: '#4076863487',
          textAlign: 'center',
        },
      },
      Detail: {
        x: 0,
        y: BODY_Y,
        w: SCREEN.w,
        text: {
          ...{
            fontFace: 'XfinityStandardMedium',
            fontSize: 32,
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 40,
            verticalAlign: 'middle',
          },
          textColor: '#3439329279',
          textAlign: 'center',
        },
      },
      PinDisplay: {
        x: 0,
        y: PIN_DISPLAY_Y,
        w: SCREEN.w,
        text: {
          ...{
            fontFace: 'XfinityBrownBold',
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -0.4,
            lineHeight: 72,
            verticalAlign: 'middle',
          },
          fontSize: 72,
          textColor: '#4076863487',
          textAlign: 'center',
        },
      },
    };
  }

  _construct() {
    this.pin = [];
    this.softKeyPending = null;
  }

  _getFocused() {
    return this.tag('Keyboard');
  }

  $onSoftKey(key) {
    this.softKeyPending = key.key;
  }

  pinEntry(digit) {
    this.pin.push(digit);
    this._renderPinDigits();
    if (this.pin.length === 4 && this.listener) {
      this.listener.onPinEntered(this.pin.join(''));
    }
  }

  $clearPin() {
    this.pin = [];
    this._renderPinDigits();
    const kb = this.tag('Keyboard.Numbers');
    if (kb) {
      this.tag('Keyboard').selectKeyOn(kb, { row: 0, column: 0 });
    }
  }

  _renderPinDigits() {
    let txt = '';
    for (let i = 0; i < this.pin.length; i++) {
      txt += '●   ';
    }
    for (let i = this.pin.length; i < 4; i++) {
      txt += '–   ';
    }
    this.tag('PinDisplay').text.text = txt.trim();
  }

  // eslint-disable-next-line accessor-pairs
  set header(header) {
    this.tag('Header').patch({
      text: {
        text: header,
      },
    });
  }

  // eslint-disable-next-line accessor-pairs
  set detail(detail) {
    this.tag('Detail').patch({
      text: {
        text: detail,
      },
    });
  }

  set params(params) {
    if (params.header) {
      this.header = params.header;
    }

    if (params.detail) {
      this.detail = params.detail;
    }

    if (params.listener) {
      /** @type {PinPrompt.PinPromptListener} */ this.listener = params.listener;
      this.listener.onLoaded(this);
    }
    this.fireAncestors('$announcerRefresh');
    this.$clearPin();
  }

  _handleBackRelease(keyEvent) {
    keyEvent.preventDefault();
    if (this.pin.length === 0 && this.listener) {
      this.listener.onDismissRequested();
      return true;
    }
    if (this.pin.length > 0) {
      this.pin.pop();
      this._renderPinDigits();
      return true;
    }
  }

  _handleKeyRelease(keyEvent) {
    const digit = keyEvent.keyCode - 48;
    if (digit >= 0 && digit < 10) {
      this.pinEntry('' + digit);
      return true;
    }
    return false;
  }

  _handleEnterRelease() {
    if (this.softKeyPending) {
      this.pinEntry(this.softKeyPending);
      this.softKeyPending = null;
    }
  }

  get announce() {
    return [this.tag('Header').text.text, ',', this.tag('Detail').text.text, ','];
  }

  get announceContext() {
    const ctx = Language.translate('PIN_PROMPT_ANNOUNCE_CONTEXT');
    return ctx == null ? DEFAULT_ANNOUNCER_CONTEXT : String(ctx);
  }
}

PinPrompt.PinPromptListener = class {
  onPinEntered(pin) {}
  onDismissRequested() {}
  onLoaded(view) {}
};
