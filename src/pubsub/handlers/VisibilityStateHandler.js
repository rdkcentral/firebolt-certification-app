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
const logger = require('../../utils/Logger')('VisibilityStateHandler.js');
export default class VisibilityStateHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle() {
    try {
      const visibilityState = window.document.visibilityState;
      const reportIdString = JSON.stringify({ report: visibilityState });
      return reportIdString;
    } catch (error) {
      logger.error('Error while fetching vissibilityState', error);
    }
  }
}