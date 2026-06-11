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
  locality: function (params) {
    return MockProps.mock(
      'Localization',
      'locality',
      params,
      undefined,
      0,
      'Philadelphia',
    )
  },
  postalCode: function (params) {
    return MockProps.mock(
      'Localization',
      'postalCode',
      params,
      undefined,
      0,
      '19103',
    )
  },
  countryCode: function (params) {
    return MockProps.mock(
      'Localization',
      'countryCode',
      params,
      undefined,
      0,
      'US',
    )
  },
  language: function (params) {
    return MockProps.mock(
      'Localization',
      'language',
      params,
      undefined,
      0,
      'en',
    )
  },
  preferredAudioLanguages: function (params) {
    return MockProps.mock(
      'Localization',
      'preferredAudioLanguages',
      params,
      undefined,
      0,
      ['spa', 'eng'],
    )
  },
  locale: function (params) {
    return MockProps.mock(
      'Localization',
      'locale',
      params,
      undefined,
      0,
      'en-US',
    )
  },
  latlon: [39.9549, 75.1699],
  additionalInfo: {},
}
