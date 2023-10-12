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

import { Column, Input, Keyboard, KeyboardQwerty } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';

export default class KeyboardEntry extends lng.Component {
  static _template() {
    return {
      Wrapper: {
        y: 0,
        x: (w) => w / 2 - 430,
        type: Column,
        itemSpacing: 112,
        items: [
          {
            w: 828,
            x: 16,
            type: Input,
            placeholder: this.title || ' ',
            caption: this.caption || '',
            label: '',
            ref: 'Input',
          },
          {
            texture: lng.Tools.getRoundRect(860, 400, 16, 0, 0, true, 0xff141417),
            Keyboard: {
              x: 16,
              y: 24,
              w: 828,
              type: KeyboardQwerty,
              defaultFormat: 'lowercase',
              ref: 'Keyboard',
            },
          },
        ],
        selectedIndex: 1,
      },
    };
  }

  $onSoftKey({ key }) {
    switch (key) {
      case 'delete':
        this._Input.backspace();
        break;
      case 'done':
        this.donePending = true;
        break;
      case 'space':
        this._Input.insert(' ');
        break;
      case 'clear':
        this._Input.clear();
        break;
      case 'shift':
      case '&123':
      case 'abc':
      case 'áöû':
      case '#@!':
        break;
      default:
        this._Input.insert(key);
    }
    this.toggleTitle();
  }

  get session() {
    return this._session;
  }

  set session(session) {
    this.donePending = false;
    this._session = session;
    this.onDone = session.onDone;
    this.onCancel = session.onCancel;
    this.mask = session.mask;
    this.title = session.title;
    if (this.mask) {
      this.tag('Wrapper.Input').caption = this.caption;
      this.togglePassword = true;
      this.tag('Wrapper.Input').password = this.togglePassword;
    }
    this.toggleTitle();
  }

  toggleTitle() {
    if (this._Input.value) {
      this.tag('Wrapper.Input').label = this.title;
    } else {
      this.tag('Wrapper.Input').label = '';
      this.tag('Wrapper.Input').placeholder = this.title;
    }
  }

  $keyboardFocused(focus) {
    if (focus) {
      this._Input.listening = true;
    } else {
      this._Input.listening = false;
    }
  }

  _handleBackRelease(keyEvent) {
    keyEvent.preventDefault();
    if (this._Input.value.length === 0 && this.onCancel) {
      this.onCancel(this);
      return true;
    }
    this._Input.backspace();
    return true;
  }

  _handleEnterRelease() {
    if (this.donePending) {
      this.donePending = false;
      if (this.onDone && typeof this.onDone === 'function') {
        this.onDone(this, this._Input.value);
      }
    }
  }

  _getFocused() {
    return this._Wrapper || this;
  }

  get _Wrapper() {
    return this.tag('Wrapper.Keyboard');
  }

  get _Input() {
    return this.tag('Wrapper.Input');
  }

  get announce() {
    return [];
  }
}
