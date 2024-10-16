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

import App from './App';
import Window from './Window';

window.onload = function () {
  console.log("Debug Log--Line 23 file src/index.js")
  const systemui = new URLSearchParams(window.location.search).get('systemui');
  process.env.SYSTEMUI = systemui;
  // If systemui is true setting background color to purple.
  const bgColor = process.env.SYSTEMUI == 'true' ? '0xFF800080' : '0xFF123456';
  const options = {
    stage: {
      x: 0,
      y: 0,
      w: Window.width,
      h: Window.height,
      clearColor: bgColor,
      useImageWorker: false,
      precision: Window.height / 1080,
    },
    keys: {
      8: 'Back',
      27: 'Back',
      13: 'Enter',
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
      33: 'PageUp',
      34: 'PageDown',
    },
  };

  const app = new App(options);
  console.log("Debug Log--Line 52 file src/index.js")
  document.body.appendChild(app.stage.getCanvas());
};
