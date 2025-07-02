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

// const winston = require('winston');
// const { CONSTANTS } = require('../constant');

// const logConfiguration = {
//   transports: [new winston.transports.Console({ level: CONSTANTS.LOGGER_LEVEL })],
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'MMM-DD-YYYY HH:mm:ss',
//     }),
//     winston.format.printf((options) => {
//       const args = options[Symbol.for('splat')];
//       return `[${options.timestamp}][${options.level}][${options.moduleName}][${args}][${options.message}]`;
//     })
//   ),
// };
// const logger = winston.createLogger(logConfiguration);

// module.exports = function (name) {
//   return logger.child({ moduleName: name });
// };

/**
 * Copyright 2024 Comcast Cable Communications Management, LLC
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
const fs = require('fs');
const path = require('path');
const { CONSTANTS } = require('../constant');

const LOG_PATH_PREFIX = './opt/logs/fca';
const TEMP_LOG_PATH = path.join(LOG_PATH_PREFIX, 'logstemp.log');

const transports = [
  new winston.transports.Console({
    level: 'debug',
    stderrLevels: ['error'],
    consoleWarnLevels: [],
  }),
];

let fileTransport = null;

// Enable file logging
try {
  fs.mkdirSync(LOG_PATH_PREFIX, { recursive: true });
  fs.writeFileSync(TEMP_LOG_PATH, '', { flag: 'a' }); // Touch temp file
  fileTransport = new winston.transports.File({ filename: TEMP_LOG_PATH, level: CONSTANTS.LOGGER_LEVEL });
  transports.push(fileTransport);
} catch (err) {
  console.warn('[A] File system not writable, using console-only logs.');
}

const logConfiguration = {
  transports,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    winston.format.printf((options) => {
      const args = options[Symbol.for('splat')];
      const argsString = args ? ` [${args}]` : '';
      const moduleNameString = options.moduleName ? ` [${options.moduleName}]` : '';
      return `[${options.timestamp}] [${options.level}]${moduleNameString}${argsString}: [${JSON.stringify(options.message) || ''}]`;
    })
  ),
};

const logger = winston.createLogger(logConfiguration);

// Exported logger function
const getLogger = function (name) {
  return logger.child({ moduleName: name });
};

// Add updateLoggerLevel to export
getLogger.updateLoggerLevel = function (level) {
  for (const t of logger.transports) {
    t.level = level;
  }
  console.log(`[A] Log level updated to ${level}`);
};

// Add promoteTempLog to export
getLogger.promoteTempLog = function (jobId) {
  console.log("[A] ~ promoteTempLog:" )
  logger.transports.forEach((t, index) => {
    if (t instanceof winston.transports.File) {
      console.log(`[A] Transport[${index}] is a File transport:`, t.filename);
    } else {
      console.log(`[A] Transport[${index}] is NOT a File transport`);
    }
  });
  const tempFile = logger.transports.find(
    t => t instanceof winston.transports.File && t.filename === 'logstemp.log'
  );

  if (!tempFile) {
    console.warn('[A] No temp file transport found.');
    return;
  }

  logger.remove(tempFile);

  const finalDir = path.join(LOG_PATH_PREFIX, jobId);
  const finalPath = path.join(finalDir, 'fca.log');

  try {
    fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(TEMP_LOG_PATH, finalPath);
    const newFileTransport = new winston.transports.File({ filename: finalPath, level: 'debug' });
    logger.add(newFileTransport);
    console.log(`[A] Promoted logs to ${finalPath}`);
  } catch (err) {
    console.warn(`[A] Failed to promote temp log file: ${err.message}`);
  }
};

module.exports = getLogger;

