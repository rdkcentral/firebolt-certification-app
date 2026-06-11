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

Transport.registerDeprecatedMethod(
  'Authentication',
  'token',
  'Use Authentication module has individual methods for each token type. instead.',
)

// Methods

function device() {
  const transforms = null

  return Transport.send('Authentication', 'device', {}, transforms)
}

function root() {
  const transforms = null

  return Transport.send('Authentication', 'root', {}, transforms)
}

function session() {
  const transforms = null

  return Transport.send('Authentication', 'session', {}, transforms)
}

function token(type, options) {
  const transforms = null

  return Transport.send(
    'Authentication',
    'token',
    { type, options },
    transforms,
  )
}

export default {
  /**
   *
   */
  TokenType: {
    PLATFORM: 'platform',
    DEVICE: 'device',
    DISTRIBUTOR: 'distributor',
  },

  device,
  root,
  session,
  token,
}
