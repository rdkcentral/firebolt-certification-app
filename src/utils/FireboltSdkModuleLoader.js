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

/**
 * Extracts unique module names from a list of method definitions.
 * Splits method names at the '.' character, assuming the format 'Module.methodName'.
 *
 * @param {Array<Object>} methods - An array of method objects, each containing a `name` property.
 * @returns {Array<string>} An array of unique module names.
 *
 * @example
 * const methods = [
 *   { name: 'Content.requestUserInterest' },
 *   { name: 'Discovery.someOtherMethod' },
 *   { name: 'Content.onUserInterest' }
 * ];
 * const uniqueModules = extractUniqueModules(methods);
 * // Output: ['Content', 'Discovery']
 */
const extractUniqueModules = (methods) => {
  const modulesSet = new Set();

  methods.forEach((method) => {
    const moduleName = method.name.split('.')[0];
    modulesSet.add(moduleName);
  });

  console.log(Array.from(modulesSet));
  const obj = {
    Content: 'ksjanllkdwj',
  };
  return obj;
};

/**
 * FireboltSdkModuleLoader
 * Dynamically loads and maps Firebolt SDK modules based on the installed dependencies.
 */
class FireboltSdkModuleLoader {
  /**
   * Initializes the loader with core, manage, and discovery SDKs.
   * @param {Object} coreSdk - Core SDK object imported from '@firebolt-js/sdk'.
   * @param {Object} manageSdk - Manage SDK object imported from '@firebolt-js/manage-sdk'.
   * @param {Object|null} discoverySdk - Discovery SDK object imported from '@firebolt-js/discovery-sdk', or null if not available.
   */
  constructor(coreSdk, manageSdk, discoverySdk) {
    this.sdkPaths = this._getSdkPaths();
    this.sdkModuleImports = { core: coreSdk, manage: manageSdk, discovery: discoverySdk };
    this.sdkJson = {};
    this.sdkModules = {};
    this.sdkModulesMap = { core: {}, manage: {}, discovery: {} };
  }

  /**
   * Retrieves SDK paths based on installed dependencies.
   * This method checks for Firebolt SDKs in `DEPENDENCIES` and constructs their paths.
   * @returns {Object} An object containing paths to OpenRPC JSON files for each SDK.
   */
  _getSdkPaths() {
    const dependencies = DEPENDENCIES; // Injected by Webpack DefinePlugin
    const sdkPaths = {};

    for (const [dependency] of Object.entries(dependencies)) {
      if (dependency.startsWith('@firebolt-js/')) {
        const sdkType = dependency.split('/')[1].replace('-sdk', '');
        const sdkKey = sdkType === 'sdk' ? 'core' : sdkType;
        sdkPaths[sdkKey] = `${dependency}/dist/firebolt-${sdkKey}-open-rpc.json`;
      }
    }

    return sdkPaths;
  }

  /**
   * Dynamically imports SDK modules based on package names and SDK types.
   */
  _importSdkJson() {
    for (const [sdkType, sdkPath] of Object.entries(this.sdkPaths)) {
      try {
        let sdkModule;
        if (sdkType === 'core') {
          sdkModule = coreRpcContext(`./${sdkPath.split('/').pop()}`);
        } else if (sdkType === 'manage') {
          sdkModule = manageRpcContext(`./${sdkPath.split('/').pop()}`);
        } else if (sdkType === 'discovery') {
          sdkModule = discoveryRpcContext(`./${sdkPath.split('/').pop()}`);
        }
        this.sdkJson[sdkType] = sdkModule;
      } catch (err) {
        console.warn(`Failed to import module for SDK type '${sdkType}': ${err.message}`);
      }
    }
  }

  /**
   * Extracts module names from the OpenRPC JSON files for a given SDK type.
   * @param {string} sdkType - The type of SDK ('core', 'manage', 'discovery').
   */
  _getModulesFromJson(sdkType) {
    if (sdkType === 'discovery') {
      // const moduleNames = extractUniqueModules(this.sdkJson[sdkType]['methods']);
      // console.log(moduleNames);
      // console.log(typeof moduleNames);
      // this.sdkModules['discovery'] = Object.keys(moduleNames);
      // console.log(this.sdkModules['discovery']);
      this.sdkModules[sdkType] = [];
    } else {
      const moduleNames = this.sdkJson[sdkType]['info']['x-module-descriptions'];
      console.log(Object.keys(moduleNames));
      console.log(typeof Object.keys(moduleNames));
      this.sdkModules[sdkType] = Object.keys(moduleNames);
    }
  }

  /**
   * Generates the module map by mapping dynamically imported JSON definitions
   * to their respective SDK modules.
   * @returns {Object} The module map containing SDK modules categorized by SDK type.
   */
  generateModuleMap() {
    this._importSdkJson();

    for (const [sdkType] of Object.entries(this.sdkPaths)) {
      this._getModulesFromJson(sdkType);
      for (const module of this.sdkModules[sdkType]) {
        const lowerCaseModule = module.toLowerCase();
        this.sdkModulesMap[sdkType][lowerCaseModule] = this.sdkModuleImports[sdkType][module];
      }
    }

    return this.sdkModulesMap;
  }
}

export default FireboltSdkModuleLoader;
