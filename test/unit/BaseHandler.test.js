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

import BaseHandler from '../../src/pubsub/handlers/BaseHandler';

let baseHAndler;
let result;

describe('BaseHandler Test Case', () => {
  beforeEach(() => {
    baseHAndler = new BaseHandler();
  });

  test('validate getHandler', () => {
    result = baseHAndler.getHandlerName();
    expect(result).toBeUndefined();
  });
  test('validate getHandler', async () => {
    try {
      await baseHAndler.handle();
    } catch (e) {
      expect(e.message).toBe(`The 'handle' function should be implemented by subclasses.`);
    }
  });
});
