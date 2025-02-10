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

import LifecycleHistory from '../../src/LifeCycleHistory';
import { assignModuleCapitalization } from '../../src/utils/Utils';
const logger = require('../../src/utils/Logger')('LifeCycleHistory.test.js');
const mockValidationResponse = {
  errors: ['error'],
};

jest.mock('../../src/utils/Utils', () => {
  return {
    getschemaValidationDone: () => {
      return Promise.resolve(mockValidationResponse);
    },
    assignModuleCapitalization: () => {
      return Promise.resolve(mockValidationResponse);
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

jest.mock('../../src/FireboltExampleInvoker', () => {
  return {
    get: () => {
      return mockFireboltExampleInvoker;
    },
  };
});

jest.mock('../../src/FireboltTransportInvoker', () => {
  return {
    get: () => {
      return mockFireboltTransportInvoker;
    },
  };
});

jest.mock('../../src/pubsub/handlers/RegisterProviderHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'registered' })),
  }));
});

const mockCallBackRes = { state: 'foreground', source: '' };
jest.mock('@firebolt-js/sdk', () => {
  return {
    Discovery: {
      listen: jest.fn(),
    },
    Lifecycle: {
      ready: () => {},
      state: () => {
        return 'initializing'; // dummy state value.
      }, // returning a Lifecycle.state object
      close: () => {},
      finish: () => {},
      finished: () => {},
      listen: (event, callback) => {
        callback(mockCallBackRes);
      },
    },
    Parameters: {
      initialization: () => {
        return {
          lmt: 0,
          us_privacy: '1-Y-',
          discovery: {
            navigateTo: {
              action: 'search',
              data: {
                query: '{"params": {"lifecycle_validation":true}}',
              },
              context: {
                source: 'voice',
              },
            },
          },
        };
      },
    },
  };
});
jest.mock('../../src/Toast', () => {
  const eventEmitter = {
    emit: jest.fn(),
  };

  return {
    eventEmitter: eventEmitter,
    showToast: (toastMessage, toastState, toastRef) => {
      eventEmitter.emit('showToast', toastMessage, toastState, toastRef);
    },
  };
});
let lifecycleHistory;
const eventname = 'lifecycle.onInactive';
const event = { state: 'inactive', previous: 'initializing' };
const eventUndefined = undefined;

describe('#init', () => {
  beforeAll(() => {
    process.env.LIFECYCLE_VALIDATION = 'true';
  });

  it('should init', async () => {
    const instance = new LifecycleHistory();
    await instance.init();
    mockValidationResponse.errors = [];
    await instance.init();
    mockValidationResponse.errors = ['Passed'];
    await instance.init();
  });
});

describe('LifecycleHistory test cases', () => {
  beforeEach(() => {
    lifecycleHistory = new LifecycleHistory();
  });
  test('validate _recordHistory', async () => {
    mockValidationResponse.errors = ['error'];
    await lifecycleHistory._recordHistory(eventname, event);
    mockValidationResponse.errors = [];
    await lifecycleHistory._recordHistory(eventname, event);
  });
  test('validate _recordHistory with event undefined', async () => {
    const result = await lifecycleHistory._recordHistory(eventname, eventUndefined);
    logger.info(result);
    expect(result).toBeUndefined();
  });
  test('validate get', () => {
    LifecycleHistory.get();
  });
  test('validate get history', () => {
    LifecycleHistory.get().history;
  });
});
