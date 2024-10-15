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

import Card from './Card';

import MethodFilters from './MethodFilters';
import ValidationView from './ValidationView';
import { CONSTANTS } from './constant';
import { overrideParamsFromTestData } from './utils/Utils';
import MediaView from './MediaView';
import LifeCycleHistoryView from './LifecycleHistoryView';
import LifecycleHistory from './LifeCycleHistory';
import Launchfca from './Launchfca';
import modules from 'externalViews';

require('dotenv').config();
let additionalRpcExamples = null;

// Attempt to load additional test cases
try {
  additionalRpcExamples = require('../plugins/AdditionalFireboltTestCases.json');
  console.log('Additional RPC examples loaded from plugin');
} catch (error) {
  console.log('Additional RPC examples plugin not found');
}

const IGNORE_MODULES = ['internal'];

const hasTag = (method, tag) => {
  return method.tags && method.tags.filter((t) => t.name === tag).length > 0;
};

export default class MenuBuilder {
  build() {
    this.methodFilters = new MethodFilters();

    this.menus = [];

    const menuItems = [
      {
        title: 'APIs',
        menus: this.buildMenusFromOpenRpc(),
      },
      {
        title: 'Lifecycle History',
        view: LifeCycleHistoryView,
        params: {
          history: LifecycleHistory.get().history,
        },
      },
      {
        title: 'Demos',
        menus: [
          {
            title: 'Media Lifecycle',
            view: MediaView,
            params: {},
          },
        ],
      },
      {
        title: 'Start',
        menus: this.constructFireboltCertificationMenu(),
      },
    ];

    // add additional menu item if systemui is true in url
    if (process.env.SYSTEMUI == 'true') {
      menuItems.push({
        title: 'Launch FCA',
        view: Launchfca,
        params: {
          appId: CONSTANTS.APPID_FIRECERT,
        },
      });
      menuItems.push({
        title: 'Launch Ref App',
        view: Launchfca,
        params: {
          appId: CONSTANTS.APPID_FIREBOLT,
        },
      });
    }

    if (Object.keys(modules).length != 0) {
      // Loop through all keys (Module names) in the modules object
      for (const viewName in modules) {
        const module = modules[viewName];
        const title = module.name ? module.name : viewName;
        const externalLauncher = {
          title: title,
          view: module.default,
          params: module.params || {},
        };
        if (process.env.SYSTEMUI != 'true') {
          menuItems.push(externalLauncher);
        }
      }
    }
    return menuItems;
  }

  // creates sub menu objects uing below template
  createSubMenuObject(menuTitle, menuView, menuNavigation, menuCommunicationMode) {
    const title = menuTitle;
    const view = menuView;
    const navigation = menuNavigation;
    const communicationMode = menuCommunicationMode;
    const menuObject = {
      title,
      view,
      params: {
        navigation,
        communicationMode,
      },
    };
    return menuObject;
  }

  // creates main menu objects using below template
  createMenuObject(menuTitle, subMenusArray) {
    const title = menuTitle;
    const menus = subMenusArray;
    const menuObject = {
      title,
      menus,
    };
    return menuObject;
  }

  // dynamically construct menu items for different communication modes using defaultSDKs config and 'ALL-SDKs'
  constructMenuBasedOnMode(mode) {
    const menuArray = [];
    let menuObject;

    CONSTANTS.defaultSDKs.forEach(
      function (sdkObject) {
        const sdkObjectCopy = { ...sdkObject };
        // currently defaultSDKs config contain only 'Core' and 'Manage'. The names will be suffixed with 'Sdk' for UI
        menuObject = this.createSubMenuObject(sdkObjectCopy.name + ' Sdk', ValidationView, sdkObjectCopy.name + ' Sdk', mode);
        menuArray.push(menuObject);
      }.bind(this)
    );

    const allSdkMenuTitle = CONSTANTS.ALL_SDKS.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    menuObject = this.createSubMenuObject(allSdkMenuTitle, ValidationView, allSdkMenuTitle, mode);
    menuArray.push(menuObject);
    return menuArray;
  }

  // dynamically construct the final firebolt certification menu displayed on hitting 'START' button in UI

  constructFireboltCertificationMenu() {
    const certificationMenu = [];

    const sdkMenuArray = this.constructMenuBasedOnMode(CONSTANTS.SDK);
    const sdkMenuObject = this.createMenuObject(CONSTANTS.SDK, sdkMenuArray);
    certificationMenu.push(sdkMenuObject);

    const transportMenuArray = this.constructMenuBasedOnMode(CONSTANTS.TRANSPORT);
    CONSTANTS.additionalSDKs.forEach(
      function (sdkObject) {
        const sdkObjectCopy = { ...sdkObject };
        // dynamically construct menu items using additionalSDKs config
        const menuObject = this.createSubMenuObject(sdkObjectCopy.name, ValidationView, sdkObjectCopy.name, CONSTANTS.TRANSPORT);
        transportMenuArray.push(menuObject);
      }.bind(this)
    );
    const transportMenuObject = this.createMenuObject(CONSTANTS.TRANSPORT, transportMenuArray);
    certificationMenu.push(transportMenuObject);
    return [...certificationMenu];
  }

  addPolymorphicPullExamples(methodObj) {
    const examples = methodObj.examples;
    if (hasTag(methodObj, 'polymorphic-pull')) {
      examples.push({
        name: CONSTANTS.SUBSCRIBE + ' ' + methodObj.name,
        params: [
          {
            name: 'callback',
            value: () => {},
          },
        ],
        result: {
          name: 'listenerId',
          value: '123',
        },
      });
    }
  }

  addPropertyExamples(methodObj, OPEN_RPC) {
    const examples = methodObj.examples;
    if ((hasTag(methodObj, 'property') || hasTag(methodObj, 'property:readonly')) && !hasTag(methodObj, 'property:immutable')) {
      examples.push({
        name: CONSTANTS.SUBSCRIBE + ' ' + methodObj.name,
        schema: {
          type: 'number',
        },
        params: [
          {
            name: 'callback',
            value: () => {},
          },
        ],
        result: {
          name: 'listenerId',
          value: '123',
        },
      });
    }
  }

  buildMenusFromOpenRpc() {
    const buildMenus = [];
    const mergedSDKs = CONSTANTS.defaultSDKs.concat(CONSTANTS.additionalSDKs);
    mergedSDKs.forEach(
      function (sdkObject) {
        const sdkObjectCopy = { ...sdkObject };
        sdkObjectCopy.name = sdkObjectCopy.name + ' SDK';
        const OPEN_RPC = sdkObjectCopy.openRpc;
        // get menu items of individual menuLists in API
        const menus = [];
        const sdk = sdkObjectCopy.name.split(' ').length > 1 ? sdkObjectCopy.name.split(' ')[0].toLowerCase() : sdkObjectCopy.name.toLowerCase();
        if (menus.length === 0) {
          // Add additional RPC examples to main OpenRPC if found
          if (additionalRpcExamples) {
            additionalRpcExamples.methods.forEach((method) => {
              const found = OPEN_RPC.methods.find((m) => m.name.toLowerCase() === method.name.toLowerCase());
              if (found) {
                found.examples.push(...method.examples);
              }
            });
          }

          for (let i = 0; i < OPEN_RPC.methods.length; i++) {
            const module = OPEN_RPC.methods[i].name.split('.')[0];
            const method = OPEN_RPC.methods[i].name.split('.')[1];
            const methodObj = OPEN_RPC.methods[i];

            if (methodObj) {
              overrideParamsFromTestData(methodObj);
            }
            if (IGNORE_MODULES.indexOf(module) === -1) {
              const moduleCap = module.charAt(0).toUpperCase() + module.slice(1);
              const find = menus.filter((m) => m.title === moduleCap);
              let moduleMenuItem = find.length === 0 ? null : find[0];
              if (moduleMenuItem == null) {
                moduleMenuItem = {
                  title: moduleCap,
                  menus: [],
                };
                menus.push(moduleMenuItem);
              }
              if (OPEN_RPC.methods[i].examples && OPEN_RPC.methods[i].examples.length) {
                this.addPropertyExamples(methodObj, OPEN_RPC);
                this.addPolymorphicPullExamples(methodObj);
                if (OPEN_RPC.methods[i].examples.length > 1) {
                  const methodMenuItem = {
                    title: method,
                    menus: [],
                  };
                  moduleMenuItem.menus.push(methodMenuItem);
                  for (let exIdx = 0; exIdx < OPEN_RPC.methods[i].examples.length; exIdx++) {
                    const name = ' - ' + OPEN_RPC.methods[i].examples[exIdx].name;
                    methodMenuItem.menus.push({
                      title: method + name,
                      view: Card,
                      params: {
                        sdk: sdk,
                        method: OPEN_RPC.methods[i],
                        exampleIndex: exIdx,
                      },
                    });
                  }
                } else {
                  moduleMenuItem.menus.push({
                    title: method,
                    view: Card,
                    params: {
                      sdk: sdk,
                      method: OPEN_RPC.methods[i],
                      exampleIndex: 0,
                    },
                  });
                }
              } else {
                moduleMenuItem.menus.push({
                  title: method,
                  view: Card,
                  params: {
                    sdk: sdk,
                    method: OPEN_RPC.methods[i],
                  },
                });
              }
            }
          }
        }
        buildMenus.push({ title: sdkObjectCopy.name, menus: menus });
      }.bind(this)
    );
    return buildMenus;
  }
}
