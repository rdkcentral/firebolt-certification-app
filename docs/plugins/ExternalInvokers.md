# External Invokers

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

External invokers are specialized JavaScript modules that provide an abstraction for interacting with external services or APIs. By implementing a standardized interface, they ensure consistent interaction patterns across various external integrations.

## Configuration

The central registration point for all external invokers is the `index.js` file located within the `/plugins/sdks` directory. This file acts as a unified export hub, bundling all individual invoker files into a singular module.

To facilitate this bundling, ensure that your webpack configuration has the following resolver setup:

```
resolve: {
    alias: {
      'externalInvokers': path.resolve(__dirname, 'plugins/sdks')
    }
}
```

## Setup

To set up a new external invoker, follow these steps:

1. Create your external invoker JavaScript file and place it inside the `/plugins/sdks` directory.

2. Each invoker file must only export one class, which embodies the logic for invoking the corresponding external service or API.

3. To maintain a standardized interaction approach, ensure that your invoker class follows the structure shown below:

```
// External invoker files should export a default class that contains methods for invoking external services or APIs
export default class CustomInvoker {
  invoke(params) {
    // invoke external service or API using the params argument
    // return the result of the invocation
  }
  executeMethod(methodName, params) {
    // execute a specific method of the external service or API using the methodName and params arguments
    // return the result of the method invocation
  }
}
```

Note: If changes are made to this plugin, users must run the command `npm run build` to ensure their modifications are properly compiled and integrated into the application.

## Usage

With the configuration and setup in place, invoking an external service becomes straightforward. Using the alias externalInvokers, you can seamlessly import any invoker class in your codebase.

Below is a usage example for an invoker defined in a file named `customInvoker.js`:

```
import externalInvokers from 'externalInvokers';
const customInvoker = new externalInvokers.customInvoker();
```

Note: Ensure that the imported class name matches the class name exported in the invoker file to instantiate it correctly.
