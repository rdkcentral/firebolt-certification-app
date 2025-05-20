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

// ************* Description *************
//   * API validation UI
//   * Fetch the results & display results in UI view
// Script version : 0.1
// Date : 16 dec 2021
// ************* End Description **********

import { Button, Column } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import { Test_Runner } from 'Test_Runner';
import Menu from './Menu';
import { CONSTANTS } from './constant';

export default class ValidationView extends lng.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: (w) => w,
      h: (h) => h,
      History: {
        w: (w) => w,
        h: (h) => h,
        type: Column,
      },
      ConsoleView: {
        x: 520,
        y: 0,
        h: 990,
        w: 1920 - 600,
        rect: true,
        z: 1000,
      },
      Notification: {
        visible: false,
        rect: true,
        color: 0xff000000, // Black color
        opacity: 0.8, // Opacity value (0.0 to 1.0)
        w: 500,
        h: 200,
        x: 1330,
        y: 775,
        Error: {
          x: 20,
          y: 15,
          text: {
            text: CONSTANTS.PLATFORM_ERROR_MESSAGE,
            fontSize: 26,
            textColor: 0xffff0000, // Red color
            wordWrap: false,
            wordWrapWidth: 280,
            textAlign: 'left',
          },
        },
        Platform: {
          x: 20,
          y: 60,
          text: {
            text: process.env.PLATFORM,
            fontSize: 18,
            textColor: 0xffffffff, // white color
            wordWrap: false,
            wordWrapWidth: 280,
            textAlign: 'left',
          },
        },
        Target: {
          x: 15,
          y: 110,
          text: {
            text: CONSTANTS.PLATFORM_TARGET,
            fontSize: 18,
            textColor: 0xffffffff, // white color
            wordWrap: false,
            wordWrapWidth: 280,
            textAlign: 'left',
          },
        },
      },
      UpdateText: {
        x: 825,
        y: 25,
        w: 1920 - 700,
        text: {
          fontSize: 30,
        },
        color: 0xffff000f,
      },
      ApititleText: {
        x: 530,
        y: 100,
        w: 1920 - 700,
        text: {
          fontSize: 27,
        },
        color: 0xff123456,
      },
      SchemaValidationStateText: {
        x: 530,
        y: 150,
        w: 1920 - 700,
        text: {
          fontSize: 27,
        },
        color: 0xff123456,
      },
      Message: {
        x: 530,
        y: 200,
        w: 1920 - 700,
        text: {
          fontSize: 27,
        },
        color: 0xff123456,
      },
      ValidationData: {
        rect: true,
        x: 530,
        y: 250,
        w: 1920 - 900,
        text: {
          fontSize: 27,
        },
        color: 0xff123456,
      },
      ExecuteButton: {
        type: Button,
        title: 'Invoke',
        backgroundType: 'stroke',
        onEnter: function () {
          this.fireAncestors('$RunMethod');
        },
      },
    };
  }
  _init() {
    this._setState('ExecuteButton');
    this.tag('UpdateText').text = CONSTANTS.INVOKE_TEST_MESSAGE;
  }
  set params(params) {
    this._params = params;
  }

  // async method is triggered from UI based on user actions
  async $RunMethod() {
    if (CONSTANTS.PLATFORM_LIST.includes(process.env.PLATFORM)) {
      let validatedMenu = null;
      this.tag('UpdateText').text = CONSTANTS.VALIDATION_MESSAGE;
      const sdkinvokerinfo = new Test_Runner();
      const sdkMode = this._params.navigation.toUpperCase();
      const navigation = CONSTANTS.APP_NAVIGATION_UI;
      process.env.COMMUNICATION_MODE = this._params.communicationMode;

      if (sdkMode === CONSTANTS.ALL_SDKS) {
        const sdks = CONSTANTS.defaultSDKs.map((sdkObject) => sdkObject.name.toUpperCase());
        if (process.env.MF_VALUE && !process.env.MOCKOS) {
          this.tag('UpdateText').text = CONSTANTS.MOCKOS_UNAVAILABLE;
        } else {
          validatedMenu = await sdkinvokerinfo.northBoundSchemaValidationAndReportGeneration(sdks, null, this);
        }
      } else {
        // Combine defaultSDKs and additionalSDKs into one array
        const allSDKs = [...CONSTANTS.defaultSDKs, ...CONSTANTS.additionalSDKs];
        // Find the SDK configuration for the specified sdk mode
        const sdkConfigs = allSDKs.filter((sdk) => sdkMode.toUpperCase().includes(sdk.name.toUpperCase()));
        const exactMatch = sdkConfigs.find((sdk) => sdkMode.toUpperCase() === sdk.name.toUpperCase());
        const sdkConfig = exactMatch || (sdkConfigs.length === 1 && sdkConfigs[0]) || sdkConfigs;
        // If SDK config found and validation method exists
        if (sdkConfig && sdkConfig.validation) {
          if (!sdkConfig.validation()) {
            // Validation failed
            this.tag('UpdateText').text = sdkConfig.unavailableMessage;
          } else {
            // Validation passed, invoke method
            validatedMenu = await sdkinvokerinfo.northBoundSchemaValidationAndReportGeneration(sdkConfig.name.toUpperCase(), null, this);
          }
        }
      }

      if (validatedMenu != null) {
        this.patchmenu(validatedMenu);
        this.tag('UpdateText').text = CONSTANTS.VALIDATION_SCROLLMESSAGE;
        this.tag('ApititleText').text = '';
        this.tag('SchemaValidationStateText').text = '';
        this.tag('Message').text = '';
        this.tag('ValidationData').text = '';
      }
    } else {
      this.tag('Notification').visible = true;
    }
  }

  // Invoking UI and displaying it as menu items
  // Mapping the Menus that needs to defined on the screen
  patchmenu(validatedMenu) {
    this.patch({
      Menu: {
        x: 5,
        y: 100,
        clipping: true,
        w: 500,
        h: 800,
        type: Menu,
        subMenuWidth: 500,
        menus: validatedMenu,
      },
    });
  }

  // After validation passing result as params to display
  // Console UI view to display the result obtained after validation.

  fetchResult(_displayparms) {
    const { err, fail, code } = _displayparms;
    this.tag('ValidationData').color = 0xff123456;
    let schemaValidationStateText = null,
      message = null,
      validationData = null;
    if (code != undefined) {
      let codeObject = null,
        isCodeTypeObject = true,
        messageString = null;

      try {
        codeObject = JSON.parse(_displayparms.code);

        let response = codeObject.Response;
        if (response === undefined && codeObject['Schema Validation'] && codeObject['Schema Validation'].Response && codeObject['Schema Validation'].Response.result) {
          response = codeObject['Schema Validation'].Response.result;
        }
        messageString = typeof response === 'string' ? response : JSON.stringify(response, null, 1);

        isCodeTypeObject = true;
      } catch (err) {
        isCodeTypeObject = false;
      }
      if (isCodeTypeObject) {
        const schemaValidation = codeObject['Schema Validation'];
        schemaValidationStateText = CONSTANTS.SCHEMA_VALIDATION_STATUSMESSAGE + (schemaValidation && schemaValidation.Status ? schemaValidation.Status : 'null');
        message = 'Message: ' + codeObject.Message;
        validationData = CONSTANTS.API_RESPONSE + messageString;
      } else {
        schemaValidationStateText = CONSTANTS.SCHEMA_VALIDATION_STATUSMESSAGE + CONSTANTS.SCHEMA_CONTENT_SKIPPED;
        validationData = CONSTANTS.API_RESPONSE + 'JSON parse failed (ValidationView)';
      }
    } else {
      // Remove if not needed after testing
      schemaValidationStateText = CONSTANTS.SCHEMA_VALIDATION_STATUSMESSAGE + CONSTANTS.SCHEMA_CONTENT_SKIPPED;
      validationData = CONSTANTS.API_RESPONSE + 'Received response as undefined';
    }
    // Updating values in UI
    this.tag('ApititleText').text = CONSTANTS.API_TITLE + _displayparms.fullTitle;
    this.tag('SchemaValidationStateText').text = schemaValidationStateText;
    this.tag('Message').text = message;

    /* 
        Schema data for some APIs are large enough to break the render engine.
        This would result in a non-responsive black box being displayed in the view container.
        To prevent issues with rendering, the length of data is checked before assigning to UI element.
        If the data length is beyond a preset value, a warning is displayed instead of the lengthy data.
        */
    if (validationData.length > 500) {
      validationData = CONSTANTS.LENGTHY_DATA_WARNING;
      this.tag('ValidationData').color = 0xffbf6508;
    }
    this.tag('ValidationData').text = validationData;
  }

  // Handling keyboard inputs for shifting focus
  _handleUp() {
    this._setState('ExecuteButton');
  }

  _handleDown() {
    this._setState('Menu');
  }

  $result_fetch(_displayparms) {
    this.fetchResult(_displayparms);
  }

  // Mapping the obtained menu list to the menu building login

  static _states() {
    return [
      class ExecuteButton extends this {
        _getFocused() {
          return this.tag('ExecuteButton');
        }
      },
      class Menu extends this {
        _handleDown() {}
        _getFocused() {
          try {
            const _displayparms = this.tag('Menu.Wrapper.Menu').selected.validatedMenu;
            this.fetchResult(_displayparms);
          } catch (error) {
            this._setState('ExecuteButton');
          }
          return this.tag('Menu');
        }
      },
    ];
  }
}
