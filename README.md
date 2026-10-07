# firebolt-certification-app for RDK8

## Brief overview

FCA is a lightning based application which can be launched on STB's/TV's.
It has the following features -

- API’s: This option allows a user to invoke Firebolt API's on device and view the API response in UI
- Lifecycle History: Consists of lifecycle state transition of firecert app.
- Demos: Having a media player with sample video.
- Start: This feature enables a user to run Firebolt API's Sanity suite. Results of the suite run will be displayed in UI.
- FCA can be launched as systemui by adding the url parameter systemui=true. When this parameter is added, system UI acts as the base app or UI in the device.

## Table of Contents
  - [Setup](#setup)
    - [Run FCA Sanity on an RDK8 Build](#run-fca-sanity-on-an-rdk8-build)
  - [Supported validations](#supported-validations)
  - [Supported Report Parameters](#supported-report-parameters)
  - [Supported URL parameters](#supported-url-parameters)
 

## Setup

Use a recent version of node. At the time of writing, Node 24.21.0 was LTS. An `.nvmrc` file is included for those using a node version manager. Everyone else, swim at your own risk.

### Run FCA Sanity on an RDK8 Build

1. Clone this repository and check out the `FCA_OnRDK8` branch.
2. In `plugins/config.js`, configure the platform list and report-upload endpoints with the URLs for your report server. 

    ```js
    PLATFORM_LIST: ['XCLASS', 'XRE_ThorXRE', 'default', 'mock-firebolt-os'],
    REPORT_PUBLISH_URL: '<report-upload-url>',
    REPORT_PUBLISH_STANDALONE_URL: '<report-upload-url>',
    REPORT_PUBLISH_STANDALONE_REPORT_URL: '<report-upload-url>',
    ```
    Note: You can use a simple http server with upload support. Optionally, use `http_server.py` and `convertjsonexcel.py` in UploadReports folder to upload the json report and convert it to excel files. 

3. In `src/constant.js`, set `METHODS_TO_BE_EXCLUDED` to the APIs that are unavailable or should not run on the target RDK8 build.

    Example:
      ```js
      METHODS_TO_BE_EXCLUDED: ['Accessory.pair', 'Device.provision', 'Power.sleep', 'Wifi.connect'],
      ```

4. Install dependencies:

    ```sh
    npm install
    ```

5. Start FCA:

    ```sh
    npm start
    ```
    - Example URL: `http://localhost:8081`
  To change it to the system Ip address, go to `Webpack.dev.js` file and update the host value to the system Ip address. Then restart the App.

6. Launch below FCA on the RDK8 device and start the sanity suite. 

    Add the below parameters to the URL to start sanity test as standalone

    `https://<FCA URL>/?systemui=true&standalone=true&reportingId=RDK8Q2&x=0.1`

    When execution completes, FCA uploads the JSON report to the configured report-upload endpoint.

## Supported validations

- Schema Validation 
- Behavioural Validation 


## Supported Report Parameters

- Message: Appropriate API validation message
- Schema Validation: Schema validation object of each API’s. Validation is done based on the Open RPC document
  - Status: Whether schema validation passed/failed/skipped
  - Response: The API result/error which is invoked by FCA on the device
  - Expected enums: To display enums or show appropriate message if enums not available or complex to display
  - Expected: Expected schema to be displayed in case schema validation failed with error
  - params: API params
- SLA Validation: SLA validation object if `sla-validation` field passed as true via intent
  - Status: Whether SLA validation passed/failed
  - Actual: Actual API execution time
  - Expected: Expected API execution time passed using `globalSLA` field via intent

## Supported URL parameters

- Platform: platform=`<platform>`
  - The supported TARGET values are passed. While executing the test suite, if we provide wrong platform it will not execute the suite and will show "Unsupported target used." error
- Lifecycle Validation: lifecycle_validation=true
  - When we give lifecycle_validation=true it blocks the default execution of lifecycle.ready and lifecycle.finished method.
  - This will help us to validate lifecycle api's as per our need
- MFOS: mf=true
  - When we are passing mf=true or with userId, FCA will connect to MFOS server and when we invoke any api in FCA it will return the response from MFOS.
- System Ui: systemui=true
  - If FCA systemui=true, FCA acts as the base app. The background color will be changed to purple and it will display one more button as "Launch FCA app" to launch FCA as third-party app on the devices.
- TestContext: testContext=true
  - If testContext=true, it will add the field context in mocha report generated

## Additional Information

Please refer [firebolt-certification-app](https://github.com/rdkcentral/firebolt-certification-app/blob/main/README.md) for more details on FCA
