# Lifecycle

This plugin stores additional lifecycle logic not needed in the core FCA functionality. The additional logic can be used for app types not included in the base application. This could be used in conjuction with an external invoker.

The lifecycle functionality should be in a file named `<APP_TYPE>.js` and export the function `ready()`.

-Example
```
export const ready = () => {
  // Add logic to for setting the lifecycle state to ready.
}
```
-Example with external invoker
```
import externalInvokers from 'externalInvokers';
const <APP_TYPE_INVOKER> = externalInvokers.<APP_TYPE>;


export const ready = () => {
  <APP_TYPE_INVOKER>.executeMethod(...);
}
```

Note: This enhancement is leveraged in `/src/LifeCycleHistory.js`.
