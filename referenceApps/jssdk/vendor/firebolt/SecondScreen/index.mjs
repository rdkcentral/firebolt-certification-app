/*
 * Copyright 2021 Comcast Cable Communications Management, LLC
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

import Transport from '../Transport/index.mjs'
import Events from '../Events/index.mjs'
import { registerEvents } from '../Events/index.mjs'
import Prop from '../Prop/index.mjs'

registerEvents('SecondScreen', [
  'closeRequest',
  'friendlyNameChanged',
  'launchRequest',
])

// onCloseRequest is accessed via listen('closeRequest, ...)

// onFriendlyNameChanged is accessed via listen('friendlyNameChanged, ...)

// onLaunchRequest is accessed via listen('launchRequest, ...)

// Methods
function clear(...args) {
  return Events.clear('SecondScreen', ...args)
}

function device(type) {
  const transforms = null

  return Transport.send('SecondScreen', 'device', { type }, transforms)
}
function friendlyName() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'SecondScreen',
    'friendlyName',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function listen(...args) {
  return Events.listen('SecondScreen', ...args)
}

function once(...args) {
  return Events.once('SecondScreen', ...args)
}

function protocols() {
  const transforms = null

  return Transport.send('SecondScreen', 'protocols', {}, transforms)
}

export default {
  Events: {
    LAUNCH_REQUEST: 'launchRequest',
    CLOSE_REQUEST: 'closeRequest',
    FRIENDLY_NAME_CHANGED: 'friendlyNameChanged',
  },

  clear,
  device,
  friendlyName,
  listen,
  once,
  protocols,
}
