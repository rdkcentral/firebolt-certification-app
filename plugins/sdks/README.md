# Adding External Invokers

External invokers are JavaScript files that contain a single class that invoke external services or APIs. To add external invokers to your project, follow these steps:

Place your external invoker files in the `/plugins/sdks` directory. Each external invoker file should export a single class that can be used to invoke an external service or API.

To ensure consistency and ease of use, external invoker files should adhere to the following schema:

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

The `index.js` file in the `/plugins/sdks` directory will be used to export all of your external invoker files as a single module.

Below is the configuration that bundles the external invokers:

```
resolve: {
    alias: {
      'externalInvokers': path.resolve(__dirname, 'plugins/sdks')
    }
  }
```

You can now import your external invokers in any of your JavaScript code using the `externalInvokers` path. Here is an example if you had created an invoker in a file named `customInvoker.js`:

```
import externalInvokers from 'externalInvokers';
const customInvoker = new externalInvokers.customInvoker();
```
