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

// Methods

function clear(scope) {
  const transforms = null

  return Transport.send('SecureStorage', 'clear', { scope }, transforms)
}

function get(scope, key) {
  const transforms = null

  return Transport.send('SecureStorage', 'get', { scope, key }, transforms)
}

function remove(scope, key) {
  const transforms = null

  return Transport.send('SecureStorage', 'remove', { scope, key }, transforms)
}

function set(scope, key, value, options) {
  const transforms = null

  return Transport.send(
    'SecureStorage',
    'set',
    { scope, key, value, options },
    transforms,
  )
}

export default {
  /**
   * The scope of the data
   */
  StorageScope: {
    DEVICE: 'device',
    ACCOUNT: 'account',
  },

  clear,
  get,
  remove,
  set,
}
