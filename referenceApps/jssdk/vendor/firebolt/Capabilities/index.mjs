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

registerEvents('Capabilities', [
  'available',
  'granted',
  'revoked',
  'unavailable',
])

// onAvailable is accessed via listen('available, ...)

registerEventContext('Capabilities', 'available', ['capability'])
// onGranted is accessed via listen('granted, ...)

registerEventContext('Capabilities', 'granted', ['role', 'capability'])
// onRevoked is accessed via listen('revoked, ...)

registerEventContext('Capabilities', 'revoked', ['role', 'capability'])
// onUnavailable is accessed via listen('unavailable, ...)

registerEventContext('Capabilities', 'unavailable', ['capability'])

// Methods

function available(capability) {
  const transforms = null

  return Transport.send('Capabilities', 'available', { capability }, transforms)
}
function clear(...args) {
  return Events.clear('Capabilities', ...args)
}

function granted(capability, options) {
  const transforms = null

  return Transport.send(
    'Capabilities',
    'granted',
    { capability, options },
    transforms,
  )
}

function info(capabilities) {
  const transforms = null

  return Transport.send('Capabilities', 'info', { capabilities }, transforms)
}
function listen(...args) {
  return Events.listen('Capabilities', ...args)
}

function once(...args) {
  return Events.once('Capabilities', ...args)
}

function permitted(capability, options) {
  const transforms = null

  return Transport.send(
    'Capabilities',
    'permitted',
    { capability, options },
    transforms,
  )
}

function request(grants) {
  const transforms = null

  return Transport.send('Capabilities', 'request', { grants }, transforms)
}

function supported(capability) {
  const transforms = null

  return Transport.send('Capabilities', 'supported', { capability }, transforms)
}

export default {
  Events: {
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable',
    GRANTED: 'granted',
    REVOKED: 'revoked',
  },

  /**
   * Role provides access level for the app for a given capability.
   */
  Role: {
    USE: 'use',
    MANAGE: 'manage',
    PROVIDE: 'provide',
  },

  /**
   * Reasons why a Capability might not be invokable
   */
  DenyReason: {
    UNPERMITTED: 'unpermitted',
    UNSUPPORTED: 'unsupported',
    DISABLED: 'disabled',
    UNAVAILABLE: 'unavailable',
    GRANT_DENIED: 'grantDenied',
    UNGRANTED: 'ungranted',
  },

  available,
  clear,
  granted,
  info,
  listen,
  once,
  permitted,
  request,
  supported,
}
