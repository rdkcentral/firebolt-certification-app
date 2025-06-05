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

const winston = require('winston');
const { CONSTANTS } = require('../constant');

const logConfiguration = {
  transports: [
    new winston.transports.Console({ level: CONSTANTS.LOGGER_LEVEL }),
    new winston.transports.File({ filename: 'opt/logs/fca.log', level: CONSTANTS.LOGGER_LEVEL }})
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    winston.format.printf((options) => {
      const args = options[Symbol.for('splat')];
      return `[${options.timestamp}][${options.level}][${options.moduleName}][${args}][${options.message}]`;
    })
  ),
};
const logger = winston.createLogger(logConfiguration);

module.exports = function (name) {
  return logger.child({ moduleName: name });
};
