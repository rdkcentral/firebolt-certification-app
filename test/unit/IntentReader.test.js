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

import IntentReader from 'IntentReader';
import { eventEmitter, showToast } from '../../src/Toast';

// Mocking the appInstance variable
const originalEnv = { ...process.env };
process.env = {
  ...originalEnv,
  APPOBJECT: {
    tag: jest.fn().mockReturnValue({
      text: {
        get text() {
          return '';
        },
        set text(value) {
          // Mock the assignment of the text property
        },
      },
    }),
    text: {
      get text() {
        return '';
      },
      set text(value) {
        // Mock the assignment of the text property
      },
    },
  },
};

const mockFireboltExampleInvoker = {
  invoke: () => {},
};
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

const mockFireboltTransportInvoker = {
  invoke: jest.fn().mockImplementation(() => {
    return Promise.resolve('success');
  }),
};
jest.mock('../../src/FireboltTransportInvoker', () => {
  return {
    get: () => {
      return mockFireboltTransportInvoker;
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

test('Test showToast function', () => {
  const toastMessage = 'toastMessage';
  const toastState = 'toastState';
  const toastRef = 'toastRef';

  // Call the showToast function
  showToast(toastMessage, toastState, toastRef);

  // Assert that eventEmitter.emit was called with the expected arguments
  expect(eventEmitter.emit).toHaveBeenCalledWith('showToast', toastMessage, toastState, toastRef);
});

jest.mock('../../src/pubsub/handlers/GetPubSubStatusHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ pubSubStatus: 'Connection successful' })),
  }));
});

jest.mock('../../src/pubsub/handlers/GetTestHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ jobId: 'no report found' })),
  }));
});

jest.mock('../../src/pubsub/handlers/RunTestHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ error: 'Not performed' })),
  }));
});

jest.mock('../../src/pubsub/handlers/DataFetchHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(null),
  }));
});

jest.mock('../../src/pubsub/handlers/RegisterEventHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: {} })),
  }));
});

jest.mock('../../src/pubsub/handlers/ClearEventListeners', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: {} })),
  }));
});

jest.mock('../../src/pubsub/handlers/clearEventHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: {} })),
  }));
});

jest.mock('../../src/pubsub/handlers/setApiResponseHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'received' })),
  }));
});

jest.mock('../../src/pubsub/handlers/RegisterProviderHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'registered' })),
  }));
});

jest.mock('../../src/pubsub/handlers/lifecycleRecordHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: 'successful' })),
  }));
});

jest.mock('../../src/pubsub/handlers/GetEventResponse', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: {} })),
  }));
});

jest.mock('../../src/pubsub/handlers/CallMethodHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ report: {} })),
  }));
});

jest.mock('../../src/pubsub/handlers/HealthCheckHandler', () => {
  return jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockResolvedValue(JSON.stringify({ status: 'OK' })),
  }));
});

describe('IntentReader', () => {
  beforeEach(async () => {});

  describe('processIntent', () => {
    test('should return null if task is not defined in message', async () => {
      const message = {};
      const intentReader = new IntentReader();
      const result = await intentReader.processIntent(message);
      console.log(expect.getState().currentTestName + ' : ' + result);
      expect(result).not.toBeDefined();
    });

    test('should return error if handler is not known', async () => {
      const message = { task: 'unknownhandler' };
      const intentReader = new IntentReader();
      const result = await intentReader.processIntent(message);
      console.log(expect.getState().currentTestName + ' : ' + result);
      const expectedResponse = { error: 'Invalid request. Provide valid method' };
      expect(result).toBe(JSON.stringify(expectedResponse));
    });

    test('should return valid response string for valid handler', async () => {
      const message = { task: 'getPubSubStatus' };
      const intentReader = new IntentReader();
      const result = await intentReader.processIntent(message);
      console.log(expect.getState().currentTestName + ' : ' + result);
      const expectedResponse = { pubSubStatus: 'Connection successful' };
      expect(result).toBe(JSON.stringify(expectedResponse));
    });
  });
});
