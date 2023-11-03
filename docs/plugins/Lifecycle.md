# Lifecycle

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

The `Lifecycle` plugin encapsulates additional lifecycle logic not encompassed in the core FCA functionality. It provides extensibility for [app types](../Configurations.md#app-types) that are absent from the base application. This plugin offers an interface that can work with [external invokers](./ExternalInvokers.md) to offer varied application functionalities.

## Configuration

The `index.js` file located inside the `/plugins/lifecycle` directory is responsible for dynamically bundling all JavaScript files in that directory into a single module, excluding itself. This allows for easy import and access to specific lifecycle methods based on the application's type.

```
const files = require.context('.', false, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
  if (key === './index.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key);
});

console.log('Loading lifecycle methods');

export default modules;
```

Lifecycle plugins are imported into [LifeCycleHistory.js](../../src/LifeCycleHistory.js) by default.

## Setup

To extend the lifecycle functionality for a specific application type:

1. Create a JavaScript file within the `/plugins/lifecycle` directory named after the app type (e.g., <APP_TYPE>.js).

2. Ensure the file exports a `ready()` function. This function should encapsulate the lifecycle logic specific to the app type.

-Example

```
export const ready = () => {
  // Add logic to for setting the lifecycle state to "ready".
}
```

-Example with [external invoker](./ExternalInvokers.md)
```
import externalInvokers from 'externalInvokers';
const <APP_TYPE_INVOKER> = externalInvokers.<APP_TYPE>;


export const ready = () => {
  <APP_TYPE_INVOKER>.executeMethod(...);
}
```

## Usage

`<APP_TYPE>.ready()` is specifically used within the following block of code in [LifeCycleHistory.js](../../src/LifeCycleHistory.js).

```
 if (lifecycleValidation != 'true') {
  /* Require the lifecycle plugins directory, which returns an object
    where each key is a file name in the directory and each value is the 
    default export of that file.
  */
  const lifecyclePlugins = require('../plugins/lifecycle');

  /* Get the lifecycle for the current app type. For example, if
    process.env.APP_TYPE is 'foo', this will return the default export
    of the 'foo.js' file in the lifecycle plugins directory.
  */
  const appLifecycle = lifecyclePlugins[process.env.APP_TYPE];

  // Check if a lifecycle for the current app type exists and if it has a 'ready' function.
  if (appLifecycle && typeof appLifecycle === 'function') {
    // If such a lifecycle exists, call its 'ready' function.
    appLifecycle.ready();
  } else {
    // If no such lifecycle exists, call the default 'Lifecycle.ready()' function.
    Lifecycle.ready();
  }
}
```

To provide more detail, the `LifeCycleHistory.init()` function that calls `<APP_TYPE>.ready()` is called inside of [App.js](../../src/App.js) once the application is in a "Loaded" state.

FCA ensures that lifecycle functionalities are dynamically initialized based on application type and validation settings. If no specific lifecycle plugin is found for the current app type, or if the plugin doesn't define the `ready()` function, the default `Lifecycle.ready()` function is invoked. This ensures that the app always has a lifecycle initialization logic, even if it's not tailored to its specific type. 
