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

import { Button, Row } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';

export default class AcknowledgePrompt extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      Background: {
        w: (w) => w,
        h: (h) => h,
        rect: true,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: 40,
        },
        color: 0xff111111,
      },
      Title: {
        x: 50,
        y: 50,
        w: (w) => w - 100,
        h: 100,
        text: {
          fontSize: 45,
        },
      },
      ActionButtons: {
        type: Row,
        x: (w) => (w - 240) / 2,
        y: (h) => h - 100,
        itemSpacing: 40,
        items: [
          {
            ref: 'GrantButton',
            minWidth: 100,
            type: Button,
            title: 'Yes',
            backgroundType: 'stroke',
            onEnterRelease: function () {
              this.fireAncestors('$grant');
              this.fireAncestors('$dismissOverlay');
            },
          },
          {
            ref: 'DenyButton',
            minWidth: 100,
            type: Button,
            title: 'No',
            backgroundType: 'stroke',
            onEnterRelease: function () {
              this.fireAncestors('$deny');
              this.fireAncestors('$dismissOverlay');
            },
          },
        ],
      },
    };
  }

  $grant() {
    if (this._params.grantCallback) {
      this._params.grantCallback();
    }
  }

  $deny() {
    if (this._params.denyCallback) {
      this._params.denyCallback();
    }
  }

  _handleBackRelease(keyEvent) {
    this._params.deferredCallback();
  }

  set params(params) {
    this._params = params;
    this.tag('Title').text.text = params.title;
  }

  get params() {
    return this._params;
  }

  _getFocused() {
    return this.tag('ActionButtons');
  }
}
AcknowledgePrompt.AcknowledgePromptListener = class {
  deferredCallback() {}
};
