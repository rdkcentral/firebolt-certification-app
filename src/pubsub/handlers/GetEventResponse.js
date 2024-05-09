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

import BaseHandler from './BaseHandler';
import { EventInvocation } from 'EventInvocation';
require('dotenv').config();

export default class GetEventResponse extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    const eventInvocation = new EventInvocation();
    const validationReport = eventInvocation.getEventResponse(message);
    const validationReportObject = { jsonrpc: '2.0', result: validationReport, id: process.env.ID + 1 };
    return JSON.stringify(validationReportObject);
  }
}
