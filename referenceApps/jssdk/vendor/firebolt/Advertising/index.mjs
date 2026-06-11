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

registerEvents('Advertising', ['policyChanged'])

// onPolicyChanged is accessed via listen('policyChanged, ...)

// Methods

function advertisingId(options) {
  const transforms = null

  return Transport.send('Advertising', 'advertisingId', { options }, transforms)
}

function appBundleId() {
  const transforms = null

  return Transport.send('Advertising', 'appBundleId', {}, transforms)
}
function clear(...args) {
  return Events.clear('Advertising', ...args)
}

function config(options) {
  const transforms = null

  return Transport.send('Advertising', 'config', { options }, transforms)
}

function deviceAttributes() {
  const transforms = null

  return Transport.send('Advertising', 'deviceAttributes', {}, transforms)
}
function listen(...args) {
  return Events.listen('Advertising', ...args)
}

function once(...args) {
  return Events.once('Advertising', ...args)
}

function policy() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Advertising',
    'policy',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}

export default {
  Events: {
    POLICY_CHANGED: 'policyChanged',
  },

  /**
     * The advertisement skip restriction.

Applies to fast-forward/rewind (e.g. trick mode), seeking over an entire opportunity (e.g. jump), seeking out of what's currently playing, and "Skip this ad..." features. Seeking over multiple ad opportunities only requires playback of the _last_ opportunity, not all opportunities, preceding the seek destination.

| Value        | Description                                                                    |
|--------------|--------------------------------------------------------------------------------|
| none         |No fast-forward, jump, or skip restrictions                                    |
| adsUnwatched | Restrict fast-forward, jump, and skip for unwatched ad opportunities only.     |
| adsAll       | Restrict fast-forward, jump, and skip for all ad opportunities                 |
| all          | Restrict fast-forward, jump, and skip for all ad opportunities and all content |

Namespace: `xrn:advertising:policy:skipRestriction:`


     */
  SkipRestriction: {
    NONE: 'none',
    ADS_UNWATCHED: 'adsUnwatched',
    ADS_ALL: 'adsAll',
    ALL: 'all',
  },

  advertisingId,
  appBundleId,
  clear,
  config,
  deviceAttributes,
  listen,
  once,
  policy,
}
