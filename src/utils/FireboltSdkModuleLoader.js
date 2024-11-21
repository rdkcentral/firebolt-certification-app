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

const coreRpcContext = require.context('@firebolt-js/sdk/dist', true, /firebolt-core-open-rpc\.json$/);
const manageRpcContext = require.context('@firebolt-js/manage-sdk/dist', true, /firebolt-manage-open-rpc\.json$/);
const discoveryRpcContext = require.context('@firebolt-js/discovery-sdk/dist', true, /firebolt-discovery-open-rpc\.json$/);

class FireboltSdkModuleLoader {
  constructor(coreSdk, manageSdk, discoverySdk) {
    this.sdkPaths = this._getSdkPaths();
    this.sdkModuleImports = { core: coreSdk, manage: manageSdk, discovery: discoverySdk };
    this.sdkJson = {};
    this.sdkModules = {};
    this.sdkModulesMap = { core: {}, manage: {}, discovery: {} };
  }

  /**
   * Dynamically gets SDK paths based on the installed dependencies in package.json.
   * @returns {Object} An object containing paths to OpenRPC JSON files for each SDK.
   */
  _getSdkPaths() {
    const dependencies = DEPENDENCIES; // Injected by Webpack DefinePlugin
    const sdkPaths = {};

    for (const [dependency] of Object.entries(dependencies)) {
      if (dependency.startsWith('@firebolt-js/')) {
        const sdkType = dependency.split('/')[1].replace('-sdk', '');
        const sdkKey = sdkType === 'sdk' ? 'core' : sdkType;
        sdkPaths[sdkKey] = {
          openRpcPath: `${dependency}/dist/firebolt-${sdkKey}-open-rpc.json`,
          sdkPath: dependency,
        };
      }
    }

    return sdkPaths;
  }

  /**
   * Dynamically imports SDK modules based on package names and SDK types.
   */
  async _importSdkJson() {
    for (const [sdkType, sdkPath] of Object.entries(this.sdkPaths)) {
      try {
        let sdkModule;
        if (sdkType === 'core') {
          sdkModule = coreRpcContext(`./${sdkPath.openRpcPath.split('/').pop()}`);
        } else if (sdkType === 'manage') {
          sdkModule = manageRpcContext(`./${sdkPath.openRpcPath.split('/').pop()}`);
        } else if (sdkType === 'discovery') {
          sdkModule = discoveryRpcContext(`./${sdkPath.openRpcPath.split('/').pop()}`);
        }
        this.sdkJson[sdkType] = sdkModule;
      } catch (err) {
        console.warn(`Failed to import module for SDK type '${sdkType}': ${err.message}`);
      }
    }
  }

  /**
   * Gets the keys of the x-module-descriptions object from the JSON file.
   * @param {string} sdkType - The type of SDK ('core', 'manage', 'discovery').
   * @returns {Array} An array of keys from the x-module-descriptions object.
   */
  _getModulesFromJson(sdkType) {
    // handle discovery here with if/else
    const moduleNames = this.sdkJson[sdkType]['info']['x-module-descriptions'];
    this.sdkModules[sdkType] = Object.keys(moduleNames);
  }

  /**
   * Generates the module map dynamically based on OpenRPC JSON files.
   * @returns {Object} The module map for all SDKs.
   */
  async generateModuleMap() {
    await this._importSdkJson();

    for (const [sdkType] of Object.entries(this.sdkPaths)) {
      this._getModulesFromJson(sdkType);
      for (const module of this.sdkModules[sdkType]) {
        const lowerCaseModule = module.toLowerCase();
        this.sdkModulesMap[sdkType][lowerCaseModule] = this.sdkModuleImports[sdkType][module];
      }
    }

    console.log(this.sdkModulesMap);
    return this.sdkModulesMap;
  }
}

export default FireboltSdkModuleLoader;
