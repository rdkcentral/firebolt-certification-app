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

import { Toggle } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
export default class ToggleWithText extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: 400,
      // h: h => h,
      flex: { direction: 'column' },
      text: { fontSize: 24, text: '' },
      Toggle: {
        y: 60,
        type: Toggle,
        checked: true,
        onEnterRelease: function (toggle) {
          this.fireAncestors('$onToggle', toggle.checked);
          toggle.toggle();
        },
      },
    };
  }

  $onToggle(value) {
    if (this._onToggle) {
      this._onToggle(value);
    }
  }

  set onToggle(onToggle) {
    this._onToggle = onToggle;
  }

  get onToggle() {
    return this._onToggle;
  }

  get checked() {
    return this.tag('Toggle').checked;
  }

  set title(title) {
    this.text = title;
  }

  get title() {
    return this.text;
  }

  _getFocused() {
    return this.tag('Toggle');
  }
}
