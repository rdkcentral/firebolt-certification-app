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
import { registerEventContext } from '../Events/index.mjs'
import Prop from '../Prop/index.mjs'

registerEvents('HDMIInput', [
  'autoLowLatencyModeCapableChanged',
  'autoLowLatencyModeSignalChanged',
  'connectionChanged',
  'edidVersionChanged',
  'lowLatencyModeChanged',
  'signalChanged',
])

// onAutoLowLatencyModeCapableChanged is accessed via listen('autoLowLatencyModeCapableChanged, ...)

// onAutoLowLatencyModeSignalChanged is accessed via listen('autoLowLatencyModeSignalChanged, ...)

// onConnectionChanged is accessed via listen('connectionChanged, ...)

// onEdidVersionChanged is accessed via listen('edidVersionChanged, ...)

registerEventContext('HDMIInput', 'edidVersionChanged', ['port'])
// onLowLatencyModeChanged is accessed via listen('lowLatencyModeChanged, ...)

// onSignalChanged is accessed via listen('signalChanged, ...)

// Methods
function autoLowLatencyModeCapable(port) {
  let callbackOrValue = arguments[1]
  let params = { port }

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'HDMIInput',
    'autoLowLatencyModeCapable',
    params,
    callbackOrValue,
    false,
    true,
    1,
  )
}
function clear(...args) {
  return Events.clear('HDMIInput', ...args)
}

function edidVersion(port) {
  let callbackOrValue = arguments[1]
  let params = { port }

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'HDMIInput',
    'edidVersion',
    params,
    callbackOrValue,
    false,
    true,
    1,
  )
}
function listen(...args) {
  return Events.listen('HDMIInput', ...args)
}

function lowLatencyMode() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'HDMIInput',
    'lowLatencyMode',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function once(...args) {
  return Events.once('HDMIInput', ...args)
}

function port(portId) {
  const transforms = null

  return Transport.send('HDMIInput', 'port', { portId }, transforms)
}

function ports() {
  const transforms = null

  return Transport.send('HDMIInput', 'ports', {}, transforms)
}

export default {
  Events: {
    CONNECTION_CHANGED: 'connectionChanged',
    SIGNAL_CHANGED: 'signalChanged',
    AUTO_LOW_LATENCY_MODE_SIGNAL_CHANGED: 'autoLowLatencyModeSignalChanged',
    LOW_LATENCY_MODE_CHANGED: 'lowLatencyModeChanged',
    AUTO_LOW_LATENCY_MODE_CAPABLE_CHANGED: 'autoLowLatencyModeCapableChanged',
    EDID_VERSION_CHANGED: 'edidVersionChanged',
  },

  /**
   *
   */
  EDIDVersion: {
    V1_4: '1.4',
    V2_0: '2.0',
    UNKNOWN: 'unknown',
  },

  /**
   *
   */
  HDMISignalStatus: {
    NONE: 'none',
    STABLE: 'stable',
    UNSTABLE: 'unstable',
    UNSUPPORTED: 'unsupported',
    UNKNOWN: 'unknown',
  },

  autoLowLatencyModeCapable,
  clear,
  edidVersion,
  listen,
  lowLatencyMode,
  once,
  port,
  ports,
}
