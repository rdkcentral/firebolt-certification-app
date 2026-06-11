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

import { setMockResponses } from './Transport/MockTransport.mjs'

import { default as _Accessibility } from './Accessibility/defaults.mjs'
import { default as _Account } from './Account/defaults.mjs'
import { default as _Advertising } from './Advertising/defaults.mjs'
import { default as _Authentication } from './Authentication/defaults.mjs'
import { default as _Capabilities } from './Capabilities/defaults.mjs'
import { default as _HDMIInput } from './HDMIInput/defaults.mjs'
import { default as _Device } from './Device/defaults.mjs'
import { default as _Discovery } from './Discovery/defaults.mjs'
import { default as _Keyboard } from './Keyboard/defaults.mjs'
import { default as _Lifecycle } from './Lifecycle/defaults.mjs'
import { default as _Localization } from './Localization/defaults.mjs'
import { default as _Metrics } from './Metrics/defaults.mjs'
import { default as _Parameters } from './Parameters/defaults.mjs'
import { default as _Profile } from './Profile/defaults.mjs'
import { default as _SecondScreen } from './SecondScreen/defaults.mjs'
import { default as _SecureStorage } from './SecureStorage/defaults.mjs'
import { default as _Platform } from './Platform/defaults.mjs'

setMockResponses({
  Accessibility: _Accessibility,
  Account: _Account,
  Advertising: _Advertising,
  Authentication: _Authentication,
  Capabilities: _Capabilities,
  HDMIInput: _HDMIInput,
  Device: _Device,
  Discovery: _Discovery,
  Keyboard: _Keyboard,
  Lifecycle: _Lifecycle,
  Localization: _Localization,
  Metrics: _Metrics,
  Parameters: _Parameters,
  Profile: _Profile,
  SecondScreen: _SecondScreen,
  SecureStorage: _SecureStorage,
  Platform: _Platform,
})

export { default as Accessibility } from './Accessibility/index.mjs'
export { default as Account } from './Account/index.mjs'
export { default as Advertising } from './Advertising/index.mjs'
export { default as Authentication } from './Authentication/index.mjs'
export { default as Capabilities } from './Capabilities/index.mjs'
export { default as HDMIInput } from './HDMIInput/index.mjs'
export { default as Device } from './Device/index.mjs'
export { default as Discovery } from './Discovery/index.mjs'
export { default as Keyboard } from './Keyboard/index.mjs'
export { default as Lifecycle } from './Lifecycle/index.mjs'
export { default as Localization } from './Localization/index.mjs'
export { default as Metrics } from './Metrics/index.mjs'
export { default as Parameters } from './Parameters/index.mjs'
export { default as Profile } from './Profile/index.mjs'
export { default as SecondScreen } from './SecondScreen/index.mjs'
export { default as SecureStorage } from './SecureStorage/index.mjs'
export { default as Platform } from './Platform/index.mjs'
export { default as Log } from './Log/index.mjs'
export { default as Events } from './Events/index.mjs'
export { default as Settings } from './Settings/index.mjs'
