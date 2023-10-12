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

require('dotenv').config();

export default class GetTestHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    let requestedReport = null;
    if (message.params.jobId) {
      requestedReport = asyncReports.findReport(message.params.jobId); // this is inherently going to fail. unless asyncReports is reinstated.
      if (requestedReport == null) {
        requestedReport = JSON.stringify({
          jobId: message.params.jobId,
          error: 'No report found',
        });
      } else {
        requestedReport = JSON.stringify({
          jobId: message.params.jobId,
          report: JSON.parse(requestedReport),
        });
      }
    }
    return requestedReport;
  }
}
