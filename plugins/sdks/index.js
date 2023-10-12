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

const files = require.context('.', false, /\.js$/);
const modules = {};

/*
  Loop through all the imported files.
  Remove './' and '.js' from the key and use it as the property name in the 'modules' object.
  Then, assign the default export of the file to that property.
*/
files.keys().forEach((key) => {
  if (key === './index.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});

console.log('Loading external invokers');

export default modules;
