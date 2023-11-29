# FCA: Configurations

TODO: add intro

## Table of Contents

- [Supported Targets](#supported-targets)
- [Connect to Mock Firebolt](#connect-to-mock-firebolt)
- [Supported URL Parameters](#supported-url-parameters)
- [App Types](#app-types)

## Supported targets

EXISTING CONTENTS(needs revision):
> - MFOS - `https://github.com/rdkcentral/mock-firebolt`

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Connect to Mock Firebolt


EXISTING CONTENTS(needs revision):
```
To activate Mock Firebolt, there are specific start-up scripts that exist inside the directory `/plugins/startupScripts`. These scripts along with other scripts that are necessary during start-up are first bundled by webpack during the build process and are loaded in when the application is first loaded.

    - Clone the mock firebolt OS repository` https://github.com/rdkcentral/mock-firebolt`
    - Start the mock Firebolt OS based on steps mentioned in the repository.
    - Start the Firebolt Certification App with `npm start`
    - On launch add the `mf=true` queryParameter to the app launch url and relaunch the app.
    The above steps will by default connect the Firebolt Certification App to the mock Firebolt OS running on localhost at port 9998
    Note: To change the hosted location of the mock Firebolt OS use the guidelines as mentioned in `https://github.com/rdkcentral/mock-firebolt/blob/main/docs/UsageWithinApps.md#activating-mock-firebolt
```

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Supported URL parameters
 
EXISTING CONTENTS(needs revision):
```
- Platform: platform=`<platform>`
  - The supported TARGET values are passed. While executing the test suite, if we provide wrong platform it will not execute the suite and will show "Unsupported target used." error
- Lifecycle Validation: lifecycle_validation=true
  - When we give lifecycle_validation=true it blocks the default execution of `lifecycle.ready` and `lifecycle.finished` method.
  - This will help us to validate lifecycle API's as per our need
- MFOS: mf=true
  - When we are passing mf=true or with userId, FCA will connect to MFOS server and when we invoke any api in FCA it will return the response from MFOS.
- System Ui: systemui=true
  - If FCA systemui=true, FCA acts as the base app in case of ripple. The background color will be changed to purple, and it will display one more button as "Launch FCA app" to launch FCA as third-party app on Ripple devices.
- TestContext: testContext=true
  - If testContext=true, it will add the field context in mocha report generated
```

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## App Types
 
TODO: add details

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details
