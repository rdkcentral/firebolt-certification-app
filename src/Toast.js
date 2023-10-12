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

import { Lightning } from '@lightningjs/sdk';
import EventEmitter from 'eventemitter3';

// Create a new instance of the event emitter
export const eventEmitter = new EventEmitter();

// Invoke Toast Notification
export default class Toast extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 400,
      h: 100,
      color: 0xff1f2f2f,
      borderRadius: 10,
      mount: 0.5,
      x: 960,
      y: 540,
      zIndex: 100,
      Label: {
        x: 20,
        y: 40,
        text: {
          fontSize: 18,
          textColor: 0xffffffff,
          textAlign: 'left',
        },
      },
      Buttons: {
        CloseButton: {
          x: 340,
          y: 40,
          type: Lightning.components.ButtonSmall,
          backgroundType: 'stroke',
          text: {
            fontSize: 14,
            textColor: 0xffffffff,
            textAlign: 'center',
            text: 'Close',
          },
        },
      },
    };
  }

  setMessage(text) {
    this.tag('Label').text.text = text;
  }

  show() {
    this.setSmooth('alpha', 1);
  }

  hide() {
    this.patch({
      smooth: {
        alpha: 0,
      },
    });
  }

  setColor(color) {
    this.patch({
      color: color,
    });
  }

  _getFocused() {
    return this.tag('CloseButton').children[0];
  }

  _init() {
    this.buttonIndex = 0;
  }

  _handleEnter() {
    // Call the hide method when the Enter key is pressed
    this.fireAncestors('$dismissToast');
    this.hide();
  }

  _handleBackRelease() {
    // Call the hide method when the Escape or Back keys is pressed
    this.fireAncestors('$dismissToast');
    this.hide();
  }
}
