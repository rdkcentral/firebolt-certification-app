/**
 * Copyright 2024 Comcast Cable Communications Management, LLC
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

/**
 * Firebolt SDK Manager
 * A utility to dynamically load, manage, and map Firebolt SDK modules
 * based on installed dependencies and OpenRPC JSON definitions.
 */
import { CONSTANTS } from '../constant';

// Contexts for dynamically importing OpenRPC JSON files
const coreRpcContext = require.context('@firebolt-js/sdk/dist', true, /-open-rpc\.json$/);
const manageRpcContext = require.context('@firebolt-js/manage-sdk/dist', true, /firebolt-manage-open-rpc\.json$/);
let discoveryRpcContext;

try {
  discoveryRpcContext = require.context('@firebolt-js/discovery-sdk/dist', true, /firebolt-discovery-open-rpc\.json$/);
} catch (error) {
  console.warn('Discovery SDK context is not available:', error);
  discoveryRpcContext = null;
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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
    const capitalizedModuleName = capitalizeFirstLetter(moduleName);
    modulesSet.add(capitalizedModuleName);
  });

  return Array.from(modulesSet);
};

// ----------------------------------------
// 1. SDK Path Resolver
// ----------------------------------------

/**
 * Resolves the paths to OpenRPC JSON files for Firebolt SDKs based on dependencies.
 */
class SdkPathResolver {
  /**
   * Generates a map of SDK paths based on installed dependencies.
   * @param {Object} dependencies - An object containing installed dependencies.
   * @returns {Object} A map of SDK paths.
   */
  static resolvePaths(dependencies) {
    const sdkPaths = {};
    for (const [dependency, version] of Object.entries(dependencies)) {
      if (dependency.startsWith('@firebolt-js/')) {
        const sdkType = dependency.split('/')[1].replace('-sdk', '');
        const sdkKey = sdkType === 'sdk' ? 'core' : sdkType;

        let fileName;
        if (sdkKey === 'core') {
          fileName = SdkPathResolver.getCoreFileName(version);
        } else {
          fileName = `firebolt-${sdkKey}-open-rpc.json`;
        }

        sdkPaths[sdkKey] = `${dependency}/dist/${fileName}`;
      }
    }
    return sdkPaths;
  }

  /**
   * Determines the file name for the core SDK based on version.
   * @param {string} version - The version of the core SDK.
   * @returns {string} The file name for the core SDK.
   */
  static getCoreFileName(version) {
    if (SdkPathResolver.isVersionLessThan(version, '0.11.0')) {
      return 'firebolt-open-rpc.json';
    }
    return 'firebolt-core-open-rpc.json';
  }

  /**
   * Compares two semantic versions to check if the first is less than the second.
   * @param {string} versionA - The version to compare.
   * @param {string} versionB - The version to compare against.
   * @returns {boolean} True if versionA is less than versionB, false otherwise.
   */
  static isVersionLessThan(versionA, versionB) {
    const parseVersion = (version) => version.split('.').map(Number);
    const [majorA, minorA, patchA] = parseVersion(versionA);
    const [majorB, minorB, patchB] = parseVersion(versionB);

    if (majorA !== majorB) {
      return majorA < majorB;
    }
    if (minorA !== minorB) {
      return minorA < minorB;
    }
    return patchA < patchB;
  }
}

// ----------------------------------------
// 2. SDK JSON Loader
// ----------------------------------------

/**
 * Dynamically loads SDK JSON definitions from OpenRPC files.
 */
class SdkJsonLoader {
  /**
   * Initializes the loader with context for each SDK type.
   * @param {Object} sdkContexts - Contexts for dynamically loading OpenRPC JSON files.
   */
  constructor(sdkContexts) {
    this.sdkContexts = sdkContexts;
  }

  /**
   * Loads the JSON definitions for SDKs.
   * @param {Object} sdkPaths - A map of SDK paths.
   * @returns {Object} A map of loaded JSON definitions.
   */
  loadJson(sdkPaths) {
    const sdkJson = {};
    for (const [sdkType, sdkPath] of Object.entries(sdkPaths)) {
      try {
        const sdkModule = this.sdkContexts[sdkType](`./${sdkPath.split('/').pop()}`);
        sdkJson[sdkType] = sdkModule;
      } catch (error) {
        console.warn(`Failed to import module for SDK type '${sdkType}': ${error.message}`);
      }
    }
    return sdkJson;
  }
}

// ----------------------------------------
// 3. SDK Module Mapper
// ----------------------------------------

/**
 * Maps SDK module names to their corresponding JSON definitions.
 */
class SdkModuleMapper {
  /**
   * Maps modules to SDK types.
   * @param {Object} sdkJson - A map of loaded JSON definitions.
   * @param {Object} sdkImports - The imported SDK modules.
   * @returns {Object} A map of SDK modules categorized by type.
   */
  static mapModules(sdkJson, sdkImports) {
    const sdkModules = {};
    const sdkModulesMap = {};

    // Set of PascalCase module names
    const pascalCaseModules = new Set(['SecondScreen', 'SecureStorage', 'ClosedCaptions', 'AcknowledgeChallenge', 'DeveloperTools', 'LifecycleManagement', 'PinChallenge', 'UserGrants', 'VoiceGuidance']);

    for (const [sdkType, json] of Object.entries(sdkJson)) {
      // Check if 'x-module-descriptions' exists and has keys, otherwise use extractUniqueModules
      const moduleNames =
        json.info && json.info[CONSTANTS.X_MODULE_DESCRIPTIONS] && Object.keys(json.info['x-module-descriptions']).length > 0 ? Object.keys(json.info['x-module-descriptions']) : extractUniqueModules(json.methods);

      sdkModules[sdkType] = moduleNames;
      sdkModulesMap[sdkType] = moduleNames.reduce((acc, module) => {
        // Find a matching PascalCase module
        const matchingPascalModule = CONSTANTS.PASCAL_CASED_MODULES.find((pascalModule) => pascalModule.toLowerCase() === module.toLowerCase());

        // Use the PascalCase module if there's a match; otherwise, use the original module
        const moduleKey = matchingPascalModule || module;

        // Add to the accumulator
        acc[module.toLowerCase()] = sdkImports[sdkType][moduleKey];
        return acc;
      }, {});
    }

    return { sdkModules, sdkModulesMap };
  }
}

// ----------------------------------------
// 4. SDK Constant Generator
// ----------------------------------------

/**
 * Generates default SDK constants based on loaded JSON definitions.
 */
class SdkConstantGenerator {
  /**
   * Creates default SDK constants.
   * @param {Object} sdkJson - A map of loaded JSON definitions.
   * @returns {Array<Object>} An array of default SDK constants.
   */
  static generateConstants(sdkJson) {
    // Define the desired order of SDKs
    const desiredOrder = ['core', 'manage', 'discovery'];

    // Sort the keys of sdkJson based on the desired order, placing others at the end
    const sortedKeys = Object.keys(sdkJson).sort((a, b) => {
      const indexA = desiredOrder.indexOf(a);
      const indexB = desiredOrder.indexOf(b);
      if (indexA === -1) return 1; // a is not in desiredOrder, place it at the end
      if (indexB === -1) return -1; // b is not in desiredOrder, place it at the end
      return indexA - indexB;
    });

    // Generate the constants in the desired order
    return sortedKeys.map((sdkType) => ({
      name: sdkType.charAt(0).toUpperCase() + sdkType.slice(1), // Capitalize the first letter
      openRpc: sdkJson[sdkType],
      validation: () => !(process.env.MF_VALUE && !process.env.MOCKOS),
      unavailableMessage: 'MockOs is not running',
    }));
  }
}

// ----------------------------------------
// 5. Firebolt SDK Manager (Main Class)
// ----------------------------------------

/**
 * Firebolt SDK Manager
 * Combines utilities for dynamic module loading, mapping, and constant generation.
 */
class FireboltSdkManager {
  /**
   * Initializes the manager with SDK imports and dependencies.
   * @param {Object} coreSdk - Core SDK object imported from '@firebolt-js/sdk'.
   * @param {Object} manageSdk - Manage SDK object imported from '@firebolt-js/manage-sdk'.
   * @param {Object|null} discoverySdk - Discovery SDK object, or null if not available.
   * @param {Object} dependencies - An object containing installed dependencies.
   */
  constructor(coreSdk, manageSdk, discoverySdk, dependencies) {
    this.dependencies = dependencies;
    this.sdkImports = { core: coreSdk, manage: manageSdk, discovery: discoverySdk };
    this.sdkContexts = { core: coreRpcContext, manage: manageRpcContext, discovery: discoveryRpcContext };
  }

  /**
   * Generates a module map for all SDKs.
   * @returns {Object} The module map.
   */
  generateModuleMap() {
    const sdkPaths = SdkPathResolver.resolvePaths(this.dependencies);
    const sdkJson = new SdkJsonLoader(this.sdkContexts).loadJson(sdkPaths);
    return SdkModuleMapper.mapModules(sdkJson, this.sdkImports).sdkModulesMap;
  }

  /**
   * Generates default SDK constants.
   * @returns {Array<Object>} The default SDK constants.
   */
  generateDefaultSdkConstants() {
    const sdkPaths = SdkPathResolver.resolvePaths(this.dependencies);
    const sdkJson = new SdkJsonLoader(this.sdkContexts).loadJson(sdkPaths);
    return SdkConstantGenerator.generateConstants(sdkJson);
  }
}

export default FireboltSdkManager;
