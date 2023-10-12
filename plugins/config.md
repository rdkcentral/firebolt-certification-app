### config.js

This plugin stores additional constants that are not needed in the core FCA functionality. The additional constants will get bundled under the name 'config' in the webpack during build time.

-Example

    const CONFIG_CONSTANTS = {
        CONFIG_VAR1 : "Hello",
        CONFIG_VAR2 : 9998,
        CONFIG_VAR3 : true
    }

    export default CONFIG_CONSTANTS

    
Imports config.js in the constant.js to merge the env variables.

Note: It can be imported wherever required.

-Example

  import CONFIG_CONSTANTS  from "config"