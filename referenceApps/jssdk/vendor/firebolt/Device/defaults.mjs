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
import MockProps from '../Prop/MockProps.mjs'

export default {
  id: function (params) {
    return MockProps.mock('Device', 'id', params, undefined, 0, '123')
  },
  distributor: function (params) {
    return MockProps.mock(
      'Device',
      'distributor',
      params,
      undefined,
      0,
      'Company',
    )
  },
  platform: function (params) {
    return MockProps.mock('Device', 'platform', params, undefined, 0, 'WPE')
  },
  uid: function (params) {
    return MockProps.mock(
      'Device',
      'uid',
      params,
      undefined,
      0,
      'ee6723b8-7ab3-462c-8d93-dbf61227998e',
    )
  },
  type: function (params) {
    return MockProps.mock('Device', 'type', params, undefined, 0, 'STB')
  },
  model: function (params) {
    return MockProps.mock('Device', 'model', params, undefined, 0, 'xi6')
  },
  sku: function (params) {
    return MockProps.mock('Device', 'sku', params, undefined, 0, 'AX061AEI')
  },
  make: function (params) {
    return MockProps.mock('Device', 'make', params, undefined, 0, 'Arris')
  },
  version: function (params) {
    return MockProps.mock('Device', 'version', params, undefined, 0, {
      sdk: { major: 0, minor: 8, patch: 0, readable: 'Firebolt JS SDK v0.8.0' },
      api: { major: 0, minor: 8, patch: 0, readable: 'Firebolt API v0.8.0' },
      firmware: {
        major: 1,
        minor: 2,
        patch: 3,
        readable: 'Device Firmware v1.2.3',
      },
      os: { major: 0, minor: 1, patch: 0, readable: 'Firebolt OS v0.1.0' },
      debug: 'Non-parsable build info for error logging only.',
    })
  },
  hdcp: function (params) {
    return MockProps.mock('Device', 'hdcp', params, undefined, 0, {
      'hdcp1.4': true,
      'hdcp2.2': true,
    })
  },
  hdr: function (params) {
    return MockProps.mock('Device', 'hdr', params, undefined, 0, {
      hdr10: true,
      hdr10Plus: true,
      dolbyVision: true,
      hlg: true,
    })
  },
  audio: function (params) {
    return MockProps.mock('Device', 'audio', params, undefined, 0, {
      stereo: true,
      'dolbyDigital5.1': true,
      'dolbyDigital5.1+': true,
      dolbyAtmos: true,
    })
  },
  screenResolution: function (params) {
    return MockProps.mock(
      'Device',
      'screenResolution',
      params,
      undefined,
      0,
      [1920, 1080],
    )
  },
  videoResolution: function (params) {
    return MockProps.mock(
      'Device',
      'videoResolution',
      params,
      undefined,
      0,
      [1920, 1080],
    )
  },
  name: function (params) {
    return MockProps.mock('Device', 'name', params, undefined, 0, 'Living Room')
  },
  network: function (params) {
    return MockProps.mock('Device', 'network', params, undefined, 0, {
      state: 'connected',
      type: 'wifi',
    })
  },
}
