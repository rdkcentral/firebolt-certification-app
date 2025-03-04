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

import { Button } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import FireboltExampleInvoker from './FireboltExampleInvoker';
import FireboltTransportInvoker from './FireboltTransportInvoker';
import ResultHandler from './ResultHandler';
import { CONSTANTS } from './constant';
import { censorData } from './utils/Utils';
import MethodFilters from './MethodFilters';
import externalInvokers from 'externalInvokers';

const logger = require('./utils/Logger')('Cards.js');

export default class Card extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      Background: {
        w: (w) => w,
        h: (h) => h,
      },
      Title: {
        x: 100,
        y: 50,
        w: (w) => w - 100,
        h: 100,
        text: {
          fontSize: 45,
        },
      },
      Summary: {
        x: 150,
        y: 200,
        w: 750,
        text: {
          fontSize: 35,
        },
      },
      ExampleText: {
        x: 100,
        y: 300,
        w: 750,
        text: {
          fontSize: 30,
        },
      },
      ResultTextBg: {
        x: 800,
        y: 0,
        h: 1080,
        w: 1920 - 900, // TODO
        rect: true,
        color: 0xbbffffff,
      },
      ResultText: {
        x: 825,
        y: 25,
        w: 1920 - 900, // TODO
        text: {
          fontSize: 30,
        },
        color: 0xff000000,
      },
      ExecuteButton: {
        x: 100,
        y: 700,
        type: Button,
        title: 'Invoke',
        backgroundType: 'stroke',
        onEnter: function () {
          this.fireAncestors('$invokeMethod');
        },
      },
    };
  }

  set params(params) {
    this._params = params;
    const method = params.method;
    this.tag('Title').text.text = method.name;
    this.tag('Summary').text.text = method.summary;
    this.tag('ExampleText').text.text = this._getMethodSignature();
    this.methodFilters = new MethodFilters();

    const exampleIndex = this._params.exampleIndex ? this._params.exampleIndex : 0;
    const exampleId = method.name + '.' + exampleIndex;
    const currentResult = ResultHandler.get().getCurrentResult(exampleId);
    if (currentResult) {
      this.tag('ResultText').patch({ color: 0xff000000 });
      this.tag('ResultText').text.text = JSON.stringify(currentResult, null, 2);
    }
  }

  get params() {
    return this._params;
  }

  _getMethodSignature() {
    const method = this._params.method;
    const exampleIndex = this._params.exampleIndex ? this._params.exampleIndex : 0;
    const methodCap = method.name.charAt(0).toUpperCase() + method.name.slice(1);
    const examples = this._params.method.examples;
    let paramsStr = '';
    if (examples && examples.length > 0) {
      for (let i = 0; i < examples[exampleIndex].params.length; i++) {
        const val = examples[exampleIndex].params[i].value;
        if (i !== 0) {
          paramsStr += ', ';
        }
        if (typeof val === 'object') {
          paramsStr += JSON.stringify(val, null, 2);
        } else {
          const isStr = typeof val === 'string';
          paramsStr += (isStr ? "'" : '') + val + (isStr ? "'" : '');
        }
      }
    }
    return methodCap + '(' + paramsStr + ')';
  }

  async $invokeMethod() {
    console.log('Inside $invokeMethod');
    const methodSignature = this._getMethodSignature();
    const exampleIndex = this._params.exampleIndex ? this._params.exampleIndex : 0;
    logger.info('call methodSignature ' + methodSignature, 'invokeMethod');
    console.log('call methodSignature ' + methodSignature);
    const method = this._params.method;
    const methodCap = method.name.charAt(0).toUpperCase() + method.name.slice(1);
    try {
      // get the names, in order, of each param, or an empty array
      const paramNames = method.params ? method.params.map((p) => p.name) : [];
      let paramValues = [];
      let example;
      if (method.examples && method.examples.length > exampleIndex) {
        example = method.examples[exampleIndex];
        // grab the value (or null) of each param in the original order
        paramValues = example.params.map((p) => p.value);
      }
      logger.info(`${methodCap}(${paramValues.join(', ')})`, 'invokeMethod');
      const showResult = (result) => {
        console.log('Inside showResult' + JSON.stringify(result));
        this.tag('ResultText').patch({ color: 0xff000000 });
        this.tag('ResultText').text.text = JSON.stringify(censorData(methodCap, result), null, 2);
      };
      const exampleId = method.name + '.' + exampleIndex;
      ResultHandler.get().registerView(exampleId, showResult);
      const handleResult = (r) => ResultHandler.get().handle(exampleId, r);
      /** Replace any stubbed out callback parameters with a callback that refreshes this view */
      for (let i = 0; i < paramValues.length; i++) {
        if (typeof paramValues[i] === 'function') {
          paramValues[i] = handleResult;
        }
      }
      let result;
      const externalInvokerKey = Object.keys(externalInvokers).find((key) => method.name.includes(key));
      if (!process.env.MOCKOS && process.env.MF_VALUE) {
        result = CONSTANTS.MOCKOS_UNAVAILABLE;
      } else if (externalInvokerKey) {
        const jsonObj = {};
        for (const param of example.params) {
          jsonObj[param.name] = param.value;
        }
        const invoker = new externalInvokers[externalInvokerKey]();
        const message = { params: { method: method.name, methodParams: jsonObj } };
        result = await invoker
          .invoke(message)
          .then((response) => {
            logger.info('invoker success response : ' + JSON.stringify(response.apiResponse.result));
            console.log('invoker success response : ' + JSON.stringify(response.apiResponse.result));
            return response.apiResponse.result;
          })
          .catch((err) => {
            return err;
          });
      } else {
        let paramValueForTransport = [];
        paramValueForTransport = example.params.map((p) => p.value);
        const paramNames = method.params ? method.params.map((p) => p.name) : [];
        if (this.methodFilters.isRpcMethod(method, CONSTANTS.CORE.toLowerCase())) {
          result = await FireboltTransportInvoker.get().invoke(method.name, paramValueForTransport, paramNames);
          console.log('result : ' + JSON.stringify(result));
        } else {
          result = await FireboltExampleInvoker.get().invoke(this._params.sdk, methodCap, paramValues, handleResult);
          console.log('result for exampleInvoker: ' + JSON.stringify(result));
        }
      }
      showResult(result);
    } catch (err) {
      this.tag('ResultText').patch({ color: 0xffeb4034 });
      this.tag('ResultText').text.text = err.message;
    }
  }

  _getFocused() {
    console.log('Inside ExecuteButton');
    return this.tag('ExecuteButton');
  }
}
