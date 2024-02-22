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

// ************* Description *************
// * Establish WS connection and initialize report queue
// * Subscribe to topic and parse message
// * Call suitable validation method and generate report
// * Publish report to WS topic or publish jobId
// * Retreieve and publish report from queue if jobId is provided
// Script version : 0.1
// Date : 31 Jan 2022
// ************* End Description **********

import { CONSTANTS } from './constant';
require('dotenv').config();

import pubSubClient from 'pubSubClient';
import IntentReader from 'IntentReader';

const logger = require('./utils/Logger')('PubSubCommunication.js');
let client = null;

// Custom queue structure to store reports for async runTest and getTest calls
class reportQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    if (this.items.length >= CONSTANTS.REPORT_QUEUE_SIZE) {
      this.items.shift();
    }
    this.items.push(element);
  }
  findReport(itemId) {
    let requiredReport = null;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['reportId'] == itemId) {
        requiredReport = this.items[i]['report'];
      }
    }
    return requiredReport;
  }
}

const asyncReports = new reportQueue();

export default class PubSubCommunication {
  getResponseTopic(requestParams) {
    if (requestParams && requestParams[CONSTANTS.PARAMS] && requestParams[CONSTANTS.PARAMS][CONSTANTS.RESPONSE_TOPIC]) {
      return requestParams[CONSTANTS.PARAMS][CONSTANTS.RESPONSE_TOPIC];
    }

    if (process.env.PUBSUB_PUBLISH_TOPIC) {
      return process.env.PUBSUB_PUBLISH_TOPIC;
    }

    return null;
  }

  async startWebSocket() {
    try {
      // Establishing pubsub connection. Compression is enabled by default.
      client = await pubSubClient.getClient();
      process.env.PUBSUB_CONNECTION = client;
      client.subscribe(process.env.PUBSUB_SUBSCRIBE_TOPIC, (data) => {
        let message = null;
        let headers = null;

        try {
          // Parsing nested JSON containing methods and params within the decompressed pubsub payload.
          logger.info('Logging incoming message: ' + JSON.stringify(data));
          message = JSON.parse(data);
          if (message.headers) {
            headers = message.headers;
          }
          message = JSON.parse(message.payload);
          message = JSON.parse(message.data.query);
        } catch (err) {
          logger.error('Pubsub notification parse failed' + err, 'startWebSocket');
        }

        const intentReader = new IntentReader();

        try {
          if (message.task) {
            const responseTopic = this.getResponseTopic(message);
            intentReader.processIntent(message).then((responseString) => {
              if (responseString) {
                client.publish(responseTopic, responseString, headers);
              }
            });
          } else {
            const responseTopic = this.getResponseTopic(message);
            const responseString = { code: 'FCAError', message: 'No task in request' };
            client.publish(responseTopic, JSON.stringify(responseString), headers);
          }
        } catch (err) {
          logger.error('Task execution failed: ' + err, 'startWebSocket');
        }
      });
    } catch (err) {
      logger.error('Unable to establish pubsub connection: ' + err, 'startWebSocket');
    }
  }
}
