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
  supported: true,
  available: true,
  permitted: true,
  granted: true,
  info: [
    {
      capability: 'xrn:firebolt:capability:device:model',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
    },
    {
      capability: 'xrn:firebolt:capability:input:keyboard',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
    },
    {
      capability: 'xrn:firebolt:capability:protocol:bluetoothle',
      supported: false,
      available: false,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['unsupported'],
    },
    {
      capability: 'xrn:firebolt:capability:token:device',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
    },
    {
      capability: 'xrn:firebolt:capability:token:platform',
      supported: true,
      available: false,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['unavailable'],
    },
    {
      capability: 'xrn:firebolt:capability:protocol:moca',
      supported: true,
      available: false,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['disabled', 'unavailable'],
    },
    {
      capability: 'xrn:firebolt:capability:wifi:scan',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['unpermitted'],
    },
    {
      capability: 'xrn:firebolt:capability:localization:postal-code',
      supported: true,
      available: true,
      use: { permitted: true, granted: null },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['ungranted'],
    },
    {
      capability: 'xrn:firebolt:capability:localization:postal-code',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['ungranted'],
    },
    {
      capability: 'xrn:firebolt:capability:localization:locality',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
      details: ['grantDenied', 'ungranted'],
    },
  ],
  request: [
    {
      capability: 'xrn:firebolt:capability:commerce:purchase',
      supported: true,
      available: true,
      use: { permitted: true, granted: true },
      manage: { permitted: true, granted: true },
      provide: { permitted: true, granted: true },
    },
  ],
}
