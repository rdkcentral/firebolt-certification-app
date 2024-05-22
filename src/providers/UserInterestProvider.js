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
import { testDataHandler } from '../utils/Utils';
import USERINTERESTDATA from '../../plugins/userInterest.json';

export default class UserIntrestProvider {
  userInterest() {
    if (USERINTERESTDATA.hasOwnProperty(process.env.userInterestKey)) {
      const data = USERINTERESTDATA[process.env.userInterestKey];
      return Promise.resolve(data);
    } else {
      return Promise.resolve(null);
    }
  }
}
