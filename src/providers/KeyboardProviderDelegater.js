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

import KeyboardUIProvider from './KeyboardUIProvider';

export default class KeyboardProviderDelegater {
  constructor(app) {
    this._app = app;
    this.delegate = new KeyboardUIProvider(app);
    process.env.KeyboardProviderDelegater = this;
  }

  setDelegate(_delegate) {
    this.delegate = _delegate;
  }

  standard(keyboardSession, providerSession) {
    return this.delegate.standard(keyboardSession, providerSession);
  }

  email(keyboardSession, providerSession) {
    return this.delegate.email(keyboardSession, providerSession);
  }

  password(keyboardSession, providerSession) {
    return this.delegate.password(keyboardSession, providerSession);
  }
}
