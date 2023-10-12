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

import { Button, Column } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
export default class LifeCycleHistoryView extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      History: {
        w: (w) => w,
        h: (h) => h,
        type: Column,
      },
      Clear: {
        type: Button,
        title: 'Clear',
        y: 1080 - 200,
        x: 50,
        onEnterRelease: function () {
          this.fireAncestors('$clear');
        },
      },
    };
  }

  set params(params) {
    this._history = params.history;
    this._history.subscribe(() => {
      this._refreshHistory();
    });
    this._refreshHistory();
  }

  get params() {
    return this._params;
  }

  $clear() {
    this._history.next([]);
  }

  _refreshHistory() {
    const items = this._history.getValue().map((itm) => ({
      type: Button,
      title: `From ${itm.event.previous} to ${itm.event.state} source ${itm.event.source || 'n/a'} (${new Date(itm.timestamp).toLocaleTimeString()})`,
    }));
    this.tag('History').items = items;
  }

  _getFocused() {
    return this.tag('Clear');
  }
}
