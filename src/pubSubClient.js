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

const { v4: uuidv4 } = require('uuid');
const logger = require('../src/utils/Logger')('pubSubClient.js');
require('dotenv').config({ override: true });

class PubSubClient {
  constructor() {
    this.ws = null;
    this.url = 'ws://your-ws-url-here.com';
    this.PUBSUB_SUBSCRIBE_TOPIC_SUFFIX = '_FCS';
    this.PUBSUB_PUBLISH_TOPIC_SUFFIX = '_FCA';
  }

  // Initializes a WS connection
  async initialize() {
    const appUrl = window.location;
    let pubSubTopicUUID = new URLSearchParams(appUrl.search).get('pubsub_uuid');

    // If pubsub_uuid isn't passed as a query param, use a default value
    if (!pubSubTopicUUID) {
      pubSubTopicUUID = 'DEFAULT_TOPIC';
      console.warn(`WARNING: No pubsub_uuid query parameter found. Using default value: ${pubSubTopicUUID}`);
    }

    process.env.PUBSUB_SUBSCRIBE_TOPIC = pubSubTopicUUID + this.PUBSUB_SUBSCRIBE_TOPIC_SUFFIX;
    process.env.PUBSUB_PUBLISH_TOPIC = pubSubTopicUUID + this.PUBSUB_PUBLISH_TOPIC_SUFFIX;

    // Establish WS Connection
    this.ws = new WebSocket(this.url);
    logger.info('Establishing a WS connection...', 'initialize');
    console.warn('WARNING: WebSocket connections will fail to initialize. The file has not been properly configured. Please update the URL to point to your WebSocket server for communication to work.');

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
  publish(topic, message, headers) {
    if (!topic) {
      logger.info('No topic provided...');
      return false;
    }

    const publishMsg = {
      operation: 'pub',
      topic,
      payload: {
        message,
      },
    };

    // If headers are passed in, add them to the payload object
    if (headers) {
      payload.payload.headers = headers;
    }

    logger.info('Publishing message: ', JSON.stringify(publishMsg));

    // Send publish message
    try {
      this.ws.send(JSON.stringify(publishMsg));
      return true;
    } catch (err) {
      logger.error('Failed to publish message...', err);
      return false;
    }
  }

  // Subscribe to a topic
  subscribe(topic, callback) {
    const subscribeMsg = {
      operation: 'sub',
      topic,
    };

    // Listen for incoming messages
    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      // Format received message by removing headers from payload object
      const formattedMsg = {
        operation: data.operation,
        topic: data.topic,
        payload: data.payload.message,
      };

      // Add headers to top level of formatted message if they exist
      if (data.payload.headers) {
        formattedMsg.headers = data.payload.headers;
      }

      // If a callback function is provided, call it with the formattedMsg
      if (typeof callback === 'function') {
        callback(JSON.stringify(formattedMsg));
      }
    });

    // Send subscribe message
    try {
      this.ws.send(JSON.stringify(subscribeMsg));
    } catch (err) {
      logger.error('Failed to subscribe to topic...', err);
    }
  }

  // Unsubscribe to a topic
  unsubscribe(topic) {
    const payload = {
      operation: 'unsub',
      topic,
    };

    // Send unsubscribe message
    try {
      this.ws.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      logger.error('Failed to unsubscribe from topic...', err);
      return false;
    }
  }

  // Checks WebSocket connection status
  isConnected() {
    let status = false;
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      logger.info('WS connection already Established');
      status = true;
    }
    return status;
  }
}

const getClient = async () => {
  const pubSubClient = new PubSubClient();
  await pubSubClient.initialize();
  return pubSubClient;
};

module.exports = { getClient };
