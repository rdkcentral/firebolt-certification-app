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

import ResultHandler from '../../src/ResultHandler';

describe('ResultHandler', () => {
  let resultHandler;

  beforeEach(() => {
    resultHandler = new ResultHandler();
  });

  afterEach(() => {
    // Reset the instance variable to null after each test
    resultHandler.constructor.get().constructor._instance = null;
  });

  test('should return the same instance when calling get()', () => {
    const instance1 = ResultHandler.get();
    const instance2 = ResultHandler.get();
    expect(instance1).toBe(instance2);
  });

  test('should handle and store the result', () => {
    const exampleId = 'example-1';
    const result = { data: 'example result' };
    resultHandler.handle(exampleId, result);
    expect(resultHandler.getCurrentResult(exampleId)).toBe(result);
  });

  test('should register and call the view callback', () => {
    const exampleId = 'example-1';
    const callback = jest.fn();
    resultHandler.registerView(exampleId, callback);
    const result = { data: 'example result' };
    resultHandler.handle(exampleId, result);
    expect(callback).toHaveBeenCalledWith(result);
  });

  test('should return undefined for non-existent result', () => {
    const exampleId = 'non-existent-example';
    expect(resultHandler.getCurrentResult(exampleId)).toBeUndefined();
  });
});
