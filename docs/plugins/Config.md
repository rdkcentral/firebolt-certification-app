# Config

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

The `config.js` plugin is designed to store constants that extend beyond the core requirements of the FCA functionality. It acts as a flexible means to enhance or modify the configuration of the application.
 
## Configuration

The constants within `config.js` can be application-specific settings, URLs, API keys, or any other user-specific, constant values that should be made globally available throughout the application.

Constants included in `config.js` are exported as a single object called `CONFIG_CONSTANTS`. These constants are then imported into `constant.js`. These imported constants can override existing values in `constant.js` or supplement it with new entries. This design ensures that your custom constants seamlessly integrate with the existing constants. We recommend tailoring the values in `CONFIG_CONSTANTS` to user-specific needs, which enables customization without affecting the core set of constants.

For clarity, here's how we've set it up:

```
import CONFIG_CONSTANTS  from "config"

const CONSTANTS = {
  abc: "123",
  ...CONFIG_CONSTANTS
}
```

## Setup

To set up the `config.js` plugin:

1. Navigate to the `/plugins` directory.
2. Create a new file and name it `config.js`.
3. Inside this file, define an object called `CONFIG_CONSTANTS`.
4. Populate `CONFIG_CONSTANTS` with any desired configuration variables in a key/value format.

```
const CONFIG_CONSTANTS = {
    CONFIG_VAR1 : "Hello",
    CONFIG_VAR2 : 9998,
    CONFIG_VAR3 : true
}
```

5. Export `CONFIG_CONSTANTS` as the default export.

Refer to the [Usage](#usage) section for an example of how to structure this object.

## Usage
    
After defining your custom variables in `config.js`, they are automatically integrated into the `CONSTANTS` object. This integration allows them to be accessed from `constant.js` and used throughout the application.

To maintain clarity and consistency in your codebase, the constants, whether they originate from `config.js` or are defined elsewhere, are all bundled into the single `CONSTANTS` object within `constant.js`. This means that when developers import constants for use in various parts of the application, they should always access them via `constants.js`.

```
import { CONSTANTS } from 'path_to_constant.js';

const newVar = CONSTANTS.abc + '456';
```
