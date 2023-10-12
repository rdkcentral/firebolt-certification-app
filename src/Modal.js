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

import { ButtonSmall } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import { CONSTANTS } from './constant';

// Invoke Modal components for confirmation on exit of APP
// pass user actions based on selection to app.js
export default class Modal extends lng.Component {
  static _template() {
    return {
      x: 50,
      y: 50,
      zIndex: 3,
      flex: { display: 'flex', allignItems: 'center', justifyContent: 'center' },
      Header: {
        rect: true,
        w: 600,
        h: 300,
        color: 0xff1f2f2f,

        Title: {
          x: 140,
          y: 100,
          mountY: 0.5,
          text: {
            text: CONSTANTS.EXIT_MODAL_TITLE, // text displayed in modal
            fontSize: 30,
            textAlign: 'center',
          },
        },
        texture: lng.Tools.getShadowRect(150, 40, 4, 1, 4),
        Buttons: {
          x: 100,
          y: 150,
          LeftButton: {
            type: ButtonSmall,
            title: CONSTANTS.YES,
            backgroundType: 'stroke',
            buttonText: 'Left',
            onEnter: function () {
              this.fireAncestors('$invokeMethod', true);
            },
          },
          RightButton: {
            x: 250,
            type: ButtonSmall,
            title: CONSTANTS.NO,
            backgroundType: 'stroke',
            buttonText: 'Right',
            onEnter: function () {
              this.fireAncestors('$invokeMethod', false);
            },
          },
        },
      },
    };
  }

  _init() {
    this.buttonIndex = 0;
  }

  _handleLeft() {
    this.buttonIndex = 0;
  }
  _handleRight() {
    this.buttonIndex = 1;
  }
  _getFocused() {
    return this.tag('Buttons').children[this.buttonIndex];
  }
}
