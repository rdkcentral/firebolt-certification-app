/**
 * Copyright 2023 Comcast Cable Communications Management, LLC
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

import CONFIG_CONSTANTS from 'config';
import * as CoreSDK from '@firebolt-js/sdk';
import * as ManageSDK from '@firebolt-js/manage-sdk';
import FireboltSdkManager from './utils/FireboltSdkManager';

/**
 * Dynamically check if the Discovery SDK is available as a dependency.
 * If available, require it. Otherwise, log a warning.
 */
const dependencies = DEPENDENCIES; // Injected by Webpack DefinePlugin
let DiscoverySDK;

if (dependencies.hasOwnProperty('@firebolt-js/discovery-sdk')) {
  try {
    DiscoverySDK = require('@firebolt-js/discovery-sdk');
  } catch (error) {
    console.warn('DiscoverySDK is not available:', error);
  }
}

// Initialize the Firebolt SDK Module Loader
const sdkManager = new FireboltSdkManager(CoreSDK, ManageSDK, DiscoverySDK, dependencies);

const defaultSdks = sdkManager.generateDefaultSdkConstants();

export const CONSTANTS = {
  ALL_SDKS: 'ALL SDKS',
  SDK: 'SDK',
  LIFECYLCE_VALIDTION_METHOD: 'Lifecycle.validation',
  PASS: 'PASS',
  FAIL: 'FAIL',
  NO_LISTENER_ID: 'No listener id received',
  REPORT_STATUS: {
    SKIPPED: 'skipped',
    FAILED: 'failed',
    PASSED: 'passed',
    PENDING: 'pending',
  },
  MESSENGER: 'Messenger',
  NOTPERFORMED: 'Invalid mode passed to test runner. Pass valid modes.',
  NO_ERROR_FOUND: 'No error found',
  EXIT_MODAL_TITLE: 'Do you want to Exit ?',
  INTENT_RECEIVED: 'Intent received: ',
  INTENT_ERR: 'Task failed: Intent error',
  TASK_COMPL: 'Task completed: ',
  COMPL_COLOR: 0xff008c00,
  ERR_COLOR: 0xffff0000,
  NOTIFICATION_DURATION: 5000,
  TOAST_STATE: 'ToastState',
  TOAST_STATE_COMPL: 'ToastStateCompl',
  TOAST_REF: 'Toast',
  TOAST_REF_COMPL: 'ToastCompl',
  YES: 'Yes',
  NO: 'No',
  APP_NAVIGATION_UI: 'UI',
  APP_NAVIGATION_MESSENGER: 'MESSENGER',
  SCROLL_MENU_MESSAGE: "Scroll down through the menu's to view the result",
  LIFECYCLE_METHOD_LIST: [
    'Lifecycle.ready',
    'Lifecycle.state',
    'Lifecycle.close',
    'Lifecycle.finished',
    'Lifecycle.history',
    'Lifecycle.onInactive',
    'Lifecycle.onForeground',
    'Lifecycle.onBackground',
    'Lifecycle.finished',
    'Lifecycle.schema',
    'Lifecycle.background',
    'Lifecycle.suspend',
    'Lifecycle.unsuspend',
  ],
  CONTENT_ERROR: 'Content Error',
  RDK_SERVICES: 'org.rdk.',
  API_TITLE: 'API TITLE: ',
  API_RESPONSE: 'Response: ',
  INVOKE_TEST_MESSAGE: '**** Click Invoke to run tests ****',
  VALIDATION_MESSAGE: '***** Validation Started ******',
  VALIDATION_SCROLLMESSAGE: "Scroll down through the menu's to view the result",
  SCHEMA_VALIDATION_STATUSMESSAGE: 'Schema Validation: ',
  CONTENT_VALIDATION_STATUSMESSAGE: 'Content Validation: ',
  VALIDATION: 'Validation: ',
  SCHEMA_CONTENT_SKIPPED: 'Skipped',
  ERROR_MESSAGE: 'Error Message: ',
  UNDEFINED_RESPONSE_MESSAGE: 'Received response as undefined',
  TOKEN_UNAVAILABLE: 'Token is empty, provide a valid token',
  LENGTHY_DATA_WARNING: 'WARNING: Data too long for container. \nRefer mochawesome report for complete response.',
  REPORT_QUEUE_SIZE: 10,
  DEFAULT: 'default',
  NO_PLATFORM: 'NO_PLATFORM',
  PLATFORM_ERROR_MESSAGE: 'Unsupported target used.',
  PLATFORM_TARGET: 'Please use any of the supported targets-[XCLASS, etc].',
  FIREBOLT_COMMAND: 'fireboltCommand',
  FIREBOLT_METHOD: 'fireboltMethod',
  FIREBOLT_PARAMS: 'fireboltParams',
  RESPONSE_TOPIC: 'responseTopic',
  PARAMS: 'params',
  HEALTH_CHECK: 'healthCheck',
  ERROR_LIST: ['Method not found', 'Method Not Implemented'],
  TRANSPORT: 'Transport',
  STATUS_CODE: [0, 1, 2, 3],
  SCHEMA_VALIDATION_STATUS_CODE: ['PASS', 'FAIL', 'SKIPPED', 'PENDING'],
  SET: 'Set',
  CALL_METHOD: 'callMethod',
  TOKEN_EXPIRE_TIME: 84000,
  ACCOUNT_SESSION: 'Account.session',
  AUTHENTICATION_TOKEN: 'Authentication.token',
  AUTHENTICATION_ROOT: 'Authentication.root',
  DEVICE: 'device',
  PLATFORM: 'platform',
  NOT_PROVISIONED_ERROR: 'Custom error: Failed to fetch token from distribution platform',
  SKIPPED_MESSAGE: 'Method Skipped by Certification Suite',
  EXCEPTION_METHODS: [],
  CORE: 'CORE',
  MANAGE: 'MANAGE',
  DISCOVERY: 'DISCOVERY',
  FIREBOLT_ALL: 'FIREBOLT-ALL',
  ERROR_MESSAGE_WRONG_METHOD_NAME: { code: -32601, message: 'Wrong Method Name' },
  INVALID_REQUEST_TYPE: 'Error: Invalid requestType',
  LOGGER_LEVEL: 'debug',
  EXCLUDED_VALUES: [null, undefined],
  FIREBOLT_CONST: 'firebolt',
  CERTIFICATION: false,
  METHODS_T0_IGNORE_WHICH_HAS_SET: ['privacy.settings', 'securestorage.setForApp'],
  ERROR_MESSAGEREGEX: new RegExp('((-)[0-9]{5}): ([A-Za-z ]*)'),
  LOCK_TIME: 20000,
  MAX_FAILURES: 3,
  PINS: { purchase: '1111' },
  MOCKOS_PORT: 'ws://localhost:9998',
  MOCKOS_UNAVAILABLE: 'MockOs is not running',
  PLATFORM_MOCKOS: 'mock-firebolt-os',
  DISABLE_VOICE_ANNOUNCEMENT: false,
  ENABLE_VOICE_ANNOUNCEMENT: true,
  TARGET_TO_BE_EXCLUDED: [],
  METHODS_TO_BE_EXCLUDED: [],
  METHODS_TO_BE_EXCLUDED_ONLY_DEVICES: [],
  PUBSUB_ACK: { pubSubStatus: 'Connection successful' },
  SUBSCRIBE: 'Subscribe',
  ADDITIONAL_SUBSCRIBE: 'Subscribing additional method',
  PROVIDER_REGISTRATION: 'provider registered successfully',
  PROVIDER_REGISTRATION_FAILED: 'Provider registeration failed',
  NO_PROVIDER_SPECIFIED: 'No provider has been specified',
  LIFECYCLE_RECORDING_STARTED: 'Lifecycle History Recording has been started for ',
  APPID_DOESNOT_MATCH: ' passed does not match launched app ',
  INVALID_LIFECYCLE_RECORD: 'Invalid lifecycle record request',
  WRONG_ERROR_MESSAGE_FORMAT: 'Expected error response. Actual result does not conform to the standard error format',
  WRONG_RESPONSE_MESSAGE_FORMAT: 'Unexpected error encountered in the response',
  EXCLUDED_METHODS_FOR_SDK: [],
  EXCLUDED_METHODS_FOR_TRANSPORT: [],
  REGISTERPROVIDER: 'registerprovider',
  defaultSDKs: defaultSdks,
  INVOKEPROVIDER: 'invokeProvider',
  INVOKEMANAGER: 'invokeManager',
  INVOKEDSDK: 'invokeSDK',
  additionalSDKs: [],
  EXCLUDED_METHODS_FOR_MFOS: [],
  PASCAL_CASED_MODULES: ['SecondScreen', 'SecureStorage', 'ClosedCaptions', 'AcknowledgeChallenge', 'DeveloperTools', 'LifecycleManagement', 'PinChallenge', 'UserGrants', 'VoiceGuidance'],
  X_MODULE_DESCRIPTIONS: 'x-module-descriptions',
  ...CONFIG_CONSTANTS,
  VERSIONS: 'Versions',
  NO_RESULT_OR_ERROR_MESSAGE: 'No result or error in response. eg: {jsonrpc: "2.0", id: x }',
  SCHEMA_VALIDATION: 'Schema Validation',
  MESSAGE: 'Message',
  RESPONSE: 'Response',
  SLA_VALIDATION: 'SLA Validation',
  SLA_VALIDATION_FAILED_MESSAGE: 'Method response time exceeded expected value',
  SLA_VALIDATION_SKIPPED_MESSAGE: 'Unable to perform SLA Validation because expected response time not present in openrpc',
  STATUS: 'Status',
  FAST: 'fast',
  ACTUAL: 'Actual',
  EXPECTED: 'Expected',
  STRING: 'string',
  UNDEFINED: 'undefined',
  COMPLEX_VALUE_TO_DISPLAY: 'Expected value too complex to display. Refer openrpc in Specification under Additional Context',
  OBJECT: 'object',
  SLA_VALIDATION_INTENT: 'sla-validation',
  OPENRPC_URL: 'https://rdkcentral.github.io/firebolt/requirements/latest/specifications/firebolt-open-rpc.json',
  DEFAULT_SLA: 300,
};
