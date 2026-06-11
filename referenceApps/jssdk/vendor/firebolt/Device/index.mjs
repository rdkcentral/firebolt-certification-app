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

registerEvents('Device', [
  'audioChanged',
  'deviceNameChanged',
  'hdcpChanged',
  'hdrChanged',
  'nameChanged',
  'networkChanged',
  'screenResolutionChanged',
  'videoResolutionChanged',
])

Transport.registerDeprecatedMethod(
  'Device',
  'screenResolution',
  'Use Use non-Firebolt APIs specific to your platform, e.g. W3C APIs instead.',
)
Transport.registerDeprecatedMethod(
  'Device',
  'onDeviceNameChanged',
  'Use Device.name() instead.',
)
Transport.registerDeprecatedMethod(
  'Device',
  'onScreenResolutionChanged',
  'Use screenResolution instead.',
)

function version() {
  return new Promise((resolve, reject) => {
    Transport.send('device', 'version')
      .then((v) => {
        v = v || {}
        v.sdk = v.sdk || {}
        v.sdk.major = parseInt('1')
        v.sdk.minor = parseInt('7')
        v.sdk.patch = parseInt('0')
        v.sdk.readable = 'Firebolt Core SDK 1.7.0'
        resolve(v)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Methods
function audio() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'audio', params, callbackOrValue, false, true, 0)
}
function clear(...args) {
  return Events.clear('Device', ...args)
}

function distributor() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Device',
    'distributor',
    params,
    callbackOrValue,
    true,
    true,
    0,
  )
}
function hdcp() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'hdcp', params, callbackOrValue, false, true, 0)
}
function hdr() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'hdr', params, callbackOrValue, false, true, 0)
}
function id() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'id', params, callbackOrValue, true, true, 0)
}
function listen(...args) {
  return Events.listen('Device', ...args)
}

function make() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'make', params, callbackOrValue, true, true, 0)
}
function model() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'model', params, callbackOrValue, true, true, 0)
}
function name() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'name', params, callbackOrValue, false, true, 0)
}
function network() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'network', params, callbackOrValue, false, true, 0)
}
function once(...args) {
  return Events.once('Device', ...args)
}

function platform() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'platform', params, callbackOrValue, true, true, 0)
}
function screenResolution() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Device',
    'screenResolution',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function sku() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'sku', params, callbackOrValue, true, true, 0)
}
function type() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'type', params, callbackOrValue, true, true, 0)
}
function uid() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop('Device', 'uid', params, callbackOrValue, true, true, 0)
}
function videoResolution() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Device',
    'videoResolution',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}

export default {
  Events: {
    DEVICE_NAME_CHANGED: 'deviceNameChanged',
    NAME_CHANGED: 'nameChanged',
    HDCP_CHANGED: 'hdcpChanged',
    HDR_CHANGED: 'hdrChanged',
    AUDIO_CHANGED: 'audioChanged',
    SCREEN_RESOLUTION_CHANGED: 'screenResolutionChanged',
    VIDEO_RESOLUTION_CHANGED: 'videoResolutionChanged',
    NETWORK_CHANGED: 'networkChanged',
  },

  /**
   * The type of network that is currently active
   */
  NetworkState: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
  },

  /**
   * The type of network that is currently active
   */
  NetworkType: {
    WIFI: 'wifi',
    ETHERNET: 'ethernet',
    HYBRID: 'hybrid',
  },

  version,
  audio,
  clear,
  distributor,
  hdcp,
  hdr,
  id,
  listen,
  make,
  model,
  name,
  network,
  once,
  platform,
  screenResolution,
  sku,
  type,
  uid,
  videoResolution,
}
