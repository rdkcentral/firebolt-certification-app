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

function ready() {
  return Transport.send('metrics', 'ready', {})
}

function signIn() {
  return Transport.send('metrics', 'signIn', {})
}

function signOut() {
  return Transport.send('metrics', 'signOut', {})
}

// Methods

function action(category, type, parameters, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'action',
    { category, type, parameters, agePolicy },
    transforms,
  )
}

function appInfo(build) {
  const transforms = null

  return Transport.send('Metrics', 'appInfo', { build }, transforms)
}

function error(type, code, description, visible, parameters, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'error',
    { type, code, description, visible, parameters, agePolicy },
    transforms,
  )
}

function mediaEnded(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaEnded',
    { entityId, agePolicy },
    transforms,
  )
}

function mediaLoadStart(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaLoadStart',
    { entityId, agePolicy },
    transforms,
  )
}

function mediaPause(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaPause',
    { entityId, agePolicy },
    transforms,
  )
}

function mediaPlay(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaPlay',
    { entityId, agePolicy },
    transforms,
  )
}

function mediaPlaying(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaPlaying',
    { entityId, agePolicy },
    transforms,
  )
}

function mediaProgress(entityId, progress, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaProgress',
    { entityId, progress, agePolicy },
    transforms,
  )
}

function mediaRateChange(entityId, rate, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaRateChange',
    { entityId, rate, agePolicy },
    transforms,
  )
}

function mediaRenditionChange(
  entityId,
  bitrate,
  width,
  height,
  profile,
  agePolicy,
) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaRenditionChange',
    { entityId, bitrate, width, height, profile, agePolicy },
    transforms,
  )
}

function mediaSeeked(entityId, position, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaSeeked',
    { entityId, position, agePolicy },
    transforms,
  )
}

function mediaSeeking(entityId, target, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaSeeking',
    { entityId, target, agePolicy },
    transforms,
  )
}

function mediaWaiting(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'mediaWaiting',
    { entityId, agePolicy },
    transforms,
  )
}

function page(pageId, agePolicy) {
  const transforms = null

  return Transport.send('Metrics', 'page', { pageId, agePolicy }, transforms)
}

function startContent(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'startContent',
    { entityId, agePolicy },
    transforms,
  )
}

function stopContent(entityId, agePolicy) {
  const transforms = null

  return Transport.send(
    'Metrics',
    'stopContent',
    { entityId, agePolicy },
    transforms,
  )
}

export default {
  /**
   *
   */
  ErrorType: {
    NETWORK: 'network',
    MEDIA: 'media',
    RESTRICTION: 'restriction',
    ENTITLEMENT: 'entitlement',
    OTHER: 'other',
  },

  action,
  appInfo,
  error,
  mediaEnded,
  mediaLoadStart,
  mediaPause,
  mediaPlay,
  mediaPlaying,
  mediaProgress,
  mediaRateChange,
  mediaRenditionChange,
  mediaSeeked,
  mediaSeeking,
  mediaWaiting,
  page,
  startContent,
  stopContent,
}

export { ready, signIn, signOut }
