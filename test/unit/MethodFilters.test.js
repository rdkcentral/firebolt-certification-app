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

import MethodFilters from '../../src/MethodFilters';
import { CONSTANTS } from '../../src/constant';

jest.mock('../../src/FireboltExampleInvoker', () => {
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
  };
});

jest.mock('@firebolt-js/sdk/dist/lib/Transport/index.mjs', () => {
  return {
    send: () => {
      return {};
    },
  };
});

jest.mock('@firebolt-js/sdk', () => {
  return {
    Accessibility: {},
    Account: {},
    Advertising: {},
    Authentication: {},
    Device: {},
    Discovery: {},
    Keyboard: {},
    Lifecycle: {
      ready: () => {},
      state: () => {
        return 'initializing'; // dummy state value.
      }, // returning a Lifecycle.state object
      close: () => {},
      finish: () => {},
    },
    Localization: {},
    Metrics: {},
    Profile: {},
    Parameters: {},
    SecondScreen: {},
  };
});

let methodFilters;
let result;

describe('MethodFilters', () => {
  let method;
  beforeEach(() => {
    methodFilters = new MethodFilters();
  });

  describe('isEventMethod', () => {
    test('should return true if method has event tag', () => {
      method = { name: 'device.onDeviceNameChanged', tags: [{ name: 'event' }] };
      result = methodFilters.isEventMethod(method);
      expect(result).toBe(true);
    });

    test('should return false if method does not have tags', () => {
      method = { name: 'device.onDeviceNameChanged' };
      result = methodFilters.isEventMethod(method);
      expect(result).toBe(false);
    });

    test('should return false if method has tags but not event tag', () => {
      method = { name: 'device.onDeviceNameChanged', tags: [{ name: 'call' }] };
      result = methodFilters.isEventMethod(method);
      expect(result).toBe(false);
    });

    test('should return true if method has tags and one of them is event', () => {
      method = {
        name: 'device.onDeviceNameChanged',
        tags: [{ name: 'sometag' }, { name: 'event' }],
      };
      result = methodFilters.isEventMethod(method);
      expect(result).toBe(true);
    });
  });

  describe('isRpcMethod', () => {
    test('should return false if invokedSdk is core and communication mode is transport', () => {
      method = { name: 'internal.internalize', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'core', 'Transport');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(false);
    });
    test('should return false if invokedSdk is manage and communication mode is transport', () => {
      method = { name: 'closedcaptions.setClosedCaptionsEnabled', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'manage', 'Transport');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(false);
    });
    test('should return false if invokedSdk is manage and name starts with set', () => {
      method = { name: 'closedcaptions.setClosedCaptionsEnabled', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'manage');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(false);
    });
    test('should return true if invoked sdk is core and communication mode is sdk and tag has rpc only', () => {
      method = { name: 'discovery.onpullentityinfo', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'core');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(true);
    });
    test('should return true if invoked sdk is manage and communication mode is sdk and tag has rpc only', () => {
      method = { name: 'mockModule.mockMethod', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'manage');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(true);
    });
    test('should return true if invoked sdk is some sdk and communication mode is sdk and tag has rpc only', () => {
      method = { name: 'mockModule.mockMethod', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isRpcMethod(method, 'exetnsion');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(true);
    });
    test('should return false if invoked sdk is some sdk and communication mode is sdk and no tags are passed', () => {
      method = { name: 'mockModule.mockMethod' };
      result = methodFilters.isRpcMethod(method, 'exetnsion');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(false);
    });
    test('should return false if invoked sdk is some sdk and communication mode is sdk and has tags but not rpc-only', () => {
      method = { name: 'mockModule.mockMethod', tags: [{ name: 'only' }] };
      result = methodFilters.isRpcMethod(method, 'exetnsion');
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(false);
    });
  });

  describe('isPolymorphicPullMethod', () => {
    test('should return true if tags contain polymorphic-pull', () => {
      method = { name: 'discovery.entityInfo', tags: [{ name: 'polymorphic-pull' }] };
      result = methodFilters.isPolymorphicPullMethod(method);
      expect(result).toBe(true);
    });
    test('should return true if tags contain polymorphic-pull', () => {
      method = {
        name: 'discovery.entityInfo',
        tags: [{ name: 'polymorphic-pull' }, { name: 'rpc-only' }],
      };
      result = methodFilters.isPolymorphicPullMethod(method);
      expect(result).toBe(true);
    });
    test('should return false if no polymorphic-pull tags are found', () => {
      method = { name: 'discovery.entityInfo', tags: [{ name: 'rpc-only' }] };
      result = methodFilters.isPolymorphicPullMethod(method);
      expect(result).toBe(false);
    });
    test('should return false if no tags are found', () => {
      method = { name: 'discovery.entityInfo' };
      result = methodFilters.isPolymorphicPullMethod(method);
      expect(result).toBe(false);
    });
  });

  describe('isSubscribeMethod', () => {
    test('should return true if method has Subscribe in it', () => {
      method = { name: 'Subscribing additional method device.id' };
      result = methodFilters.isSubscribeMethod(method);
      expect(result).toBe(true);
    });

    test('should return false if method does not have subscribe in it ', () => {
      method = { name: 'account.id' };
      result = methodFilters.isSubscribeMethod(method);
      expect(result).toBe(false);
    });

    test('should return false if method does not have subscribe in it ', () => {
      method = { name: 'Subscribe to settings' };
      result = methodFilters.isSubscribeMethod(method);
      expect(result).toBe(false);
    });

    test('should return false if method has Subscribe but not in the beginning ', () => {
      method = { name: 'account.id Subscribe' };
      result = methodFilters.isSubscribeMethod(method);
      expect(result).toBe(false);
    });

    test('should return false if method does not have name ', () => {
      method = { method: 'Subscribe device.id' };
      result = methodFilters.isSubscribeMethod(method);
      expect(result).toBe(false);
    });
  });

  describe('isSetMethod', () => {
    test('should return true if method.name starts with Set-', () => {
      method = { name: 'Set-account.id' };
      result = methodFilters.isSetMethod(method);
      expect(result).toBe(true);
    });
    test('should return false if method.name does not start with Set-', () => {
      method = { name: 'account.id' };
      result = methodFilters.isSetMethod(method);
      expect(result).toBe(false);

      method = { name: 'Setaccount.id' };
      result = methodFilters.isSetMethod(method);
      expect(result).toBe(false);
    });
    test('should return false when method does not have name key', () => {
      method = { methodName: 'account.id' };
      result = methodFilters.isSetMethod(method);
      expect(result).toBe(false);
    });
  });

  describe('isMethodToBeExcluded', () => {
    beforeAll(() => {
      delete process.env.METHODS_TO_BE_EXCLUDED;
      delete process.env.MOCKOS;
    });
    test('should return false if method.name is not defined', () => {
      method = { methodName: 'somemethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      expect(result).toBe(false);
    });
    test('should return true if method.name in CONSTANTS and mock firebolt is not true', () => {
      method = { name: 'mockmodule.mockmethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      expect(result).toBe(true);
    });
    test('should return false if method.name in CONSTANTS and mock firebolt is  true', () => {
      process.env.MOCKOS = true;
      method = { name: 'mockmodule.mockmethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).toBe(true);
    });
    test('should return false if method.name not in CONSTANTS and mock firebolt is true', () => {
      process.env.MOCKOS = true;
      method = { name: 'somemethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      expect(result).toBe(false);
    });

    test('should return true if method.name not in CONSTANTS but in process.env', () => {
      process.env.MOCKOS = true;
      process.env.METHODS_TO_BE_EXCLUDED = ['somemethod'];
      method = { name: 'somemethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      expect(result).toBe(true);
    });
    test('should return true if method.name not in CONSTANTS but in process.env and mock os is false', () => {
      process.env.MOCKOS = false;
      process.env.METHODS_TO_BE_EXCLUDED = ['somemethod'];
      method = { name: 'somemethod' };
      result = methodFilters.isMethodToBeExcluded(method);
      expect(result).toBe(true);
    });
  });

  describe('isExceptionMethod', () => {
    beforeAll(() => {
      delete process.env.EXCEPTION_METHODS;
    });
    test('should return false if process.env.EXCEPTION_METHODS is undefined', () => {
      method = { name: 'somemethod' };
      result = methodFilters.isExceptionMethod(method.name, method.params);
      expect(result).toBe(false);
    });
    test('should return false if process.env.EXCEPTION_METHODS is not an array', () => {
      process.env.EXCEPTION_METHODS = 'somemethod';
      method = { name: 'somemethod' };
      result = methodFilters.isExceptionMethod(method.name, method.params);
      expect(result).toBe(false);
    });

    test('should return true if process.env.EXCEPTION_METHODS contains method', () => {
      process.env = {
        ...process.env,
        EXCEPTION_METHODS: [{ method: 'module.somemethodwparams', param: { type: 'someparam' } }, { method: 'somemodule.somemethod' }],
      };

      method = { name: 'somemodule.somemethod' };
      result = methodFilters.isExceptionMethod(method.name, method.params);
      expect(result).toBe(true);
    });

    test('should return true if both method and param match', () => {
      process.env = {
        ...process.env,
        EXCEPTION_METHODS: [{ method: 'module.somemethodwparams', param: { type: 'someparam' } }, { method: 'somemodule.somemethod' }],
      };

      method = { name: 'module.somemethodwparams', param: [{ name: 'type', value: 'someparam' }] };
      result = methodFilters.isExceptionMethod(method.name, method.param);
      expect(result).toBe(true);
    });

    test('should return false if both param doesnt match', () => {
      process.env = {
        ...process.env,
        EXCEPTION_METHODS: [{ method: 'module.somemethodwparams', param: { type: 'someparam' } }, { method: 'somemodule.somemethod' }],
      };

      method = {
        name: 'module.somemethodwparams',
        param: [{ name: 'type', value: 'unmatchedparam' }],
      };
      result = methodFilters.isExceptionMethod(method.name, method.param);
      expect(result).toBe(false);

      method = {
        name: 'module.somemethodwparams',
        param: [{ name: 'category', value: 'unmatchedparam' }],
      };
      result = methodFilters.isExceptionMethod(method.name, method.param);
      expect(result).toBe(false);
    });
  });

  describe('shouldExcludeExample', () => {
    let example;
    let result;
    beforeAll(() => {
      process.env.PLATFORM = 'someplatform';
      process.env.TARGET = 'sometarget';
    });

    test('should return false when platform and target are undefined', () => {
      delete process.env.PLATFORM;
      delete process.env.TARGET;
      example = {
        name: 'Acquire SecManager XACT Token API for type: root',
        params: [
          {
            name: 'type',
            value: 'root',
          },
        ],
      };

      result = methodFilters.shouldExcludeExample(example);
      expect(result).toBe(false);
    });

    test('should return true if even one of platform or target is not xclass and example matches example in list', () => {
      process.env.PLATFORM = CONSTANTS.PLATFORM_XCLASS;
      process.env.TARGET = 'sometarget';
      example = {
        name: 'Acquire SecManager XACT Token API for type: root',
        params: [
          {
            name: 'type',
            value: 'root',
          },
        ],
      };

      result = methodFilters.shouldExcludeExample(example);
      expect(result).toBe(true);

      process.env.PLATFORM = 'someplatform';
      process.env.target = CONSTANTS.PLATFORM_XCLASS;
      example = {
        name: 'Acquire SecManager XACT Token API for type: root',
        params: [
          {
            name: 'type',
            value: 'root',
          },
        ],
      };

      result = methodFilters.shouldExcludeExample(example);
      expect(result).toBe(true);
    });

    test('should return false when both platform and target are xclass', () => {
      process.env.PLATFORM = CONSTANTS.PLATFORM_XCLASS;
      process.env.TARGET = CONSTANTS.PLATFORM_XCLASS;
      example = {
        name: 'Acquire SecManager XACT Token API for type: root',
        params: [
          {
            name: 'type',
            value: 'root',
          },
        ],
      };

      result = methodFilters.shouldExcludeExample(example);
      expect(result).toBe(false);
    });

    test('should return false when example doesnt match', () => {
      process.env.PLATFORM = 'someplatform';
      process.env.TARGET = 'sometarget';
      example = {
        name: 'Acquire SecManager XACT Token API for type: distributor',
        params: [
          {
            name: 'type',
            value: 'distributor',
          },
        ],
      };

      result = methodFilters.shouldExcludeExample(example);
      expect(result).toBe(false);
    });
  });
});
