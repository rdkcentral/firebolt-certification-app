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

export module Settings {
  type LogLevel = 'WARN' | 'INFO' | 'DEBUG' | 'ERROR'
  function setLogLevel(logLevel: LogLevel): void
  function getLogLevel(): LogLevel
}

export module Log {
  function info(...args: any[]): void
  function debug(...args: any[]): void
  function error(...args: any[]): void
  function warn(...args: any[]): void
}

export module Events {
  function listen(...args: any[]): Promise<number>
  function once(...args: any[]): Promise<number>
  function clear(...args: any[]): boolean
}

export module Accessibility {
  type Event =
    | 'audioDescriptionSettingsChanged'
    | 'closedCaptionsSettingsChanged'
    | 'highContrastUIChanged'
    | 'voiceGuidanceSettingsChanged'

  // Types

  /**
   *
   */
  enum FontFamily {
    MONOSPACED_SERIF = 'monospaced_serif',
    PROPORTIONAL_SERIF = 'proportional_serif',
    MONOSPACED_SANSERIF = 'monospaced_sanserif',
    PROPORTIONAL_SANSERIF = 'proportional_sanserif',
    SMALLCAPS = 'smallcaps',
    CURSIVE = 'cursive',
    CASUAL = 'casual',
  }

  /**
   *
   */
  type SpeechRate = number

  /**
   *
   */
  type AudioDescriptionSettings = {
    enabled: boolean // Whether or not audio descriptions should be enabled by default
  }

  /**
   *
   */
  type ISO639_2Language = string

  /**
   *
   */
  type FontSize = number

  /**
   *
   */
  type VoiceGuidanceSettings = {
    enabled: boolean // Whether or not voice guidance should be enabled by default
    navigationHints: boolean // Whether or not voice guidance should include additional navigation hints
    rate: SpeechRate // The rate at which voice guidance speech will be read back to the user
    speed?: SpeechRate // **DEPRECATED** Use rate instead. The rate at which voice guidance speech will be read back to the user
  }

  /**
   *
   */
  type Color = string

  /**
   *
   */
  enum FontEdge {
    NONE = 'none',
    RAISED = 'raised',
    DEPRESSED = 'depressed',
    UNIFORM = 'uniform',
    DROP_SHADOW_LEFT = 'drop_shadow_left',
    DROP_SHADOW_RIGHT = 'drop_shadow_right',
  }

  /**
   *
   */
  type Opacity = number

  /**
   *
   */
  type HorizontalAlignment = string

  /**
   *
   */
  type VerticalAlignment = string

  /**
   * The default styles to use when displaying closed-captions
   */
  type ClosedCaptionsStyles = {
    fontFamily?: FontFamily
    fontSize?: FontSize
    fontColor?: Color
    fontEdge?: FontEdge
    fontEdgeColor?: Color
    fontOpacity?: Opacity
    backgroundColor?: Color
    backgroundOpacity?: Opacity
    textAlign?: HorizontalAlignment
    textAlignVertical?: VerticalAlignment
    windowColor?: Color
    windowOpacity?: Opacity
  }

  /**
   *
   */
  type ClosedCaptionsSettings = {
    enabled: boolean // Whether or not closed-captions should be enabled by default
    styles?: ClosedCaptionsStyles // The default styles to use when displaying closed-captions
    preferredLanguages?: ISO639_2Language[]
  }

  /**
   * Getter: Get the user's preferred audio description settings
   *
   */
  function audioDescriptionSettings(): Promise<AudioDescriptionSettings>

  /**
   * Subscriber: Get the user's preferred audio description settings
   *
   */
  function audioDescriptionSettings(
    subscriber: (settings: AudioDescriptionSettings) => void,
  ): Promise<number>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Get the user's preferred closed-captions settings
   *
   * @deprecated since version 0.6.0
   */
  function closedCaptions(): Promise<ClosedCaptionsSettings>

  /**
   * Getter: Get the user's preferred closed-captions settings
   *
   */
  function closedCaptionsSettings(): Promise<ClosedCaptionsSettings>

  /**
   * Subscriber: Get the user's preferred closed-captions settings
   *
   */
  function closedCaptionsSettings(
    subscriber: (closedCaptionsSettings: ClosedCaptionsSettings) => void,
  ): Promise<number>

  /**
   * Getter: The user's preference for a high-contrast UI
   *
   */
  function highContrastUI(): Promise<boolean>

  /**
   * Subscriber: The user's preference for a high-contrast UI
   *
   */
  function highContrastUI(
    subscriber: (highContrastUI: boolean) => void,
  ): Promise<number>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Get the user's preferred audio description settings
   *
   * @param {'audioDescriptionSettingsChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'audioDescriptionSettingsChanged',
    callback: (data: AudioDescriptionSettings) => void,
  ): Promise<number>

  /**
   * Get the user's preferred audio description settings
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'audioDescriptionSettingsChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'audioDescriptionSettingsChanged',
    callback: (data: AudioDescriptionSettings) => void,
  ): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Get the user's preferred closed-captions settings
   *
   * @param {'closedCaptionsSettingsChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'closedCaptionsSettingsChanged',
    callback: (data: ClosedCaptionsSettings) => void,
  ): Promise<number>

  /**
   * Get the user's preferred closed-captions settings
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'closedCaptionsSettingsChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'closedCaptionsSettingsChanged',
    callback: (data: ClosedCaptionsSettings) => void,
  ): Promise<number>

  /**
   * The user's preference for a high-contrast UI
   *
   * @param {'highContrastUIChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'highContrastUIChanged',
    callback: (data: boolean) => void,
  ): Promise<number>

  /**
   * The user's preference for a high-contrast UI
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'highContrastUIChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'highContrastUIChanged',
    callback: (data: boolean) => void,
  ): Promise<number>

  /**
   * Get the user's preferred voice guidance settings
   *
   * @param {'voiceGuidanceSettingsChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'voiceGuidanceSettingsChanged',
    callback: (data: VoiceGuidanceSettings) => void,
  ): Promise<number>

  /**
   * Get the user's preferred voice guidance settings
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'voiceGuidanceSettingsChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'voiceGuidanceSettingsChanged',
    callback: (data: VoiceGuidanceSettings) => void,
  ): Promise<number>

  /**
   * Get the user's preferred voice guidance settings
   *
   * @deprecated since version 0.6.0
   */
  function voiceGuidance(): Promise<VoiceGuidanceSettings>

  /**
   * Getter: Get the user's preferred voice guidance settings
   *
   */
  function voiceGuidanceSettings(): Promise<VoiceGuidanceSettings>

  /**
   * Subscriber: Get the user's preferred voice guidance settings
   *
   */
  function voiceGuidanceSettings(
    subscriber: (settings: VoiceGuidanceSettings) => void,
  ): Promise<number>
}

export module Account {
  // Types

  /**
   * Getter: Get the platform back-office account identifier
   *
   */
  function id(): Promise<string>

  /**
   * Getter: Gets a unique id for the current app & account
   *
   */
  function uid(): Promise<string>
}

export module Advertising {
  type Event = 'policyChanged'

  // Types

  /**
     * The advertisement skip restriction.

Applies to fast-forward/rewind (e.g. trick mode), seeking over an entire opportunity (e.g. jump), seeking out of what's currently playing, and "Skip this ad..." features. Seeking over multiple ad opportunities only requires playback of the _last_ opportunity, not all opportunities, preceding the seek destination.

| Value        | Description                                                                    |
|--------------|--------------------------------------------------------------------------------|
| none         |No fast-forward, jump, or skip restrictions                                    |
| adsUnwatched | Restrict fast-forward, jump, and skip for unwatched ad opportunities only.     |
| adsAll       | Restrict fast-forward, jump, and skip for all ad opportunities                 |
| all          | Restrict fast-forward, jump, and skip for all ad opportunities and all content |

Namespace: `xrn:advertising:policy:skipRestriction:`


     */
  enum SkipRestriction {
    NONE = 'none',
    ADS_UNWATCHED = 'adsUnwatched',
    ADS_ALL = 'adsAll',
    ALL = 'all',
  }

  /**
   * Describes various ad playback enforcement rules that the app should follow.
   */
  type AdPolicy = {
    skipRestriction?: SkipRestriction // The advertisement skip restriction.
    limitAdTracking?: boolean
  }

  /**
   *
   */
  type AdvertisingIdOptions = {
    scope?: {
      type: 'browse' | 'content' // The scope type, which will determine where to show advertisement
      id: string // A value that identifies a specific scope within the scope type
    }
    // Provides the options to send scope type and id to select desired advertising id
  }

  /**
   *
   */
  type AdvertisingIdResult = {
    ifa: string // UUID conforming to IAB standard
    ifa_type: string // source of the IFA as defined by IAB
    lmt: '0' | '1' // boolean that if set to 1, user has requested ad tracking and measurement is disabled
  }

  /**
   *
   */
  type AdConfigurationOptions = {
    coppa?: boolean // Whether or not the app requires US COPPA compliance.
    environment?: 'prod' | 'test' // Whether the app is running in a production or test mode.
    authenticationEntity?: string // The authentication provider, when it is separate entity than the app provider, e.g. an MVPD.
  }

  /**
   * Get the IAB compliant identifier for advertising (IFA). It is recommended to use the IFA to manage advertising related activities while respecting the user's privacy settings.
   *
   * @param {AdvertisingIdOptions} options AdvertisingId options
   */
  function advertisingId(
    options?: AdvertisingIdOptions,
  ): Promise<AdvertisingIdResult>

  /**
   * Get the App's Bundle ID
   *
   */
  function appBundleId(): Promise<string>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Build configuration object for Ad Framework initialization
   *
   * @param {AdConfigurationOptions} options Configuration options
   */
  function config(options: AdConfigurationOptions): Promise<object>

  /**
   * Get the device advertising device attributes
   *
   */
  function deviceAttributes(): Promise<object>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Get the advertising privacy and playback policy
   *
   * @param {'policyChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'policyChanged',
    callback: (data: AdPolicy) => void,
  ): Promise<number>

  /**
   * Get the advertising privacy and playback policy
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'policyChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'policyChanged',
    callback: (data: AdPolicy) => void,
  ): Promise<number>

  /**
   * Getter: Get the advertising privacy and playback policy
   *
   */
  function policy(): Promise<AdPolicy>

  /**
   * Subscriber: Get the advertising privacy and playback policy
   *
   */
  function policy(subscriber: (adPolicy: AdPolicy) => void): Promise<number>
}

export module Authentication {
  // Types

  /**
   *
   */
  enum TokenType {
    PLATFORM = 'platform',
    DEVICE = 'device',
    DISTRIBUTOR = 'distributor',
  }

  /**
   *
   */
  type AuthenticationTokenResult = {
    value: string
    expires?: string
    type?: string
  }

  /**
   * Get a device token scoped to the current app.
   *
   */
  function device(): Promise<string>

  /**
   * Get a root device token.
   *
   */
  function root(): Promise<string>

  /**
   * Get a destributor session token.
   *
   */
  function session(): Promise<string>

  /**
   * Get a specific `type` of authentication token
   *
   * @param {TokenType} type What type of token to get
   * @param {object} options Additional options for acquiring the token.
   * @deprecated since version 0.9.0
   */
  function token(
    type: TokenType,
    options?: object,
  ): Promise<AuthenticationTokenResult>
}

export module Capabilities {
  type Event = 'available' | 'granted' | 'revoked' | 'unavailable'

  // Types

  /**
   * Role provides access level for the app for a given capability.
   */
  enum Role {
    USE = 'use',
    MANAGE = 'manage',
    PROVIDE = 'provide',
  }

  /**
   * Reasons why a Capability might not be invokable
   */
  enum DenyReason {
    UNPERMITTED = 'unpermitted',
    UNSUPPORTED = 'unsupported',
    DISABLED = 'disabled',
    UNAVAILABLE = 'unavailable',
    GRANT_DENIED = 'grantDenied',
    UNGRANTED = 'ungranted',
  }

  /**
   * A Capability is a discrete unit of functionality that a Firebolt device might be able to perform.
   */
  type Capability = string

  /**
   * A capability combined with a Role, which an app may be permitted (by a distributor) or granted (by an end user).
   */
  type Permission = {
    role?: Role // Role provides access level for the app for a given capability.
    capability: Capability // A Capability is a discrete unit of functionality that a Firebolt device might be able to perform.
  }

  /**
   *
   */
  type CapPermissionStatus = {
    permitted?: boolean // Provides info whether the capability is permitted
    granted?: boolean
  }

  /**
   *
   */
  type CapabilityInfo = {
    capability?: Capability // A Capability is a discrete unit of functionality that a Firebolt device might be able to perform.
    supported: boolean // Provides info whether the capability is supported
    available: boolean // Provides info whether the capability is available
    use: CapPermissionStatus
    manage: CapPermissionStatus
    provide: CapPermissionStatus
    details?: DenyReason[] // Reasons why a Capability might not be invokable
  }

  /**
   *
   */
  type CapabilityOption = {
    role?: Role // Role provides access level for the app for a given capability.
  }

  /**
   * Returns whether a capability is available now.
   *
   * @param {Capability} capability
   */
  function available(capability: Capability): Promise<boolean>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Returns whether or not the user has granted the app with the provided capability and role.
This will return 'null' if the user has not yet specified whether or not they grant the app with the provided permission, in which case the app can request permission by calling Capabilities.request().
   * 
   * @param {Capability} capability 
   * @param {CapabilityOption} options Capability options
  */
  function granted(
    capability: Capability,
    options?: CapabilityOption,
  ): Promise<boolean>

  /**
   * Returns an array of CapabilityInfo objects for the provided capabilities.
   *
   * @param {Capability[]} capabilities
   */
  function info(capabilities: Capability[]): Promise<CapabilityInfo[]>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listens for all App permitted capabilities to become available.
   *
   * @param {'available'} event
   * @param {Function} callback
   */
  function listen(
    event: 'available',
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become available.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'available'} event
   * @param {Function} callback
   */
  function once(
    event: 'available',
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listens for all App permitted capabilities to become granted.
   *
   * @param {'granted'} event
   * @param {Function} callback
   */
  function listen(
    event: 'granted',
    role: Role,
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become granted.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'granted'} event
   * @param {Function} callback
   */
  function once(
    event: 'granted',
    role: Role,
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become revoked.
   *
   * @param {'revoked'} event
   * @param {Function} callback
   */
  function listen(
    event: 'revoked',
    role: Role,
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become revoked.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'revoked'} event
   * @param {Function} callback
   */
  function once(
    event: 'revoked',
    role: Role,
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become unavailable.
   *
   * @param {'unavailable'} event
   * @param {Function} callback
   */
  function listen(
    event: 'unavailable',
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Listens for all App permitted capabilities to become unavailable.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'unavailable'} event
   * @param {Function} callback
   */
  function once(
    event: 'unavailable',
    capability: Capability,
    callback: (data: CapabilityInfo) => void,
  ): Promise<number>

  /**
   * Returns whether or not the platform operator has granted the app with the provided capability and role.
   *
   * @param {Capability} capability
   * @param {CapabilityOption} options Capability options
   */
  function permitted(
    capability: Capability,
    options?: CapabilityOption,
  ): Promise<boolean>

  /**
   * Requests grants for all capability/role combinations in the roles array.
   *
   * @param {Permission[]} grants
   */
  function request(grants: Permission[]): Promise<CapabilityInfo[]>

  /**
   * Returns whether the platform supports the passed capability.
   *
   * @param {Capability} capability
   */
  function supported(capability: Capability): Promise<boolean>
}

export module HDMIInput {
  type Event =
    | 'autoLowLatencyModeCapableChanged'
    | 'autoLowLatencyModeSignalChanged'
    | 'connectionChanged'
    | 'edidVersionChanged'
    | 'lowLatencyModeChanged'
    | 'signalChanged'

  // Types

  /**
   *
   */
  enum EDIDVersion {
    V1_4 = '1.4',
    V2_0 = '2.0',
    UNKNOWN = 'unknown',
  }

  /**
   *
   */
  enum HDMISignalStatus {
    NONE = 'none',
    STABLE = 'stable',
    UNSTABLE = 'unstable',
    UNSUPPORTED = 'unsupported',
    UNKNOWN = 'unknown',
  }

  /**
   *
   */
  type HDMIPortId = string

  /**
   *
   */
  type SignalChangedInfo = {
    port: HDMIPortId
    signal: HDMISignalStatus
  }

  /**
   *
   */
  type AutoLowLatencyModeSignalChangedInfo = {
    port?: HDMIPortId
    autoLowLatencyModeSignalled?: boolean
  }

  /**
   *
   */
  type HDMIInputPort = {
    port: HDMIPortId
    connected: boolean
    signal: HDMISignalStatus
    arcCapable: boolean
    arcConnected: boolean
    edidVersion: EDIDVersion
    autoLowLatencyModeCapable: boolean
    autoLowLatencyModeSignalled: boolean
  }

  /**
   *
   */
  type AutoLowLatencyModeCapableChangedInfo = {
    port: HDMIPortId
    enabled: boolean
  }

  /**
   *
   */
  type ConnectionChangedInfo = {
    port?: HDMIPortId
    connected?: boolean
  }

  /**
   * Getter: Property for each port auto low latency mode setting.
   *
   * @param {HDMIPortId} port
   */
  function autoLowLatencyModeCapable(port: HDMIPortId): Promise<boolean>

  /**
   * Subscriber: Property for each port auto low latency mode setting.
   *
   */
  function autoLowLatencyModeCapable(
    subscriber: (data: AutoLowLatencyModeCapableChangedInfo) => void,
  ): Promise<number>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Getter: Property for each port's active EDID version.
   *
   * @param {HDMIPortId} port
   */
  function edidVersion(port: HDMIPortId): Promise<EDIDVersion>

  /**
   * Subscriber: Property for each port's active EDID version.
   *
   */
  function edidVersion(
    subscriber: (edidVersion: EDIDVersion) => void,
  ): Promise<number>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Getter: Property for the low latency mode setting.
   *
   */
  function lowLatencyMode(): Promise<boolean>

  /**
   * Subscriber: Property for the low latency mode setting.
   *
   */
  function lowLatencyMode(
    subscriber: (enabled: boolean) => void,
  ): Promise<number>

  /**
   * Property for each port auto low latency mode setting.
   *
   * @param {'autoLowLatencyModeCapableChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'autoLowLatencyModeCapableChanged',
    callback: (data: AutoLowLatencyModeCapableChangedInfo) => void,
  ): Promise<number>

  /**
   * Property for each port auto low latency mode setting.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'autoLowLatencyModeCapableChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'autoLowLatencyModeCapableChanged',
    callback: (data: AutoLowLatencyModeCapableChangedInfo) => void,
  ): Promise<number>

  /**
   * Notification for changes to ALLM status of any input device.
   *
   * @param {'autoLowLatencyModeSignalChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'autoLowLatencyModeSignalChanged',
    callback: (data: AutoLowLatencyModeSignalChangedInfo) => void,
  ): Promise<number>

  /**
   * Notification for changes to ALLM status of any input device.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'autoLowLatencyModeSignalChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'autoLowLatencyModeSignalChanged',
    callback: (data: AutoLowLatencyModeSignalChangedInfo) => void,
  ): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Notification for when any HDMI port has a connection physically engaged or disengaged.
   *
   * @param {'connectionChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'connectionChanged',
    callback: (data: ConnectionChangedInfo) => void,
  ): Promise<number>

  /**
   * Notification for when any HDMI port has a connection physically engaged or disengaged.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'connectionChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'connectionChanged',
    callback: (data: ConnectionChangedInfo) => void,
  ): Promise<number>

  /**
   * Property for each port's active EDID version.
   *
   * @param {'edidVersionChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'edidVersionChanged',
    port: HDMIPortId,
    callback: (data: EDIDVersion) => void,
  ): Promise<number>

  /**
   * Property for each port's active EDID version.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'edidVersionChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'edidVersionChanged',
    port: HDMIPortId,
    callback: (data: EDIDVersion) => void,
  ): Promise<number>

  /**
   * Property for the low latency mode setting.
   *
   * @param {'lowLatencyModeChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'lowLatencyModeChanged',
    callback: (data: boolean) => void,
  ): Promise<number>

  /**
   * Property for the low latency mode setting.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'lowLatencyModeChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'lowLatencyModeChanged',
    callback: (data: boolean) => void,
  ): Promise<number>

  /**
   * Notification for when any HDMI port has it's signal status changed.
   *
   * @param {'signalChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'signalChanged',
    callback: (data: SignalChangedInfo) => void,
  ): Promise<number>

  /**
   * Notification for when any HDMI port has it's signal status changed.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'signalChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'signalChanged',
    callback: (data: SignalChangedInfo) => void,
  ): Promise<number>

  /**
   * Retrieve a specific HDMI input port.
   *
   * @param {HDMIPortId} portId
   */
  function port(portId: HDMIPortId): Promise<HDMIInputPort>

  /**
   * Retrieve a list of HDMI input ports.
   *
   */
  function ports(): Promise<HDMIInputPort[]>
}

export module Device {
  type Event =
    | 'audioChanged'
    | 'deviceNameChanged'
    | 'hdcpChanged'
    | 'hdrChanged'
    | 'nameChanged'
    | 'networkChanged'
    | 'screenResolutionChanged'
    | 'videoResolutionChanged'

  // Types

  /**
   * The type of network that is currently active
   */
  enum NetworkState {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected',
  }

  /**
   * The type of network that is currently active
   */
  enum NetworkType {
    WIFI = 'wifi',
    ETHERNET = 'ethernet',
    HYBRID = 'hybrid',
  }

  /**
   * The type of HDR format
   */
  type HDRFormatMap = {
    hdr10: boolean
    hdr10Plus: boolean
    dolbyVision: boolean
    hlg: boolean
  }

  /**
   *
   */
  type AudioProfiles = {
    stereo: boolean
    'dolbyDigital5.1': boolean
    'dolbyDigital5.1+': boolean
    dolbyAtmos: boolean
  }

  /**
   *
   */
  type Resolution =
    | [
        720, // undefined Width in pixels item
        480, // undefined Height in pixels item
      ]
    | [
        720, // undefined Width in pixels item
        576, // undefined Height in pixels item
      ]
    | [
        1280, // undefined Width in pixels item
        720, // undefined Height in pixels item
      ]
    | [
        1920, // undefined Width in pixels item
        1080, // undefined Height in pixels item
      ]
    | [
        3840, // undefined Width in pixels item
        2160, // undefined Height in pixels item
      ]

  /**
   *
   */
  type NetworkInfoResult = {
    state: NetworkState // The type of network that is currently active
    type: NetworkType // The type of network that is currently active
  }

  /**
   *
   */
  type SemanticVersion = {
    major: number
    minor: number
    patch: number
    readable: string
  }

  /**
   *
   */
  type DeviceVersion = {
    sdk?: SemanticVersion // The Firebolt SDK version
    api: SemanticVersion // The latest Firebolt API version supported by the current device.
    firmware: SemanticVersion // The firmware version as reported by the device
    os: SemanticVersion // **Deprecated** Use `firmware`, instead.
    debug?: string // Detailed version as a string, for debugging purposes
  }

  /**
   * The type of HDCP versions
   */
  type HDCPVersionMap = {
    'hdcp1.4': boolean
    'hdcp2.2': boolean
  }

  /**
   * Getter: Get the supported audio profiles for the connected devices. 

 It is not recommended to use this API for visual badging on content within your app since this does not reflect the settings of the user.
   * 
  */
  function audio(): Promise<AudioProfiles>

  /**
   * Subscriber: Get the supported audio profiles for the connected devices. 

 It is not recommended to use this API for visual badging on content within your app since this does not reflect the settings of the user.
   * 
   */
  function audio(
    subscriber: (supportedAudioProfiles: AudioProfiles) => void,
  ): Promise<number>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Getter: Get the name of the entity which is distributing the current device. There can be multiple distributors which distribute the same device model.
   *
   */
  function distributor(): Promise<string>

  /**
   * Getter: Get the negotiated HDCP profiles for a connected device. 

 For devices that do not require additional connections (e.g. panels), `true` will be returned for all profiles.
   * 
  */
  function hdcp(): Promise<HDCPVersionMap>

  /**
   * Subscriber: Get the negotiated HDCP profiles for a connected device. 

 For devices that do not require additional connections (e.g. panels), `true` will be returned for all profiles.
   * 
   */
  function hdcp(
    subscriber: (negotiatedHdcpVersions: HDCPVersionMap) => void,
  ): Promise<number>

  /**
   * Getter: Get the negotiated HDR formats for the connected display and device
   *
   */
  function hdr(): Promise<HDRFormatMap>

  /**
   * Subscriber: Get the negotiated HDR formats for the connected display and device
   *
   */
  function hdr(
    subscriber: (negotiatedHdrFormats: HDRFormatMap) => void,
  ): Promise<number>

  /**
   * Getter: Get the platform back-office device identifier
   *
   */
  function id(): Promise<string>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Getter: Get the manufacturer of the device model
   *
   */
  function make(): Promise<string>

  /**
   * Getter: Get the manufacturer designated model of the device
   *
   */
  function model(): Promise<string>

  /**
   * Getter: The human readable name of the device
   *
   */
  function name(): Promise<string>

  /**
   * Subscriber: The human readable name of the device
   *
   */
  function name(subscriber: (value: string) => void): Promise<number>

  /**
   * Getter: Get the current network status and type
   *
   */
  function network(): Promise<NetworkInfoResult>

  /**
   * Subscriber: Get the current network status and type
   *
   */
  function network(
    subscriber: (networkInfo: NetworkInfoResult) => void,
  ): Promise<number>

  /**
   * Get the supported audio profiles for the connected devices. 

 It is not recommended to use this API for visual badging on content within your app since this does not reflect the settings of the user.
   * 
   * @param {'audioChanged'} event
   * @param {Function} callback
  */
  function listen(
    event: 'audioChanged',
    callback: (data: AudioProfiles) => void,
  ): Promise<number>

  /**
   * Get the supported audio profiles for the connected devices. 

 It is not recommended to use this API for visual badging on content within your app since this does not reflect the settings of the user.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   * 
   * @param {'audioChanged'} event
   * @param {Function} callback
  */
  function once(
    event: 'audioChanged',
    callback: (data: AudioProfiles) => void,
  ): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Get the human readable name of the device
   *
   * @param {'deviceNameChanged'} event
   * @param {Function} callback
   * @deprecated since version 0.6.0
   */
  function listen(
    event: 'deviceNameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Get the human readable name of the device
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'deviceNameChanged'} event
   * @param {Function} callback
   * @deprecated since version 0.6.0
   */
  function once(
    event: 'deviceNameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Get the negotiated HDCP profiles for a connected device. 

 For devices that do not require additional connections (e.g. panels), `true` will be returned for all profiles.
   * 
   * @param {'hdcpChanged'} event
   * @param {Function} callback
  */
  function listen(
    event: 'hdcpChanged',
    callback: (data: HDCPVersionMap) => void,
  ): Promise<number>

  /**
   * Get the negotiated HDCP profiles for a connected device. 

 For devices that do not require additional connections (e.g. panels), `true` will be returned for all profiles.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   * 
   * @param {'hdcpChanged'} event
   * @param {Function} callback
  */
  function once(
    event: 'hdcpChanged',
    callback: (data: HDCPVersionMap) => void,
  ): Promise<number>

  /**
   * Get the negotiated HDR formats for the connected display and device
   *
   * @param {'hdrChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'hdrChanged',
    callback: (data: HDRFormatMap) => void,
  ): Promise<number>

  /**
   * Get the negotiated HDR formats for the connected display and device
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'hdrChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'hdrChanged',
    callback: (data: HDRFormatMap) => void,
  ): Promise<number>

  /**
   * The human readable name of the device
   *
   * @param {'nameChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'nameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * The human readable name of the device
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'nameChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'nameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Get the current network status and type
   *
   * @param {'networkChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'networkChanged',
    callback: (data: NetworkInfoResult) => void,
  ): Promise<number>

  /**
   * Get the current network status and type
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'networkChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'networkChanged',
    callback: (data: NetworkInfoResult) => void,
  ): Promise<number>

  /**
   * Get the resolution for the graphical surface of the app. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160] 

**Deprecated:** Use non-Firebolt APIs specific to your platform, e.g. W3C APIs
   * 
   * @param {'screenResolutionChanged'} event
   * @param {Function} callback
   * @deprecated since version 1.4.0
  */
  function listen(
    event: 'screenResolutionChanged',
    callback: (data: Resolution) => void,
  ): Promise<number>

  /**
   * Get the resolution for the graphical surface of the app. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160] 

**Deprecated:** Use non-Firebolt APIs specific to your platform, e.g. W3C APIs
   * When using `once` the callback method will only fire once, and then disconnect your listener
   * 
   * @param {'screenResolutionChanged'} event
   * @param {Function} callback
   * @deprecated since version 1.4.0
  */
  function once(
    event: 'screenResolutionChanged',
    callback: (data: Resolution) => void,
  ): Promise<number>

  /**
   * Get the maximum supported video resolution of the currently connected device and display. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160]
   * 
   * @param {'videoResolutionChanged'} event
   * @param {Function} callback
  */
  function listen(
    event: 'videoResolutionChanged',
    callback: (data: Resolution) => void,
  ): Promise<number>

  /**
   * Get the maximum supported video resolution of the currently connected device and display. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160]
   * When using `once` the callback method will only fire once, and then disconnect your listener
   * 
   * @param {'videoResolutionChanged'} event
   * @param {Function} callback
  */
  function once(
    event: 'videoResolutionChanged',
    callback: (data: Resolution) => void,
  ): Promise<number>

  /**
   * Getter: Get a platform identifier for the device. This API should be used to correlate metrics on the device only and cannot be guaranteed to have consistent responses across platforms.
   *
   */
  function platform(): Promise<string>

  /**
   * Getter: Get the resolution for the graphical surface of the app. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160] 

**Deprecated:** Use non-Firebolt APIs specific to your platform, e.g. W3C APIs
   * 
   * @deprecated since version 1.4.0
  */
  function screenResolution(): Promise<Resolution>

  /**
   * Subscriber: Get the resolution for the graphical surface of the app. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160] 

**Deprecated:** Use non-Firebolt APIs specific to your platform, e.g. W3C APIs
   * 
   */
  function screenResolution(
    subscriber: (screenResolution: Resolution) => void,
  ): Promise<number>

  /**
   * Getter: Get the device sku
   *
   */
  function sku(): Promise<string>

  /**
   * Getter: Get the device type
   *
   */
  function type(): Promise<string>

  /**
   * Getter: Gets a unique id for the current app & device
   *
   */
  function uid(): Promise<string>

  /**
   * Getter: Get the SDK, OS and other version info
   *
   */
  function version(): Promise<DeviceVersion>

  /**
   * Getter: Get the maximum supported video resolution of the currently connected device and display. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160]
   * 
  */
  function videoResolution(): Promise<Resolution>

  /**
   * Subscriber: Get the maximum supported video resolution of the currently connected device and display. 

The pairs returned will be of a [width, height] format and will correspond to the following values: 

NTSC Standard Definition (SD): [720, 480] 

PAL Standard Definition (SD): [720, 576] 

High Definition (HD): [1280, 720] 

Full HD (FHD): [1920, 1080]

4K Ultra High Definition (UHD): [3840, 2160]
   * 
   */
  function videoResolution(
    subscriber: (videoResolution: Resolution) => void,
  ): Promise<number>
}

export module Discovery {
  type Event = 'navigateTo' | 'policyChanged'

  // Types

  /**
   *
   */
  enum InterestType {
    INTEREST = 'interest',
    DISINTEREST = 'disinterest',
  }

  /**
   *
   */
  enum InterestReason {
    PLAYLIST = 'playlist',
    REACTION = 'reaction',
    RECORDING = 'recording',
  }

  /**
   * In the case of a program `entityType`, specifies the program type.
   */
  enum ProgramType {
    MOVIE = 'movie',
    EPISODE = 'episode',
    SEASON = 'season',
    SERIES = 'series',
    OTHER = 'other',
    PREVIEW = 'preview',
    EXTRA = 'extra',
    CONCERT = 'concert',
    SPORTING_EVENT = 'sportingEvent',
    ADVERTISEMENT = 'advertisement',
    MUSIC_VIDEO = 'musicVideo',
    MINISODE = 'minisode',
  }

  /**
   * In the case of a music `entityType`, specifies the type of music entity.
   */
  enum MusicType {
    SONG = 'song',
    ALBUM = 'album',
  }

  /**
   * The offering type of the WayToWatch.
   */
  enum OfferingType {
    FREE = 'free',
    SUBSCRIBE = 'subscribe',
    BUY = 'buy',
    RENT = 'rent',
  }

  /**
   *
   */
  enum AudioProfile {
    STEREO = 'stereo',
    DOLBY_DIGITAL_5_1 = 'dolbyDigital5.1',
    DOLBY_DIGITAL_5_1_PLUS = 'dolbyDigital5.1+',
    DOLBY_ATMOS = 'dolbyAtmos',
  }

  /**
   *
   */
  type Entitlement = {
    entitlementId: string
    startTime?: string
    endTime?: string
  }

  /**
   *
   */
  type Availability = {
    type: 'channel-lineup' | 'program-lineup'
    id: string
    catalogId?: string
    startTime?: string
    endTime?: string
  }

  /**
   * The policy that describes various age groups to which content is directed. See distributor documentation for further details.
   */
  type AgePolicy = string | 'app:adult' | 'app:child' | 'app:teen'

  /**
   *
   */
  type DiscoveryPolicy = {
    enableRecommendations: boolean // Whether or not to the user has enabled history-based recommendations
    shareWatchHistory: boolean // Whether or not the user has enabled app watch history data to be shared with the platform
    rememberWatchedPrograms: boolean // Whether or not the user has enabled watch history
  }

  /**
     * The ContentIdentifiers object is how the app identifies an entity or asset to
the Firebolt platform. These ids are used to look up metadata and deep link into
the app.

Apps do not need to provide all ids. They only need to provide the minimum
required to target a playable stream or an entity detail screen via a deep link.
If an id isn't needed to get to those pages, it doesn't need to be included.
     */
  type ContentIdentifiers = {
    assetId?: string // Identifies a particular playable asset. For example, the HD version of a particular movie separate from the UHD version.
    entityId?: string // Identifies an entity, such as a Movie, TV Series or TV Episode.
    seasonId?: string // The TV Season for a TV Episode.
    seriesId?: string // The TV Series for a TV Episode or TV Season.
    appContentData?: string // App-specific content identifiers.
  }

  /**
   *
   */
  type ChannelEntity = {
    entityType: 'channel'
    channelType: 'streaming' | 'overTheAir'
    entityId: string // ID of the channel, in the target App's scope.
    appContentData?: string
  }

  /**
   *
   */
  type UserInterestProviderParameters = {
    type: InterestType
    reason: InterestReason
  }

  /**
   *
   */
  type PurchasedContentParameters = {
    limit: number
    offeringType?: OfferingType // The offering type of the WayToWatch.
    programType?: ProgramType // In the case of a program `entityType`, specifies the program type.
  }

  /**
     * A ContentRating represents an age or content based of an entity. Supported rating schemes and associated types are below.

## United States

`US-Movie` (MPAA):

Ratings: `NR`, `G`, `PG`, `PG13`, `R`, `NC17`

Advisories: `AT`, `BN`, `SL`, `SS`, `N`, `V`

`US-TV` (Vchip):

Ratings: `TVY`, `TVY7`, `TVG`, `TVPG`, `TV14`, `TVMA`

Advisories: `FV`, `D`, `L`, `S`, `V`

## Canada

`CA-Movie` (OFRB):

Ratings: `G`, `PG`, `14A`, `18A`, `R`, `E`

`CA-TV` (AGVOT)

Ratings: `E`, `C`, `C8`, `G`, `PG`, `14+`, `18+`

Advisories: `C`, `C8`, `G`, `PG`, `14+`, `18+`

`CA-Movie-Fr` (Canadian French language movies):

Ratings: `G`, `8+`, `13+`, `16+`, `18+`

`CA-TV-Fr` (Canadian French language TV):

Ratings: `G`, `8+`, `13+`, `16+`, `18+`

     */
  type ContentRating = {
    scheme:
      | 'CA-Movie'
      | 'CA-TV'
      | 'CA-Movie-Fr'
      | 'CA-TV-Fr'
      | 'US-Movie'
      | 'US-TV' // The rating scheme.
    rating: string // The content rating.
    advisories?: string[] // Optional list of subratings or content advisories.
  }

  /**
   *
   */
  type ContentAccessIdentifiers = {
    availabilities?: Availability[] // A list of identifiers that represent what content is discoverable for the subscriber. Excluding availabilities will cause no change to the availabilities that are stored for this subscriber. Providing an empty array will clear the subscriber's availabilities
    entitlements?: Entitlement[] // A list of identifiers that represent what content is consumable for the subscriber. Excluding entitlements will cause no change to the entitlements that are stored for this subscriber. Providing an empty array will clear the subscriber's entitlements
  }

  /**
   * A Firebolt compliant representation of a user intention.
   */
  type Intent = {
    action: string
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type IntentProperties = {}

  /**
   *
   */
  type MusicEntity = {
    entityType: 'music'
    musicType: MusicType // In the case of a music `entityType`, specifies the type of music entity.
    entityId: string
  }

  /**
   * A Firebolt compliant representation of a Movie entity.
   */
  type MovieEntity = {
    entityType: 'program'
    programType: 'movie'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a section not covered by `home`, `entity`, `player`, or `search`, and bring that app to the foreground if needed.
   */
  type SectionIntent = {
    action: 'section'
    data: {
      sectionName: string
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to 'tune' to a traditional over-the-air broadcast, or an OTT Stream from an OTT or vMVPD App.
   */
  type TuneIntent = {
    action: 'tune'
    data: {
      entity: ChannelEntity
      options?: {
        assetId?: string // The ID of a specific 'listing', as scoped by the target App's ID-space, which the App should begin playback from.
        restartCurrentProgram?: boolean // Denotes that the App should start playback at the most recent program boundary, rather than 'live.'
        time?: string // ISO 8601 Date/Time where the App should begin playback from.
      }
      // The options property of the data property MUST have only one of the following fields.
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a Playlist entity.
   */
  type PlaylistEntity = {
    entityType: 'playlist'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for an abstract query to be searched for and played by the app.
   */
  type PlayQueryIntent = {
    action: 'play-query'
    data: {
      query: string
      options?: {
        programTypes?: ProgramType[]
        musicTypes?: MusicType[]
      }
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to launch an app.
   */
  type LaunchIntent = {
    action: 'launch'
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type Metadata = {
    title?: string // Title of the entity.
    synopsis?: string // Short description of the entity.
    seasonNumber?: number // For TV seasons, the season number. For TV episodes, the season that the episode belongs to.
    seasonCount?: number // For TV series, seasons, and episodes, the total number of seasons.
    episodeNumber?: number // For TV episodes, the episode number.
    episodeCount?: number // For TV seasons and episodes, the total number of episodes in the current season.
    releaseDate?: string // The date that the program or entity was released or first aired.
    contentRatings?: ContentRating[] // A ContentRating represents an age or content based of an entity. Supported rating schemes and associated types are below.
  }

  /**
   *
   */
  type UntypedEntity = {
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
     * A WayToWatch describes a way to watch a video program. It may describe a single
streamable asset or a set of streamable assets. For example, an app provider may
describe HD, SD, and UHD assets as individual WayToWatch objects or rolled into
a single WayToWatch.

If the WayToWatch represents a single streamable asset, the provided
ContentIdentifiers must be sufficient to play back the specific asset when sent
via a playback intent or deep link. If the WayToWatch represents multiple
streamable assets, the provided ContentIdentifiers must be sufficient to
playback one of the assets represented with no user action. In this scenario,
the app SHOULD choose the best asset for the user based on their device and
settings. The ContentIdentifiers MUST also be sufficient for navigating the user
to the appropriate entity or detail screen via an entity intent.

The app should set the `entitled` property to indicate if the user can watch, or
not watch, the asset without making a purchase. If the entitlement is known to
expire at a certain time (e.g., a rental), the app should also provide the
`entitledExpires` property. If the entitlement is not expired, the UI will use
the `entitled` property to display watchable assets to the user, adjust how
assets are presented to the user, and how intents into the app are generated.
For example, the the Aggregated Experience could render a "Watch" button for an
entitled asset versus a "Subscribe" button for an non-entitled asset.

The app should set the `offeringType` to define how the content may be
authorized. The UI will use this to adjust how content is presented to the user.

A single WayToWatch cannot represent streamable assets available via multiple
purchase paths. If, for example, an asset has both Buy, Rent and Subscription
availability, the three different entitlement paths MUST be represented as
multiple WayToWatch objects.

`price` should be populated for WayToWatch objects with `buy` or `rent`
`offeringType`. If the WayToWatch represents a set of assets with various price
points, the `price` provided must be the lowest available price.
     */
  type WayToWatch = {
    identifiers: ContentIdentifiers // The ContentIdentifiers object is how the app identifies an entity or asset to
    expires?: string // Time when the WayToWatch is no longer available.
    entitled?: boolean // Specify if the user is entitled to watch the entity.
    entitledExpires?: string // Time when the entity is no longer entitled.
    offeringType?: OfferingType // The offering type of the WayToWatch.
    hasAds?: boolean // True if the streamable asset contains ads.
    price?: number // For "buy" and "rent" WayToWatch, the price to buy or rent in the user's preferred currency.
    videoQuality?: 'SD' | 'HD' | 'UHD'[] // List of the video qualities available via the WayToWatch.
    audioProfile: AudioProfile[] // List of the audio types available via the WayToWatch.
    audioLanguages?: string[] // List of audio track languages available on the WayToWatch. The first is considered the primary language. Languages are expressed as ISO 639 1/2 codes.
    closedCaptions?: string[] // List of languages for which closed captions are available on the WayToWatch. Languages are expressed as ISO 639 1/2 codes.
    subtitles?: string[] // List of languages for which subtitles are available on the WayToWatch. Languages are expressed as ISO 639 1/2 codes.
    audioDescriptions?: string[] // List of languages for which audio descriptions (DVD) as available on the WayToWatch. Languages are expressed as ISO 639 1/2 codes.
  }

  /**
   *
   */
  type EntityInfoParameters = {
    entityId: string
    assetId?: string
  }

  /**
   *
   */
  type EntityInfoFederatedRequest = {
    parameters: EntityInfoParameters
    correlationId: string
  }

  /**
   *
   */
  type PurchasedContentFederatedRequest = {
    parameters: PurchasedContentParameters
    correlationId: string
  }

  /**
     * An EntityInfo object represents an "entity" on the platform. Currently, only entities of type `program` are supported. `programType` must be supplied to identify the program type.

Additionally, EntityInfo objects must specify a properly formed
ContentIdentifiers object, `entityType`, and `title`.  The app should provide
the `synopsis` property for a good user experience if the content
metadata is not available another way.

The ContentIdentifiers must be sufficient for navigating the user to the
appropriate entity or detail screen via a `detail` intent or deep link.

EntityInfo objects must provide at least one WayToWatch object when returned as
part of an `entityInfo` method and a streamable asset is available to the user.
It is optional for the `purchasedContent` method, but recommended because the UI
may use those data.
     */
  type EntityInfo = {
    identifiers: ContentIdentifiers // The ContentIdentifiers object is how the app identifies an entity or asset to
    title: string // Title of the entity.
    entityType: 'program' | 'music' // The type of the entity, e.g. `program` or `music`.
    programType?: ProgramType // In the case of a program `entityType`, specifies the program type.
    musicType?: MusicType // In the case of a music `entityType`, specifies the type of music entity.
    synopsis?: string // Short description of the entity.
    seasonNumber?: number // For TV seasons, the season number. For TV episodes, the season that the episode belongs to.
    seasonCount?: number // For TV series, seasons, and episodes, the total number of seasons.
    episodeNumber?: number // For TV episodes, the episode number.
    episodeCount?: number // For TV seasons and episodes, the total number of episodes in the current season.
    releaseDate?: string // The date that the program or entity was released or first aired.
    contentRatings?: ContentRating[] // A ContentRating represents an age or content based of an entity. Supported rating schemes and associated types are below.
    waysToWatch?: WayToWatch[] // A WayToWatch describes a way to watch a video program. It may describe a single
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to it's home screen, and bring that app to the foreground if needed.
   */
  type HomeIntent = {
    action: 'home'
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * The result for an `entityInfo()` push or pull.
   */
  type EntityInfoResult = {
    expires: string
    entity: EntityInfo // An EntityInfo object represents an "entity" on the platform. Currently, only entities of type `program` are supported. `programType` must be supplied to identify the program type.
    related?: EntityInfo[] // An EntityInfo object represents an "entity" on the platform. Currently, only entities of type `program` are supported. `programType` must be supplied to identify the program type.
  }

  /**
   * A Firebolt compliant representation of a TV Episode entity.
   */
  type TVEpisodeEntity = {
    entityType: 'program'
    programType: 'episode'
    entityId: string
    seriesId: string
    seasonId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of the remaining program entity types.
   */
  type AdditionalEntity = {
    entityType: 'program'
    programType:
      | 'concert'
      | 'sportingEvent'
      | 'preview'
      | 'other'
      | 'advertisement'
      | 'musicVideo'
      | 'minisode'
      | 'extra'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a TV Season entity.
   */
  type TVSeasonEntity = {
    entityType: 'program'
    programType: 'season'
    entityId: string
    seriesId: string
    assetId?: string
    appContentData?: string
  }

  /**
   *
   */
  type PlayableEntity =
    | MovieEntity
    | TVEpisodeEntity
    | PlaylistEntity
    | MusicEntity
    | AdditionalEntity

  /**
   * A Firebolt compliant representation of a TV Series entity.
   */
  type TVSeriesEntity = {
    entityType: 'program'
    programType: 'series'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   *
   */
  type ProgramEntity =
    | MovieEntity
    | TVEpisodeEntity
    | TVSeasonEntity
    | TVSeriesEntity
    | AdditionalEntity

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for a specific, playable entity, and bring that app to the foreground if needed.
   */
  type PlaybackIntent = {
    action: 'playback'
    data: PlayableEntity
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type Entity =
    | ProgramEntity
    | MusicEntity
    | ChannelEntity
    | UntypedEntity
    | PlaylistEntity

  /**
   * Localized string supports either a simple `string` or a Map<string, string> of language codes to strings. When using a simple `string`, the current preferred langauge from `Localization.langauge()` is assumed.
   */
  type LocalizedString = string | object

  /**
   *
   */
  type PurchasedContentResult = {
    expires: string
    totalCount: number
    entries: EntityInfo[] // An EntityInfo object represents an "entity" on the platform. Currently, only entities of type `program` are supported. `programType` must be supplied to identify the program type.
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for a specific, playable entity, and bring that app to the foreground if needed.
   */
  type PlayEntityIntent = {
    action: 'play-entity'
    data: {
      entity: PlayableEntity
      options?: {
        playFirstId?: string
        playFirstTrack?: number
      }
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type EntityDetails = {
    identifiers: Entity
    info?: Metadata
    waysToWatch?: WayToWatch[] // A WayToWatch describes a way to watch a video program. It may describe a single
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a specific entity page, and bring that app to the foreground if needed.
   */
  type EntityIntent = {
    action: 'entity'
    data: Entity
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to it's search UI with a search term populated, and bring that app to the foreground if needed.
   */
  type SearchIntent = {
    action: 'search'
    data?: {
      query: string
      suggestions?: Entity[]
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate to a specific place in an app.
   */
  type NavigationIntent =
    | HomeIntent
    | LaunchIntent
    | EntityIntent
    | PlaybackIntent
    | SearchIntent
    | SectionIntent
    | TuneIntent
    | PlayEntityIntent
    | PlayQueryIntent

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Clear both availabilities and entitlements from the subscriber. This is equivalent of calling `Discovery.contentAccess({ availabilities: [], entitlements: []})`. This is typically called when the user signs out of an account.
   *
   */
  function clearContentAccess(): Promise<void>

  /**
   * Inform the platform of what content the user can access either by discovering it or consuming it. Availabilities determine which content is discoverable to a user, while entitlements determine if the user can currently consume that content. Content can be available but not entitled, this means that user can see the content but when they try to open it they must gain an entitlement either through purchase or subscription upgrade. In case the access changed off-device, this API should be called any time the app comes to the foreground to refresh the access. This API should also be called any time the availabilities or entitlements change within the app for any reason. Typical reasons may include the user signing into an account or upgrading a subscription. Less common cases can cause availabilities to change, such as moving to a new service location. When availabilities or entitlements are removed from the subscriber (such as when the user signs out), then an empty array should be given. To clear both, use the Discovery.clearContentAccess convenience API.
   *
   * @param {ContentAccessIdentifiers} ids A list of identifiers that represent content that is discoverable or consumable for the subscriber
   */
  function contentAccess(ids: ContentAccessIdentifiers): Promise<void>

  /**
   * Inform the platform of the users latest entitlements w/in this app.
   *
   * @param {Entitlement[]} entitlements Array of entitlement objects
   * @deprecated since version 0.10.0
   */
  function entitlements(entitlements: Entitlement[]): Promise<boolean>

  /**
   * Provide information about a program entity and its available watchable assets, such as entitlement status and price, via either a push or pull call flow.
   *
   * @param {string} correlationId
   * @param {EntityInfoResult} result The entityInfo data.
   * @deprecated
   */
  function entityInfo(result: EntityInfoResult): Promise<boolean>

  /**
   * Launch or foreground the specified app, and optionally instructs it to navigate to the specified user action. 
 For the Primary Experience, the appId can be any one of:  

 - xrn:firebolt:application-type:main 

 - xrn:firebolt:application-type:settings
   * 
   * @param {string} appId The durable app Id of the app to launch
   * @param {NavigationIntent} intent An optional `NavigationIntent` with details about what part of the app to show first, and context around how/why it was launched
  */
  function launch(appId: string, intent?: NavigationIntent): Promise<boolean>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * listen to `navigateTo` events
   *
   * @param {'navigateTo'} event
   * @param {Function} callback
   */
  function listen(
    event: 'navigateTo',
    callback: (data: NavigationIntent) => void,
  ): Promise<number>

  /**
   * listen to `navigateTo` events
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'navigateTo'} event
   * @param {Function} callback
   */
  function once(
    event: 'navigateTo',
    callback: (data: NavigationIntent) => void,
  ): Promise<number>

  /**
   * Get the discovery policy
   *
   * @param {'policyChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'policyChanged',
    callback: (data: DiscoveryPolicy) => void,
  ): Promise<number>

  /**
   * Get the discovery policy
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'policyChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'policyChanged',
    callback: (data: DiscoveryPolicy) => void,
  ): Promise<number>

  /**
   * Pull version: Provide information about a program entity and its available watchable assets, such as entitlement status and price, via either a push or pull call flow.
   * @param {Function} callback A callback method that takes a EntityInfoParameters object and returns a Promise<EntityInfoResult>
   * @deprecated
   */
  function entityInfo(
    callback: (parameters: EntityInfoParameters) => Promise<EntityInfoResult>,
  ): Promise<boolean>

  /**
   * Pull version: Provide a list of purchased content for the authenticated account, such as rentals and electronic sell through purchases.
   * @param {Function} callback A callback method that takes a PurchasedContentParameters object and returns a Promise<PurchasedContentResult>
   * @deprecated
   */
  function purchasedContent(
    callback: (
      parameters: PurchasedContentParameters,
    ) => Promise<PurchasedContentResult>,
  ): Promise<boolean>

  /**
   * Getter: Get the discovery policy
   *
   */
  function policy(): Promise<DiscoveryPolicy>

  /**
   * Subscriber: Get the discovery policy
   *
   */
  function policy(
    subscriber: (policy: DiscoveryPolicy) => void,
  ): Promise<number>

  /**
   * Provide a list of purchased content for the authenticated account, such as rentals and electronic sell through purchases.
   *
   * @param {string} correlationId
   * @param {PurchasedContentResult} result The data for the purchasedContent
   * @deprecated
   */
  function purchasedContent(result: PurchasedContentResult): Promise<boolean>

  /**
   * Inform the platform that your user is signed in, for increased visibility in search & discovery. Sign-in state is used separately from what content can be access through entitlements and availabilities. Sign-in state may be used when deciding whether to choose this app to handle a user intent. For instance, if the user tries to launch something generic like playing music from an artist, only a signed-in app will be chosen. If the user wants to tune to a channel, only a signed-in app will be chosen to handle that intent. While signIn can optionally include entitlements as those typically change at signIn time, it is recommended to make a separate call to Discovery.contentAccess for entitlements. signIn is not only for when a user explicitly enters login credentials. If an app does not require any credentials from the user to consume content, such as in a free app, then the app should call signIn immediately on launch.
   *
   * @param {Entitlement[]} entitlements Optional array of Entitlements, in case of a different user account, or a long time since last sign-in.
   */
  function signIn(entitlements?: Entitlement[]): Promise<boolean>

  /**
   * Inform the platform that your user has signed out. See `Discovery.signIn` for more details on how the sign-in state is used.signOut will NOT clear entitlements, the app should make a separate call to Discovery.clearContentAccess. Apps should also call signOut when a login token has expired and the user is now in a signed-out state.
   *
   */
  function signOut(): Promise<boolean>

  /**
   * Send an entity that the user has expressed interest in to the platform.
   *
   * @param {InterestType} type
   * @param {InterestReason} reason
   * @param {EntityDetails} entity
   */
  function userInterest(
    type: InterestType,
    reason: InterestReason,
    entity: EntityDetails,
  ): Promise<null>

  /**
   * Notify the platform that content was partially or completely watched
   *
   * @param {string} entityId The entity Id of the watched content.
   * @param {number} progress How much of the content has been watched (percentage as (0-0.999) for VOD, number of seconds for live)
   * @param {boolean} completed Whether or not this viewing is considered "complete," per the app's definition thereof
   * @param {string} watchedOn Date/Time the content was watched, ISO 8601 Date/Time
   * @param {AgePolicy} agePolicy
   */
  function watched(
    entityId: string,
    progress?: number,
    completed?: boolean,
    watchedOn?: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Suggest a call-to-action for this app on the platform home screen
   *
   * @param {LocalizedString} title The title of this call to action
   * @param {ContentIdentifiers} identifiers A set of content identifiers for this call to action
   * @param {string} expires When this call to action should no longer be presented to users
   * @param {object} images A set of images for this call to action
   */
  function watchNext(
    title: LocalizedString,
    identifiers: ContentIdentifiers,
    expires?: string,
    images?: object,
  ): Promise<boolean>

  // Provider Interfaces

  interface ProviderSession {
    correlationId(): string // Returns the correlation id of the current provider session
  }

  interface FocusableProviderSession extends ProviderSession {
    focus(): Promise<void> // Requests that the provider app be moved into focus to prevent a user experience
  }

  interface UserInterestProvider {
    userInterest(
      parameters: UserInterestProviderParameters,
      session: ProviderSession,
    ): Promise<EntityDetails>
  }

  function provide(
    capability: 'xrn:firebolt:capability:discovery:interest',
    provider: UserInterestProvider | object,
  ): Promise<void>
}

export module Keyboard {
  // Types

  /**
   *
   */
  enum EmailUsage {
    SIGN_IN = 'signIn',
    SIGN_UP = 'signUp',
  }

  /**
   * Prompt the user for their email address with a simplified list of choices.
   *
   * @param {EmailUsage} type Why the email is being requested, e.g. sign on or sign up
   * @param {string} message The message to display while prompting
   */
  function email(type: EmailUsage, message?: string): Promise<string>

  /**
   * Show the password entry keyboard, with typing obfuscated from visibility
   *
   * @param {string} message The message to display while prompting
   */
  function password(message?: string): Promise<string>

  /**
   * Show the standard platform keyboard, and return the submitted value
   *
   * @param {string} message The message to display while prompting
   */
  function standard(message: string): Promise<string>
}

export module Lifecycle {
  type Event =
    | 'background'
    | 'foreground'
    | 'inactive'
    | 'suspended'
    | 'unloading'

  // Types

  /**
   * The application close reason
   */
  enum CloseReason {
    REMOTE_BUTTON = 'remoteButton',
    USER_EXIT = 'userExit',
    DONE = 'done',
    ERROR = 'error',
  }

  /**
   * The application lifecycle state
   */
  enum LifecycleState {
    INITIALIZING = 'initializing',
    INACTIVE = 'inactive',
    FOREGROUND = 'foreground',
    BACKGROUND = 'background',
    UNLOADING = 'unloading',
    SUSPENDED = 'suspended',
  }

  /**
   * A an object describing the previous and current states
   */
  type LifecycleEvent = {
    state: LifecycleState // The application lifecycle state
    previous: LifecycleState // The application lifecycle state
    source?: 'voice' | 'remote' // The source of the lifecycle change.
  }

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Request that the platform move your app out of focus
   *
   * @param {CloseReason} reason The reason the app is requesting to be closed
   */
  function close(reason: CloseReason): Promise<void>

  /**
   * Notify the platform that the app is done unloading
   *
   */
  function finished(): Promise<void>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen to the background event
   *
   * @param {'background'} event
   * @param {Function} callback
   */
  function listen(
    event: 'background',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the background event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'background'} event
   * @param {Function} callback
   */
  function once(
    event: 'background',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen to the foreground event
   *
   * @param {'foreground'} event
   * @param {Function} callback
   */
  function listen(
    event: 'foreground',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the foreground event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'foreground'} event
   * @param {Function} callback
   */
  function once(
    event: 'foreground',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the inactive event
   *
   * @param {'inactive'} event
   * @param {Function} callback
   */
  function listen(
    event: 'inactive',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the inactive event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'inactive'} event
   * @param {Function} callback
   */
  function once(
    event: 'inactive',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the suspended event
   *
   * @param {'suspended'} event
   * @param {Function} callback
   */
  function listen(
    event: 'suspended',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the suspended event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'suspended'} event
   * @param {Function} callback
   */
  function once(
    event: 'suspended',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the unloading event
   *
   * @param {'unloading'} event
   * @param {Function} callback
   */
  function listen(
    event: 'unloading',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Listen to the unloading event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'unloading'} event
   * @param {Function} callback
   */
  function once(
    event: 'unloading',
    callback: (data: LifecycleEvent) => void,
  ): Promise<number>

  /**
   * Notify the platform that the app is ready
   *
   */
  function ready(): Promise<void>

  /**
   * Get the current state of the app. This function is **synchronous**.
   *
   */
  function state(): LifecycleState
}

export module Localization {
  type Event =
    | 'countryCodeChanged'
    | 'languageChanged'
    | 'localeChanged'
    | 'localityChanged'
    | 'postalCodeChanged'
    | 'preferredAudioLanguagesChanged'

  // Types

  /**
   *
   */
  type Locality = string

  /**
   *
   */
  type CountryCode = string

  /**
   *
   */
  type Language = string

  /**
   *
   */
  type ISO639_2Language = string

  /**
   *
   */
  type Locale = string

  /**
   *
   */
  type LatLon = [
    number, // undefined  item
    number, // undefined  item
  ]

  /**
   * Get any platform-specific localization information
   *
   */
  function additionalInfo(): Promise<object>

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Getter: Get the ISO 3166-1 alpha-2 code for the country device is located in
   *
   */
  function countryCode(): Promise<CountryCode>

  /**
   * Subscriber: Get the ISO 3166-1 alpha-2 code for the country device is located in
   *
   */
  function countryCode(subscriber: (code: CountryCode) => void): Promise<number>

  /**
   * Getter: Get the ISO 639 1/2 code for the preferred language
   *
   * @deprecated since version 0.17.0
   */
  function language(): Promise<Language>

  /**
   * Subscriber: Get the ISO 639 1/2 code for the preferred language
   *
   */
  function language(subscriber: (lang: Language) => void): Promise<number>

  /**
   * Get the approximate latitude and longitude coordinates of the device location
   *
   */
  function latlon(): Promise<LatLon>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Getter: Get the *full* BCP 47 code, including script, region, variant, etc., for the preferred langauage/locale
   *
   */
  function locale(): Promise<Locale>

  /**
   * Subscriber: Get the *full* BCP 47 code, including script, region, variant, etc., for the preferred langauage/locale
   *
   */
  function locale(subscriber: (locale: Locale) => void): Promise<number>

  /**
   * Getter: Get the locality/city the device is located in
   *
   */
  function locality(): Promise<Locality>

  /**
   * Subscriber: Get the locality/city the device is located in
   *
   */
  function locality(subscriber: (locality: Locality) => void): Promise<number>

  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Get the ISO 3166-1 alpha-2 code for the country device is located in
   *
   * @param {'countryCodeChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'countryCodeChanged',
    callback: (data: CountryCode) => void,
  ): Promise<number>

  /**
   * Get the ISO 3166-1 alpha-2 code for the country device is located in
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'countryCodeChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'countryCodeChanged',
    callback: (data: CountryCode) => void,
  ): Promise<number>

  /**
   * Get the ISO 639 1/2 code for the preferred language
   *
   * @param {'languageChanged'} event
   * @param {Function} callback
   * @deprecated since version 0.17.0
   */
  function listen(
    event: 'languageChanged',
    callback: (data: Language) => void,
  ): Promise<number>

  /**
   * Get the ISO 639 1/2 code for the preferred language
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'languageChanged'} event
   * @param {Function} callback
   * @deprecated since version 0.17.0
   */
  function once(
    event: 'languageChanged',
    callback: (data: Language) => void,
  ): Promise<number>

  /**
   * Get the *full* BCP 47 code, including script, region, variant, etc., for the preferred langauage/locale
   *
   * @param {'localeChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'localeChanged',
    callback: (data: Locale) => void,
  ): Promise<number>

  /**
   * Get the *full* BCP 47 code, including script, region, variant, etc., for the preferred langauage/locale
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'localeChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'localeChanged',
    callback: (data: Locale) => void,
  ): Promise<number>

  /**
   * Get the locality/city the device is located in
   *
   * @param {'localityChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'localityChanged',
    callback: (data: Locality) => void,
  ): Promise<number>

  /**
   * Get the locality/city the device is located in
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'localityChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'localityChanged',
    callback: (data: Locality) => void,
  ): Promise<number>

  /**
   * Get the postal code the device is located in
   *
   * @param {'postalCodeChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'postalCodeChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Get the postal code the device is located in
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'postalCodeChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'postalCodeChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * A prioritized list of ISO 639 1/2 codes for the preferred audio languages on this device.
   *
   * @param {'preferredAudioLanguagesChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'preferredAudioLanguagesChanged',
    callback: (data: ISO639_2Language[]) => void,
  ): Promise<number>

  /**
   * A prioritized list of ISO 639 1/2 codes for the preferred audio languages on this device.
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'preferredAudioLanguagesChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'preferredAudioLanguagesChanged',
    callback: (data: ISO639_2Language[]) => void,
  ): Promise<number>

  /**
   * Getter: Get the postal code the device is located in
   *
   */
  function postalCode(): Promise<string>

  /**
   * Subscriber: Get the postal code the device is located in
   *
   */
  function postalCode(subscriber: (postalCode: string) => void): Promise<number>

  /**
   * Getter: A prioritized list of ISO 639 1/2 codes for the preferred audio languages on this device.
   *
   */
  function preferredAudioLanguages(): Promise<ISO639_2Language[]>

  /**
   * Subscriber: A prioritized list of ISO 639 1/2 codes for the preferred audio languages on this device.
   *
   */
  function preferredAudioLanguages(
    subscriber: (languages: ISO639_2Language[]) => void,
  ): Promise<number>
}

export module Metrics {
  // Types

  /**
   *
   */
  enum ErrorType {
    NETWORK = 'network',
    MEDIA = 'media',
    RESTRICTION = 'restriction',
    ENTITLEMENT = 'entitlement',
    OTHER = 'other',
  }

  /**
   *
   */
  type FlatMap = {}

  /**
   * The policy that describes various age groups to which content is directed. See distributor documentation for further details.
   */
  type AgePolicy = string | 'app:adult' | 'app:child' | 'app:teen'

  /**
   * Represents a position inside playback content, as a decimal percentage (0-0.999) for content with a known duration, or an integer number of seconds (0-86400) for content with an unknown duration.
   */
  type MediaPosition = void | number | number

  /**
   * Inform the platform of something not covered by other Metrics APIs.
   *
   * @param {string} category The category of action being logged. Must be 'user' for user-initated actions or 'app' for all other actions
   * @param {string} type A short, indexible identifier for the action, e.g. 'SignIn Prompt Displayed'
   * @param {FlatMap} parameters
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function action(
    category: 'user' | 'app',
    type: string,
    parameters?: FlatMap,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Inform the platform about an app's build info.
   *
   * @param {string} build The build / version of this app.
   */
  function appInfo(build: string): Promise<null>

  /**
   * Inform the platform of an error that has occured in your app.
   *
   * @param {ErrorType} type The type of error
   * @param {string} code an app-specific error code
   * @param {string} description A short description of the error
   * @param {boolean} visible Whether or not this error was visible to the user.
   * @param {FlatMap} parameters Optional additional parameters to be logged with the error
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function error(
    type: ErrorType,
    code: string,
    description: string,
    visible: boolean,
    parameters?: FlatMap,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when playback has stopped because the end of the media was reached.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaEnded(entityId: string, agePolicy?: AgePolicy): Promise<boolean>

  /**
   * Called when setting the URL of a media asset to play, in order to infer load time.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaLoadStart(
    entityId: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when media playback will pause due to an intentional pause operation.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaPause(entityId: string, agePolicy?: AgePolicy): Promise<boolean>

  /**
   * Called when media playback should start due to autoplay, user-initiated play, or unpausing.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaPlay(entityId: string, agePolicy?: AgePolicy): Promise<boolean>

  /**
   * Called when media playback actually starts due to autoplay, user-initiated play, unpausing, or recovering from a buffering interuption.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaPlaying(
    entityId: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called every 60 seconds as media playback progresses.
   *
   * @param {string} entityId The entityId of the media.
   * @param {MediaPosition} progress Progress of playback, as a decimal percentage (0-0.999) for content with a known duration, or an integer number of seconds (0-86400) for content with an unknown duration.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaProgress(
    entityId: string,
    progress: MediaPosition,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when the playback rate of media is changed.
   *
   * @param {string} entityId The entityId of the media.
   * @param {number} rate The new playback rate.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaRateChange(
    entityId: string,
    rate: number,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when the playback rendition (e.g. bitrate, dimensions, profile, etc) is changed.
   *
   * @param {string} entityId The entityId of the media.
   * @param {number} bitrate The new bitrate in kbps.
   * @param {number} width The new resolution width.
   * @param {number} height The new resolution height.
   * @param {string} profile A description of the new profile, e.g. 'HDR' etc.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaRenditionChange(
    entityId: string,
    bitrate: number,
    width: number,
    height: number,
    profile?: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when a seek is completed during media playback.
   *
   * @param {string} entityId The entityId of the media.
   * @param {MediaPosition} position Resulting position of the seek operation, as a decimal percentage (0-0.999) for content with a known duration, or an integer number of seconds (0-86400) for content with an unknown duration.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaSeeked(
    entityId: string,
    position: MediaPosition,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when a seek is initiated during media playback.
   *
   * @param {string} entityId The entityId of the media.
   * @param {MediaPosition} target Target destination of the seek, as a decimal percentage (0-0.999) for content with a known duration, or an integer number of seconds (0-86400) for content with an unknown duration.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaSeeking(
    entityId: string,
    target: MediaPosition,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Called when media playback will halt due to a network, buffer, or other unintentional constraint.
   *
   * @param {string} entityId The entityId of the media.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function mediaWaiting(
    entityId: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Inform the platform that your user has navigated to a page or view.
   *
   * @param {string} pageId Page ID of the content.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function page(pageId: string, agePolicy?: AgePolicy): Promise<boolean>

  /**
   * Inform the platform that your user has started content.
   *
   * @param {string} entityId Optional entity ID of the content.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function startContent(
    entityId?: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>

  /**
   * Inform the platform that your user has stopped content.
   *
   * @param {string} entityId Optional entity ID of the content.
   * @param {AgePolicy} agePolicy The age policy to associate with the metrics event. The age policy describes the age group to which content is directed.
   */
  function stopContent(
    entityId?: string,
    agePolicy?: AgePolicy,
  ): Promise<boolean>
}

export module Parameters {
  // Types

  /**
   * In the case of a program `entityType`, specifies the program type.
   */
  enum ProgramType {
    MOVIE = 'movie',
    EPISODE = 'episode',
    SEASON = 'season',
    SERIES = 'series',
    OTHER = 'other',
    PREVIEW = 'preview',
    EXTRA = 'extra',
    CONCERT = 'concert',
    SPORTING_EVENT = 'sportingEvent',
    ADVERTISEMENT = 'advertisement',
    MUSIC_VIDEO = 'musicVideo',
    MINISODE = 'minisode',
  }

  /**
   * In the case of a music `entityType`, specifies the type of music entity.
   */
  enum MusicType {
    SONG = 'song',
    ALBUM = 'album',
  }

  /**
   *
   */
  type IntentProperties = {}

  /**
   *
   */
  type ChannelEntity = {
    entityType: 'channel'
    channelType: 'streaming' | 'overTheAir'
    entityId: string // ID of the channel, in the target App's scope.
    appContentData?: string
  }

  /**
   *
   */
  type MusicEntity = {
    entityType: 'music'
    musicType: MusicType // In the case of a music `entityType`, specifies the type of music entity.
    entityId: string
  }

  /**
   * A Firebolt compliant representation of a Movie entity.
   */
  type MovieEntity = {
    entityType: 'program'
    programType: 'movie'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * The policy that describes various age groups to which content is directed. See distributor documentation for further details.
   */
  type AgePolicy = string | 'app:adult' | 'app:child' | 'app:teen'

  /**
   * A Firebolt compliant representation of a user intention.
   */
  type Intent = {
    action: string
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a Playlist entity.
   */
  type PlaylistEntity = {
    entityType: 'playlist'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for an abstract query to be searched for and played by the app.
   */
  type PlayQueryIntent = {
    action: 'play-query'
    data: {
      query: string
      options?: {
        programTypes?: ProgramType[]
        musicTypes?: MusicType[]
      }
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to it's home screen, and bring that app to the foreground if needed.
   */
  type HomeIntent = {
    action: 'home'
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to launch an app.
   */
  type LaunchIntent = {
    action: 'launch'
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type UntypedEntity = {
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a TV Episode entity.
   */
  type TVEpisodeEntity = {
    entityType: 'program'
    programType: 'episode'
    entityId: string
    seriesId: string
    seasonId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of the remaining program entity types.
   */
  type AdditionalEntity = {
    entityType: 'program'
    programType:
      | 'concert'
      | 'sportingEvent'
      | 'preview'
      | 'other'
      | 'advertisement'
      | 'musicVideo'
      | 'minisode'
      | 'extra'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a section not covered by `home`, `entity`, `player`, or `search`, and bring that app to the foreground if needed.
   */
  type SectionIntent = {
    action: 'section'
    data: {
      sectionName: string
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to 'tune' to a traditional over-the-air broadcast, or an OTT Stream from an OTT or vMVPD App.
   */
  type TuneIntent = {
    action: 'tune'
    data: {
      entity: ChannelEntity
      options?: {
        assetId?: string // The ID of a specific 'listing', as scoped by the target App's ID-space, which the App should begin playback from.
        restartCurrentProgram?: boolean // Denotes that the App should start playback at the most recent program boundary, rather than 'live.'
        time?: string // ISO 8601 Date/Time where the App should begin playback from.
      }
      // The options property of the data property MUST have only one of the following fields.
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * An a message notification from a second screen device
   */
  type SecondScreenEvent = {
    type: 'dial'
    version?: string
    data?: string
  }

  /**
   * A Firebolt compliant representation of a TV Season entity.
   */
  type TVSeasonEntity = {
    entityType: 'program'
    programType: 'season'
    entityId: string
    seriesId: string
    assetId?: string
    appContentData?: string
  }

  /**
   *
   */
  type PlayableEntity =
    | MovieEntity
    | TVEpisodeEntity
    | PlaylistEntity
    | MusicEntity
    | AdditionalEntity

  /**
   * A Firebolt compliant representation of a TV Series entity.
   */
  type TVSeriesEntity = {
    entityType: 'program'
    programType: 'series'
    entityId: string
    assetId?: string
    appContentData?: string
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for a specific, playable entity, and bring that app to the foreground if needed.
   */
  type PlaybackIntent = {
    action: 'playback'
    data: PlayableEntity
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type ProgramEntity =
    | MovieEntity
    | TVEpisodeEntity
    | TVSeasonEntity
    | TVSeriesEntity
    | AdditionalEntity

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a the video player for a specific, playable entity, and bring that app to the foreground if needed.
   */
  type PlayEntityIntent = {
    action: 'play-entity'
    data: {
      entity: PlayableEntity
      options?: {
        playFirstId?: string
        playFirstTrack?: number
      }
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   *
   */
  type Entity =
    | ProgramEntity
    | MusicEntity
    | ChannelEntity
    | UntypedEntity
    | PlaylistEntity

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to a specific entity page, and bring that app to the foreground if needed.
   */
  type EntityIntent = {
    action: 'entity'
    data: Entity
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate an app to it's search UI with a search term populated, and bring that app to the foreground if needed.
   */
  type SearchIntent = {
    action: 'search'
    data?: {
      query: string
      suggestions?: Entity[]
    }
    context: {
      source: string
      agePolicy?: AgePolicy // The policy that describes various age groups to which content is directed. See distributor documentation for further details.
    }
  }

  /**
   * A Firebolt compliant representation of a user intention to navigate to a specific place in an app.
   */
  type NavigationIntent =
    | HomeIntent
    | LaunchIntent
    | EntityIntent
    | PlaybackIntent
    | SearchIntent
    | SectionIntent
    | TuneIntent
    | PlayEntityIntent
    | PlayQueryIntent

  /**
   *
   */
  type AppInitialization = {
    us_privacy?: string // The IAB US Privacy string.
    lmt?: number // The IAB limit ad tracking opt out value.
    discovery?: {
      navigateTo?: NavigationIntent // A Firebolt compliant representation of a user intention to navigate to a specific place in an app.
    }
    secondScreen?: {
      launchRequest?: SecondScreenEvent // An a message notification from a second screen device
    }
  }

  /**
   * Returns any initialization parameters for the app, e.g. initialial `NavigationIntent`.
   *
   */
  function initialization(): Promise<AppInitialization>
}

export module Profile {
  // Types

  /**
   *
   */
  type FlatMap = {}

  /**
   * Verifies that the current profile should have access to mature/adult content.
   *
   */
  function approveContentRating(): Promise<boolean>

  /**
   * Verifies that the current profile should have access to making purchases.
   *
   */
  function approvePurchase(): Promise<boolean>

  /**
   * Get a map of profile flags for the current session.
   *
   */
  function flags(): Promise<FlatMap>
}

export module SecondScreen {
  type Event = 'closeRequest' | 'friendlyNameChanged' | 'launchRequest'

  // Types

  /**
   *
   */
  type BooleanMap = {}

  /**
   * An a message notification from a second screen device
   */
  type SecondScreenEvent = {
    type: 'dial'
    version?: string
    data?: string
  }

  /**
   * Turn off all listeners previously registered from this module.
   */
  function clear(): boolean

  /**
   * Clear a specific listen by the listener ID.
   *
   * @param {number} id The id of the listener to clear
   */
  function clear(id: number): boolean

  /**
   * Get the broadcasted id for the device
   *
   * @param {string} type The type of second screen protocol, e.g. "dial"
   */
  function device(type?: string): Promise<string>

  /**
   * Getter: Get the broadcasted friendly name for the device
   *
   */
  function friendlyName(): Promise<string>

  /**
   * Subscriber: Get the broadcasted friendly name for the device
   *
   */
  function friendlyName(
    subscriber: (friendlyName: string) => void,
  ): Promise<number>

  /**
   * Listen to all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function listen(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen for the first of any and all events dispatched by this module.
   *
   * @param {Function} callback
   */
  function once(
    callback: (event: string, data: object) => void,
  ): Promise<number>
  /**
   * Listen to the closeRequest event
   *
   * @param {'closeRequest'} event
   * @param {Function} callback
   */
  function listen(
    event: 'closeRequest',
    callback: (data: SecondScreenEvent) => void,
  ): Promise<number>

  /**
   * Listen to the closeRequest event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'closeRequest'} event
   * @param {Function} callback
   */
  function once(
    event: 'closeRequest',
    callback: (data: SecondScreenEvent) => void,
  ): Promise<number>

  /**
   * Get the broadcasted friendly name for the device
   *
   * @param {'friendlyNameChanged'} event
   * @param {Function} callback
   */
  function listen(
    event: 'friendlyNameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Get the broadcasted friendly name for the device
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'friendlyNameChanged'} event
   * @param {Function} callback
   */
  function once(
    event: 'friendlyNameChanged',
    callback: (data: string) => void,
  ): Promise<number>

  /**
   * Listen to the launchRequest event
   *
   * @param {'launchRequest'} event
   * @param {Function} callback
   */
  function listen(
    event: 'launchRequest',
    callback: (data: SecondScreenEvent) => void,
  ): Promise<number>

  /**
   * Listen to the launchRequest event
   * When using `once` the callback method will only fire once, and then disconnect your listener
   *
   * @param {'launchRequest'} event
   * @param {Function} callback
   */
  function once(
    event: 'launchRequest',
    callback: (data: SecondScreenEvent) => void,
  ): Promise<number>

  /**
   * Get the supported second screen discovery protocols
   *
   */
  function protocols(): Promise<BooleanMap>
}

export module SecureStorage {
  // Types

  /**
   * The scope of the data
   */
  enum StorageScope {
    DEVICE = 'device',
    ACCOUNT = 'account',
  }

  /**
   *
   */
  type StorageOptions = {
    ttl: number // Seconds from set time before the data expires and is removed
  }

  /**
   * Clears all the secure data values
   *
   * @param {StorageScope} scope The scope of the key/value
   */
  function clear(scope: StorageScope): Promise<void>

  /**
   * Get stored value by key
   *
   * @param {StorageScope} scope The scope of the key/value
   * @param {string} key Key to get
   */
  function get(scope: StorageScope, key: string): Promise<string | null>

  /**
   * Remove a secure data value
   *
   * @param {StorageScope} scope The scope of the data key
   * @param {string} key Key to remove
   */
  function remove(scope: StorageScope, key: string): Promise<void>

  /**
   * Set or update a secure data value
   *
   * @param {StorageScope} scope The scope of the data key
   * @param {string} key Key to set
   * @param {string} value Value to set
   * @param {StorageOptions} options Optional parameters to set
   */
  function set(
    scope: StorageScope,
    key: string,
    value: string,
    options?: StorageOptions,
  ): Promise<void>
}
