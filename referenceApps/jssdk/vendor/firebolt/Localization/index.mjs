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

registerEvents('Localization', [
  'countryCodeChanged',
  'languageChanged',
  'localeChanged',
  'localityChanged',
  'postalCodeChanged',
  'preferredAudioLanguagesChanged',
])

Transport.registerDeprecatedMethod(
  'Localization',
  'language',
  'Use Localization.locale instead.',
)
Transport.registerDeprecatedMethod(
  'Localization',
  'onLanguageChanged',
  'Use language instead.',
)

// onCountryCodeChanged is accessed via listen('countryCodeChanged, ...)

// onLanguageChanged is accessed via listen('languageChanged, ...)

// onLocaleChanged is accessed via listen('localeChanged, ...)

// onLocalityChanged is accessed via listen('localityChanged, ...)

// onPostalCodeChanged is accessed via listen('postalCodeChanged, ...)

// onPreferredAudioLanguagesChanged is accessed via listen('preferredAudioLanguagesChanged, ...)

// Methods

function additionalInfo() {
  const transforms = null

  return Transport.send('Localization', 'additionalInfo', {}, transforms)
}
function clear(...args) {
  return Events.clear('Localization', ...args)
}

function countryCode() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'countryCode',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function language() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'language',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}

function latlon() {
  const transforms = null

  return Transport.send('Localization', 'latlon', {}, transforms)
}
function listen(...args) {
  return Events.listen('Localization', ...args)
}

function locale() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'locale',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function locality() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'locality',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function once(...args) {
  return Events.once('Localization', ...args)
}

function postalCode() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'postalCode',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function preferredAudioLanguages() {
  let callbackOrValue = arguments[0]
  let params = {}

  // x-subscriber-type: global
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    callbackOrValue = arguments[0]
    params = {}
  }

  return Prop.prop(
    'Localization',
    'preferredAudioLanguages',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}

export default {
  Events: {
    LOCALITY_CHANGED: 'localityChanged',
    POSTAL_CODE_CHANGED: 'postalCodeChanged',
    COUNTRY_CODE_CHANGED: 'countryCodeChanged',
    LANGUAGE_CHANGED: 'languageChanged',
    PREFERRED_AUDIO_LANGUAGES_CHANGED: 'preferredAudioLanguagesChanged',
    LOCALE_CHANGED: 'localeChanged',
  },

  additionalInfo,
  clear,
  countryCode,
  language,
  latlon,
  listen,
  locale,
  locality,
  once,
  postalCode,
  preferredAudioLanguages,
}
