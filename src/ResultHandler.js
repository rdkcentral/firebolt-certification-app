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

let instance = null;

export default class ResultHandler {
  constructor() {
    this._results = {};
    this._views = {};
  }

  /**
   * @returns {ResultHandler}
   */
  static get() {
    if (instance == null) {
      instance = new ResultHandler();
    }
    return instance;
  }

  handle(exampleId, result) {
    this._results[exampleId] = result;
    const view = this._views[exampleId];
    if (view) {
      view(result);
    }
  }

  registerView(exampleId, callback) {
    this._views[exampleId] = callback;
  }

  getCurrentResult(exampleId) {
    return this._results[exampleId];
  }
}
