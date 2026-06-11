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
  closedCaptions: {
    enabled: true,
    styles: {
      fontFamily: 'monospaced_sanserif',
      fontSize: 1,
      fontColor: '#ffffff',
      fontEdge: 'none',
      fontEdgeColor: '#7F7F7F',
      fontOpacity: 100,
      backgroundColor: '#000000',
      backgroundOpacity: 100,
      textAlign: 'center',
      textAlignVertical: 'middle',
      windowColor: 'white',
      windowOpacity: 50,
    },
    preferredLanguages: ['eng', 'spa'],
  },
  closedCaptionsSettings: function (params) {
    return MockProps.mock(
      'Accessibility',
      'closedCaptionsSettings',
      params,
      undefined,
      0,
      {
        enabled: true,
        styles: {
          fontFamily: 'monospaced_sanserif',
          fontSize: 1,
          fontColor: '#ffffff',
          fontEdge: 'none',
          fontEdgeColor: '#7F7F7F',
          fontOpacity: 100,
          backgroundColor: '#000000',
          backgroundOpacity: 100,
          textAlign: 'center',
          textAlignVertical: 'middle',
          windowColor: 'white',
          windowOpacity: 50,
        },
        preferredLanguages: ['eng', 'spa'],
      },
    )
  },
  highContrastUI: function (params) {
    return MockProps.mock(
      'Accessibility',
      'highContrastUI',
      params,
      undefined,
      0,
      true,
    )
  },
  voiceGuidance: { enabled: true, navigationHints: true, rate: 1 },
  voiceGuidanceSettings: function (params) {
    return MockProps.mock(
      'Accessibility',
      'voiceGuidanceSettings',
      params,
      undefined,
      0,
      { enabled: true, navigationHints: true, rate: 1 },
    )
  },
  audioDescriptionSettings: function (params) {
    return MockProps.mock(
      'Accessibility',
      'audioDescriptionSettings',
      params,
      undefined,
      0,
      { enabled: true },
    )
  },
}
