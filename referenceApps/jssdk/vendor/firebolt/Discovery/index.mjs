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
import ProvideManager from '../ProvideManager/index.mjs'
import { registerProviderInterface } from '../ProvideManager/index.mjs'
import Prop from '../Prop/index.mjs'

registerEvents('Discovery', ['navigateTo', 'policyChanged'])

registerProviderInterface(
  'xrn:firebolt:capability:discovery:interest',
  'Discovery',
  [{ name: 'userInterest', focus: false, response: true, parameters: true }],
)

Transport.registerDeprecatedMethod(
  'Discovery',
  'entityInfo',
  'Use null instead.',
)
Transport.registerDeprecatedMethod(
  'Discovery',
  'purchasedContent',
  'Use null instead.',
)
Transport.registerDeprecatedMethod(
  'Discovery',
  'entitlements',
  'Use Discovery.contentAccess() instead.',
)
Transport.registerDeprecatedMethod(
  'Discovery',
  'onPullEntityInfo',
  'Use null instead.',
)
Transport.registerDeprecatedMethod(
  'Discovery',
  'onPullPurchasedContent',
  'Use null instead.',
)

// onNavigateTo is accessed via listen('navigateTo, ...)

// onPolicyChanged is accessed via listen('policyChanged, ...)

// Methods
function clear(...args) {
  return Events.clear('Discovery', ...args)
}

function clearContentAccess() {
  const transforms = null

  return Transport.send('Discovery', 'clearContentAccess', {}, transforms)
}

function contentAccess(ids) {
  const transforms = null

  return Transport.send('Discovery', 'contentAccess', { ids }, transforms)
}

function entitlements(entitlements) {
  const transforms = null

  return Transport.send(
    'Discovery',
    'entitlements',
    { entitlements },
    transforms,
  )
}

let entityInfoHasCallback = false

function entityInfo(data) {
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    if (entityInfoHasCallback) {
      return Promise.reject('Cannot register more than one entityInfo handler.')
    }

    const callback = arguments[0]
    entityInfoHasCallback = true
    return Events.listen('Discovery', 'pullEntityInfo', (request) => {
      if (typeof request === 'boolean') return

      try {
        const result = callback(request.parameters)
          .then((result) => {
            const params = {
              correlationId: request.correlationId,
              result: result,
            }
            Transport.send('Discovery', 'entityInfo', params).catch((error) => {
              const msg =
                typeof error === 'string'
                  ? error
                  : error.message || 'Unknown Error'
              console.error(
                `Failed to send entityInfo pull response through Transport Layer: ${msg}`,
              )
            })
          })
          .catch((error) => {
            const msg =
              typeof error === 'string'
                ? error
                : error.message || 'Unknown Error'
            console.error(`App 'entityInfo' callback failed: ${msg}`)
          })
      } catch (error) {
        const msg =
          typeof error === 'string' ? error : error.message || 'Unknown Error'
        console.error(`App 'entityInfo' callback failed: ${msg}`)
      }
    })
  } else {
    return Transport.send('Discovery', 'entityInfo', {
      correlationId: null,
      result: data,
    })
  }
}

function launch(appId, intent) {
  const transforms = null

  return Transport.send('Discovery', 'launch', { appId, intent }, transforms)
}
function listen(...args) {
  return Events.listen('Discovery', ...args)
}

function once(...args) {
  return Events.once('Discovery', ...args)
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
    'Discovery',
    'policy',
    params,
    callbackOrValue,
    false,
    true,
    0,
  )
}
function provide(capability, provider) {
  return ProvideManager.provide(capability, provider)
}

let purchasedContentHasCallback = false

function purchasedContent(data) {
  if (arguments.length === 1 && typeof arguments[0] === 'function') {
    if (purchasedContentHasCallback) {
      return Promise.reject(
        'Cannot register more than one purchasedContent handler.',
      )
    }

    const callback = arguments[0]
    purchasedContentHasCallback = true
    return Events.listen('Discovery', 'pullPurchasedContent', (request) => {
      if (typeof request === 'boolean') return

      try {
        const result = callback(request.parameters)
          .then((result) => {
            const params = {
              correlationId: request.correlationId,
              result: result,
            }
            Transport.send('Discovery', 'purchasedContent', params).catch(
              (error) => {
                const msg =
                  typeof error === 'string'
                    ? error
                    : error.message || 'Unknown Error'
                console.error(
                  `Failed to send purchasedContent pull response through Transport Layer: ${msg}`,
                )
              },
            )
          })
          .catch((error) => {
            const msg =
              typeof error === 'string'
                ? error
                : error.message || 'Unknown Error'
            console.error(`App 'purchasedContent' callback failed: ${msg}`)
          })
      } catch (error) {
        const msg =
          typeof error === 'string' ? error : error.message || 'Unknown Error'
        console.error(`App 'purchasedContent' callback failed: ${msg}`)
      }
    })
  } else {
    return Transport.send('Discovery', 'purchasedContent', {
      correlationId: null,
      result: data,
    })
  }
}

import { signIn as logSignIn } from '../Metrics/index.mjs'

function signIn(entitlements) {
  const transforms = null

  const p = Transport.send('Discovery', 'signIn', { entitlements }, transforms)

  p.then((_) => {
    setTimeout((_) => {
      logSignIn(entitlements)
    })
  }).catch((error) => {
    const msg =
      typeof error === 'string' ? error : error.message || 'Unknown Error'
    console.error(`Metrics 'signIn' callback failed: ${msg}`)
  })

  return p
}

import { signOut as logSignOut } from '../Metrics/index.mjs'

function signOut() {
  const transforms = null

  const p = Transport.send('Discovery', 'signOut', {}, transforms)

  p.then((_) => {
    setTimeout((_) => {
      logSignOut()
    })
  }).catch((error) => {
    const msg =
      typeof error === 'string' ? error : error.message || 'Unknown Error'
    console.error(`Metrics 'signOut' callback failed: ${msg}`)
  })

  return p
}

function userInterest(type, reason, entity) {
  const transforms = null

  return Transport.send(
    'Discovery',
    'userInterest',
    { type, reason, entity },
    transforms,
  )
}

function watched(entityId, progress, completed, watchedOn, agePolicy) {
  const transforms = null

  if (arguments.length === 1 && Array.isArray(arguments[0])) {
    return Transport.send('Discovery', 'watched', arguments[0], transforms)
  } else {
    return Transport.send(
      'Discovery',
      'watched',
      { entityId, progress, completed, watchedOn, agePolicy },
      transforms,
    )
  }
}

function watchNext(title, identifiers, expires, images) {
  const transforms = null

  return Transport.send(
    'Discovery',
    'watchNext',
    { title, identifiers, expires, images },
    transforms,
  )
}

export default {
  Events: {
    NAVIGATE_TO: 'navigateTo',
    POLICY_CHANGED: 'policyChanged',
    PULL_ENTITY_INFO: 'pullEntityInfo',
    PULL_PURCHASED_CONTENT: 'pullPurchasedContent',
  },

  /**
   *
   */
  InterestType: {
    INTEREST: 'interest',
    DISINTEREST: 'disinterest',
  },

  /**
   *
   */
  InterestReason: {
    PLAYLIST: 'playlist',
    REACTION: 'reaction',
    RECORDING: 'recording',
  },

  /**
   * In the case of a program `entityType`, specifies the program type.
   */
  ProgramType: {
    MOVIE: 'movie',
    EPISODE: 'episode',
    SEASON: 'season',
    SERIES: 'series',
    OTHER: 'other',
    PREVIEW: 'preview',
    EXTRA: 'extra',
    CONCERT: 'concert',
    SPORTING_EVENT: 'sportingEvent',
    ADVERTISEMENT: 'advertisement',
    MUSIC_VIDEO: 'musicVideo',
    MINISODE: 'minisode',
  },

  /**
   * In the case of a music `entityType`, specifies the type of music entity.
   */
  MusicType: {
    SONG: 'song',
    ALBUM: 'album',
  },

  /**
   * The offering type of the WayToWatch.
   */
  OfferingType: {
    FREE: 'free',
    SUBSCRIBE: 'subscribe',
    BUY: 'buy',
    RENT: 'rent',
  },

  /**
   *
   */
  AudioProfile: {
    STEREO: 'stereo',
    DOLBY_DIGITAL_5_1: 'dolbyDigital5.1',
    DOLBY_DIGITAL_5_1_PLUS: 'dolbyDigital5.1+',
    DOLBY_ATMOS: 'dolbyAtmos',
  },

  clear,
  clearContentAccess,
  contentAccess,
  entitlements,
  entityInfo,
  launch,
  listen,
  once,
  policy,
  provide,
  purchasedContent,
  signIn,
  signOut,
  userInterest,
  watched,
  watchNext,
}
