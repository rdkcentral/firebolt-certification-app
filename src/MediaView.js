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

import { Lifecycle } from '@firebolt-js/sdk';
import { Button, Row } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import { MediaPlayer } from '@lightningjs/sdk';
import ToggleWithText from './ToggleWithText';
const logger = require('./utils/Logger')('MediaView.js');
export default class MediaView extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      Player: {
        x: 50,
        y: 50,
        w: 960,
        h: 540,
        type: MediaPlayer,
      },
      Row: {
        type: Row,
        neverScroll: true,
        x: 50,
        y: 1080 - 200,
        w: (w) => w,
        h: (h) => h,
        itemSpacing: 50,
        items: [
          {
            ref: 'Play',
            type: Button,
            title: 'Play',
            w: 200,
            fixed: true,
            backgroundType: 'stroke',
            onEnter: function () {
              this.fireAncestors('$play');
            },
          },
          {
            ref: 'ToggleInactive',
            type: ToggleWithText,
            title: 'Pause on inactivate. All apps should. Turn this off to test misbehaving app',
          },
        ],
      },
    };
  }

  _init() {
    const p = this.tag('Player');
    Lifecycle.listen('inactive', (event) => {
      if (event.state && this.tag('Row.ToggleInactive').checked) {
        if (p.isPlaying()) {
          logger.info('Unpausing video', '_init');
          p.playPause();
        }
      }
    });
    Lifecycle.listen('foreground', (event) => {
      if (event.state && this.tag('Row.ToggleInactive').checked) {
        const p = this.tag('Player');
        if (!p.isPlaying()) {
          logger.info('Pausing video', '_init');
          p.playPause();
        }
      }
    });
  }

  set params(params) {
    this._params = params;
  }

  get params() {
    return this._params;
  }

  $play() {
    const p = this.tag('Player');
    const btn = this.tag('Row.Play');
    if (btn.title === 'Play') {
      btn.patch({ title: 'Stop' });
      p.open('https://chariot-tests.xreapps.net/mp4/rabbit.mp4', {
        videoPosition: [p.x, p.y, p.x + p.w, p.y + p.h],
      });
    } else {
      btn.patch({ title: 'Play' });
      p.close();
    }
  }

  _getFocused() {
    return this.tag('Row');
  }
}
