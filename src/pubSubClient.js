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

const logger = require('./utils/Logger')('pubSubClient.js');

class PubSubClient {
  constructor() {
    this.ws = null;
    this.url = 'ws://your-ws-url-here.com';
  }

  // Initializes a WS connection
  async initialize() {
    // Establish WS Connection
    this.ws = new WebSocket(this.url);
    logger.info('Establishing a WS connection...', 'initialize');
    console.warn('WARNING: This sample file has not been configured, and as a result, WebSocket connections will fail to initialize. Developers must properly configure the file in order to establish a valid connection.');

    return new Promise((resolve, reject) => {
      this.ws.addEventListener('open', (event) => {
        logger.info('WS connection initialized...', event);
        resolve(true);
      });

      this.ws.addEventListener('error', (event) => {
        logger.error('Failed to initialize a WS connection...', 'initialize');
        reject(false);
      });
    });
  }

  // Publish a message to a topic
  publish(topic, message) {
    if (!topic) {
      logger.info('No topic provided...');
      return false;
    }

    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'publish',
      payload: message,
      timestamp: new Date().getTime(),
    };

    try {
      this.ws.send(JSON.stringify(samplePayload));
      return true;
    } catch (err) {
      logger.error('Failed to publish message...', err);
      return false;
    }
  }

  // Subscribe to a topic
  subscribe(topic, callback) {
    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'subscribe',
      topic: topic,
      timestamp: new Date().getTime(),
    };

    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type == 'EventMessage') {
        callback(JSON.stringify(data));
      }
    });

    try {
      this.ws.send(JSON.stringify(samplePayload));
    } catch (err) {
      logger.error('Failed to subscribe to topic...', err);
    }
  }

  // Unsubscribe to a topic
  unsubscribe(topic) {
    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'unsubscribe',
      topic: topic,
      timestamp: new Date().getTime(),
    };

    try {
      this.ws.send(JSON.stringify(samplePayload));
      return true;
    } catch (err) {
      logger.error('Failed to unsubscribe from topic...', err);
      return false;
    }
  }
}

const getClient = async () => {
  const pubSubClient = new PubSubClient();
  await pubSubClient.initialize();
  return pubSubClient;
};

module.exports = { getClient };
