/*! version 1.7.0 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./plugins/startupScripts/activateMockFirebolt.js":
/*!********************************************************!*\
  !*** ./plugins/startupScripts/activateMockFirebolt.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Activate Mock Firebolt if "mf" query parameter is specified

var queryParams = new window.URLSearchParams(document.location.search);
console.log('Welcome to MOCK!');
var mf = queryParams.get('mf');
if (mf) {
  mf = decodeURIComponent(mf);
  var endpoint = undefined;
  if (['T', 'TRUE', 'YES', 'Y', '1', 'ON', 'MF', 'MOCK'].includes(mf.toUpperCase())) {
    endpoint = "ws://localhost:9998";
  } else {
    // Regular expression to check if number is a valid port number
    var regexExp = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
    var match = mf.match(regexExp);
    if (match && match.length >= 1) {
      endpoint = "ws://localhost:".concat(match[0]);
    } else if (mf.startsWith('ws')) {
      endpoint = mf;
    }
  }
  if (endpoint) {
    if (!window.__firebolt) {
      window.__firebolt = {};
    }
    window.__firebolt.endpoint = endpoint;
    console.info("Using Mock Firebolt listening at ".concat(endpoint));
  }
}

/***/ }),

/***/ "./plugins/startupScripts/index.js":
/*!*****************************************!*\
  !*** ./plugins/startupScripts/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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

console.log('Welcome to FCA!');

/***/ }),

/***/ 0:
/*!************************************************************************************************!*\
  !*** multi ./plugins/startupScripts/activateMockFirebolt.js ./plugins/startupScripts/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./plugins/startupScripts/activateMockFirebolt.js */"./plugins/startupScripts/activateMockFirebolt.js");
module.exports = __webpack_require__(/*! ./plugins/startupScripts/index.js */"./plugins/startupScripts/index.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcGx1Z2lucy9zdGFydHVwU2NyaXB0cy9hY3RpdmF0ZU1vY2tGaXJlYm9sdC5qcyIsIndlYnBhY2s6Ly8vLi9wbHVnaW5zL3N0YXJ0dXBTY3JpcHRzL2luZGV4LmpzIl0sIm5hbWVzIjpbInF1ZXJ5UGFyYW1zIiwid2luZG93IiwiVVJMU2VhcmNoUGFyYW1zIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsInNlYXJjaCIsImNvbnNvbGUiLCJsb2ciLCJtZiIsImdldCIsImRlY29kZVVSSUNvbXBvbmVudCIsImVuZHBvaW50IiwidW5kZWZpbmVkIiwiaW5jbHVkZXMiLCJ0b1VwcGVyQ2FzZSIsInJlZ2V4RXhwIiwibWF0Y2giLCJsZW5ndGgiLCJjb25jYXQiLCJzdGFydHNXaXRoIiwiX19maXJlYm9sdCIsImluZm8iXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7O0FBRUEsSUFBTUEsV0FBVyxHQUFHLElBQUlDLE1BQU0sQ0FBQ0MsZUFBZSxDQUFDQyxRQUFRLENBQUNDLFFBQVEsQ0FBQ0MsTUFBTSxDQUFDO0FBQ3hFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUMvQixJQUFJQyxFQUFFLEdBQUdSLFdBQVcsQ0FBQ1MsR0FBRyxDQUFDLElBQUksQ0FBQztBQUM5QixJQUFJRCxFQUFFLEVBQUU7RUFDTkEsRUFBRSxHQUFHRSxrQkFBa0IsQ0FBQ0YsRUFBRSxDQUFDO0VBQzNCLElBQUlHLFFBQVEsR0FBR0MsU0FBUztFQUN4QixJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDQyxRQUFRLENBQUNMLEVBQUUsQ0FBQ00sV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2pGSCxRQUFRLHdCQUF3QjtFQUNsQyxDQUFDLE1BQU07SUFDTDtJQUNBLElBQU1JLFFBQVEsR0FBRyxnSEFBZ0g7SUFDakksSUFBTUMsS0FBSyxHQUFHUixFQUFFLENBQUNRLEtBQUssQ0FBQ0QsUUFBUSxDQUFDO0lBQ2hDLElBQUlDLEtBQUssSUFBSUEsS0FBSyxDQUFDQyxNQUFNLElBQUksQ0FBQyxFQUFFO01BQzlCTixRQUFRLHFCQUFBTyxNQUFBLENBQXFCRixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUU7SUFDekMsQ0FBQyxNQUFNLElBQUlSLEVBQUUsQ0FBQ1csVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzlCUixRQUFRLEdBQUdILEVBQUU7SUFDZjtFQUNGO0VBQ0EsSUFBSUcsUUFBUSxFQUFFO0lBQ1osSUFBSSxDQUFDVixNQUFNLENBQUNtQixVQUFVLEVBQUU7TUFDdEJuQixNQUFNLENBQUNtQixVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCO0lBQ0FuQixNQUFNLENBQUNtQixVQUFVLENBQUNULFFBQVEsR0FBR0EsUUFBUTtJQUNyQ0wsT0FBTyxDQUFDZSxJQUFJLHFDQUFBSCxNQUFBLENBQXFDUCxRQUFRLENBQUUsQ0FBQztFQUM5RDtBQUNGLEM7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFMLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEMiLCJmaWxlIjoic3RhcnR1cFNjcmlwdHMuYnVuZGxlLmQyZmE2NTBjY2Q5Y2Y4M2ZmYjJiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiLy8gQWN0aXZhdGUgTW9jayBGaXJlYm9sdCBpZiBcIm1mXCIgcXVlcnkgcGFyYW1ldGVyIGlzIHNwZWNpZmllZFxuXG5jb25zdCBxdWVyeVBhcmFtcyA9IG5ldyB3aW5kb3cuVVJMU2VhcmNoUGFyYW1zKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaCk7XG5jb25zb2xlLmxvZygnV2VsY29tZSB0byBNT0NLIScpO1xubGV0IG1mID0gcXVlcnlQYXJhbXMuZ2V0KCdtZicpO1xuaWYgKG1mKSB7XG4gIG1mID0gZGVjb2RlVVJJQ29tcG9uZW50KG1mKTtcbiAgbGV0IGVuZHBvaW50ID0gdW5kZWZpbmVkO1xuICBpZiAoWydUJywgJ1RSVUUnLCAnWUVTJywgJ1knLCAnMScsICdPTicsICdNRicsICdNT0NLJ10uaW5jbHVkZXMobWYudG9VcHBlckNhc2UoKSkpIHtcbiAgICBlbmRwb2ludCA9IGB3czovL2xvY2FsaG9zdDo5OTk4YDtcbiAgfSBlbHNlIHtcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gdG8gY2hlY2sgaWYgbnVtYmVyIGlzIGEgdmFsaWQgcG9ydCBudW1iZXJcbiAgICBjb25zdCByZWdleEV4cCA9IC9eKCg2NTUzWzAtNV0pfCg2NTVbMC0yXVswLTldKXwoNjVbMC00XVswLTldezJ9KXwoNlswLTRdWzAtOV17M30pfChbMS01XVswLTldezR9KXwoWzAtNV17MCw1fSl8KFswLTldezEsNH0pKSQvZ2k7XG4gICAgY29uc3QgbWF0Y2ggPSBtZi5tYXRjaChyZWdleEV4cCk7XG4gICAgaWYgKG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+PSAxKSB7XG4gICAgICBlbmRwb2ludCA9IGB3czovL2xvY2FsaG9zdDoke21hdGNoWzBdfWA7XG4gICAgfSBlbHNlIGlmIChtZi5zdGFydHNXaXRoKCd3cycpKSB7XG4gICAgICBlbmRwb2ludCA9IG1mO1xuICAgIH1cbiAgfVxuICBpZiAoZW5kcG9pbnQpIHtcbiAgICBpZiAoIXdpbmRvdy5fX2ZpcmVib2x0KSB7XG4gICAgICB3aW5kb3cuX19maXJlYm9sdCA9IHt9O1xuICAgIH1cbiAgICB3aW5kb3cuX19maXJlYm9sdC5lbmRwb2ludCA9IGVuZHBvaW50O1xuICAgIGNvbnNvbGUuaW5mbyhgVXNpbmcgTW9jayBGaXJlYm9sdCBsaXN0ZW5pbmcgYXQgJHtlbmRwb2ludH1gKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAyMyBDb21jYXN0IENhYmxlIENvbW11bmljYXRpb25zIE1hbmFnZW1lbnQsIExMQ1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuY29uc29sZS5sb2coJ1dlbGNvbWUgdG8gRkNBIScpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==