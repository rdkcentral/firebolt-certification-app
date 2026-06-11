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

registerEvents('Accessibility', [
  'audioDescriptionSettingsChanged',
  'closedCaptionsSettingsChanged',
  'highContrastUIChanged',
  'voiceGuidanceSettingsChanged',
])

Transport.registerDeprecatedMethod(
  'Accessibility',
  'closedCaptions',
  'Use Accessibility.closedCaptionsSettings() instead.',
)
Transport.registerDeprecatedMethod(
  'Accessibility',
  'voiceGuidance',
  'Use Accessibility.voiceGuidanceSettings() instead.',
)

// onAudioDescriptionSettingsChanged is accessed via listen('audioDescriptionSettingsChanged, ...)

// onClosedCaptionsSettingsChanged is accessed via listen('closedCaptionsSettingsChanged, ...)

// onHighContrastUIChanged is accessed via listen('highContrastUIChanged, ...)

// onVoiceGuidanceSettingsChanged is accessed via listen('voiceGuidanceSettingsChanged, ...)

// Methods
function audioDescriptionSettings() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Accessibility',
    'audioDescriptionSettings',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function clear(...args) {
  return Events.clear('Accessibility', ...args)
}

function closedCaptions() {
  const transforms = null

  return Transport.send('Accessibility', 'closedCaptions', {}, transforms)
}
function closedCaptionsSettings() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Accessibility',
    'closedCaptionsSettings',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function highContrastUI() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Accessibility',
    'highContrastUI',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function listen(...args) {
  return Events.listen('Accessibility', ...args)
}

function once(...args) {
  return Events.once('Accessibility', ...args)
}

function voiceGuidance() {
  const transforms = null

  return Transport.send('Accessibility', 'voiceGuidance', {}, transforms)
}
function voiceGuidanceSettings() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Accessibility',
    'voiceGuidanceSettings',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}

export default {
  Events: {
    CLOSED_CAPTIONS_SETTINGS_CHANGED: 'closedCaptionsSettingsChanged',
    HIGH_CONTRAST_UICHANGED: 'highContrastUIChanged',
    VOICE_GUIDANCE_SETTINGS_CHANGED: 'voiceGuidanceSettingsChanged',
    AUDIO_DESCRIPTION_SETTINGS_CHANGED: 'audioDescriptionSettingsChanged',
  },

  /**
   *
   */
  FontFamily: {
    MONOSPACED_SERIF: 'monospaced_serif',
    PROPORTIONAL_SERIF: 'proportional_serif',
    MONOSPACED_SANSERIF: 'monospaced_sanserif',
    PROPORTIONAL_SANSERIF: 'proportional_sanserif',
    SMALLCAPS: 'smallcaps',
    CURSIVE: 'cursive',
    CASUAL: 'casual',
  },

  /**
   *
   */
  FontEdge: {
    NONE: 'none',
    RAISED: 'raised',
    DEPRESSED: 'depressed',
    UNIFORM: 'uniform',
    DROP_SHADOW_LEFT: 'drop_shadow_left',
    DROP_SHADOW_RIGHT: 'drop_shadow_right',
  },

  audioDescriptionSettings,
  clear,
  closedCaptions,
  closedCaptionsSettings,
  highContrastUI,
  listen,
  once,
  voiceGuidance,
  voiceGuidanceSettings,
}
