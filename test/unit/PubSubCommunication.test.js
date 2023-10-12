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

import PubSubCommunication from '../../src/PubSubCommunication';
import pubSubClient from '../../src/pubSubClient';

jest.mock('../../src/IntentReader', () => {
  return jest.fn().mockImplementation(function () {
    // Custom constructor implementation
    // You can add any initialization logic here if needed
    this.processIntent = jest.fn().mockImplementation((message) => {
      console.log('printing incoming message to mock: ' + JSON.stringify(message));
      if (message.task == 'NullResponse') {
        return new Promise((resolve) => {
          resolve(null);
        });
      } else if (message.task === 'ErrorTask') {
        throw new Error('ErrorTask has occurred');
      } else {
        return new Promise((resolve) => {
          resolve("{'result':'someresult'}");
        });
      }
    });
  });
});

let currentCallback = null;
const mockPubSubClient = {
  subscribe: jest.fn().mockImplementation((subscribeTopic, callback) => {
    console.log('mock implementation subscribe for topic: ' + subscribeTopic);
    currentCallback = callback;
  }),
  publish: jest.fn().mockImplementation((topic, data, headers) => {
    console.log('incoming message to mock for : ' + topic + ' , ' + data + ' , ' + JSON.stringify(headers));
  }),
  unsubscribe: () => {},
};
// Mock PubSub Client implementation to initialize pubsub connection
jest.mock('../../src/pubSubClient', () => {
  return {
    getClient: jest.fn().mockImplementation(() => {
      console.log('mock implementation getClient ');
      return mockPubSubClient;
    }),
  };
});

// Mock the logger module
jest.mock('../../src/utils/Logger', () => {
  const loggerMock = {
    error: jest.fn(),
    info: jest.fn(),
  };
  return jest.fn(() => loggerMock);
});

describe('PubSubCommunication', () => {
  let loggerMock;
  let mockPubSubCommunication;
  let result;
  let requestParams;
  beforeEach(async () => {
    mockPubSubCommunication = new PubSubCommunication();
    loggerMock = require('../../src/utils/Logger')();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getResponseTopic', () => {
    beforeAll(() => {
      process.env.PUBSUB_PUBLISH_TOPIC = 'somepublishtopic';
    });

    test('should return publish topic of no params are passed', () => {
      result = mockPubSubCommunication.getResponseTopic();
      expect(result).toBe('somepublishtopic');
    });

    test('should return publish topic if no params are passed in the requestParams', () => {
      requestParams = { someparams: { responseTopic: 'mockResponseTopic' } };
      result = mockPubSubCommunication.getResponseTopic(requestParams);
      expect(result).toBe('somepublishtopic');
    });

    test('should return publish topic if no params are passed in the requestParams', () => {
      requestParams = { params: { someTopic: 'mockResponseTopic' } };
      result = mockPubSubCommunication.getResponseTopic(requestParams);
      expect(result).toBe('somepublishtopic');
    });

    test('should return response topic params has response topic', () => {
      requestParams = { params: { responseTopic: 'mockResponseTopic' } };
      result = mockPubSubCommunication.getResponseTopic(requestParams);
      expect(result).toBe('mockResponseTopic');
    });

    test('should return null if no response topic or publish topic', () => {
      delete process.env.PUBSUB_PUBLISH_TOPIC;
      requestParams = { params: { someTopic: 'mockResponseTopic' } };
      result = mockPubSubCommunication.getResponseTopic(requestParams);
      expect(result).toBeNull();
    });
  });

  describe('startWebSocket', () => {
    test('should log an error if incoming message parsing fails', async () => {
      process.env.PUBSUB_SUBSCRIBE_TOPIC = 'somesubscribetopic';
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      const payload = {
        action: 'search',
        data: {
          query: 'somequery',
        },
        context: {
          source: 'device',
        },
      };
      const message = { headers: { id: 'header1' }, payload: JSON.stringify(payload) };
      currentCallback(JSON.stringify(message));
      expect(loggerMock.error).toHaveBeenCalledWith(expect.stringContaining('Pubsub notification parse failed'), 'startWebSocket');
    });

    test('should establish client and subscribe to the client', async () => {
      process.env.PUBSUB_PUBLISH_TOPIC = 'somepublishtopic';
      process.env.PUBSUB_SUBSCRIBE_TOPIC = 'somesubscribetopic';
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      expect(mockPubSubClient.subscribe).toHaveBeenCalledWith('somesubscribetopic', expect.any(Function));

      // publishing a topic
      const payload = {
        action: 'search',
        data: {
          query: '{"task":"registerEvent","params":{"event":"advertising.onPolicyChanged","params":[]},"action":"NA","appType":"firebolt"}',
        },
        context: {
          source: 'device',
        },
      };
      const message = { headers: { id: 'header1' }, payload: JSON.stringify(payload) };
      currentCallback(JSON.stringify(message));
      // wait for the call back to complete before running assertions on publish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(mockPubSubClient.publish).toHaveBeenCalledWith('somepublishtopic', "{'result':'someresult'}", message.headers);
    });

    test('should not process intent if the incoming message does not have a task', async () => {
      process.env.PUBSUB_SUBSCRIBE_TOPIC = 'somesubscribetopic';
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      expect(mockPubSubClient.subscribe).toHaveBeenCalled();
      const payload = {
        action: 'search',
        data: {
          query: '{"params":{"event":"advertising.onPolicyChanged","params":[]},"action":"NA","appType":"firebolt"}',
        },
        context: {
          source: 'device',
        },
      };
      const error = { code: 'FCAError', message: 'No task in request' };

      const message = { payload: JSON.stringify(payload) };
      currentCallback(JSON.stringify(message));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(mockPubSubClient.publish).toHaveBeenCalledWith('somepublishtopic', JSON.stringify(error), null);
    });
    test('should not publish if responseString is null or undefined', async () => {
      process.env.PUBSUB_SUBSCRIBE_TOPIC = 'somesubscribetopic';
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      expect(mockPubSubClient.subscribe).toHaveBeenCalledWith('somesubscribetopic', expect.any(Function));

      // publishing a topic
      const payload = {
        action: 'search',
        data: {
          query: '{"task":"NullResponse","params":{"event":"somevent","params":[]},"action":"NA","appType":"firebolt"}',
        },
        context: {
          source: 'device',
        },
      };
      const message = { payload: JSON.stringify(payload) };
      currentCallback(JSON.stringify(message));
      // wait for the call back to complete before running assertions on publish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(mockPubSubClient.publish).not.toHaveBeenCalled();
    });

    test('should log error if task execution errors out. ', async () => {
      process.env.PUBSUB_SUBSCRIBE_TOPIC = 'somesubscribetopic';
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      expect(mockPubSubClient.subscribe).toHaveBeenCalledWith('somesubscribetopic', expect.any(Function));

      // publishing a topic
      const payload = {
        action: 'search',
        data: {
          query: '{"task":"ErrorTask","params":{"event":"somevent","params":[]},"action":"NA","appType":"firebolt"}',
        },
        context: {
          source: 'device',
        },
      };
      const message = { headers: { id: 'header1' }, payload: JSON.stringify(payload) };
      currentCallback(JSON.stringify(message));
      // wait for the call back to complete before running assertions on publish
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(loggerMock.error).toHaveBeenCalledWith(expect.stringContaining('Task execution failed:'), 'startWebSocket');
    });

    test('should log error if connection fails', async () => {
      const error = new Error('Connection failed');
      pubSubClient.getClient.mockRejectedValueOnce(error);
      await mockPubSubCommunication.startWebSocket();
      expect(pubSubClient.getClient).toHaveBeenCalled();
      expect(loggerMock.error).toHaveBeenCalledWith(`Unable to establish pubsub connection: ${error}`, 'startWebSocket');
    });
  });
});
