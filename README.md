# firebolt-certification-app

## Brief overview

FCA is a lightning based application which can be launched on STB's/TV's.
It has the following features -

- API’s: This option allows a user to invoke Firebolt API's on device and view the API response in UI.
- Lifecycle History: Consists of lifecycle state transition of firecert app.
- Demos: Having a media player with sample video.
- Start: This feature enables a user to run Firebolt API's Sanity suite. Results of the suite run will be displayed in UI.
- FCA can be launched as systemui by adding the url parameter systemui=true. When this parameter is added, system UI acts as the base app or UI in RIPPLE device.

## Table of Contents

- [firebolt-certification-app](#firebolt-certification-app)
  - [Brief overview](#brief-overview)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [FCA URL deployed and available in the S3](#fca-url-deployed-and-available-in-the-s3)
    - [Below are the steps to run FCA in local system](#below-are-the-steps-to-run-fca-in-local-system)
  - [Supported ways of Execution](#supported-ways-of-execution)
  - [Supported targets](#supported-targets)
  - [Supported Modes of execution](#supported-modes-of-execution)
  - [Supported validations](#supported-validations)
  - [Supported ways of retrieving reports](#supported-ways-of-retrieving-reports)
  - [Supported Report Parameters](#supported-report-parameters)
  - [PR and merge process](#pr-and-merge-process)
  - [Supported URL parameters](#supported-url-parameters)
  - [Supported Intent Parameters](#supported-intent-parameters)
  - [Supported PubSub Handlers](#supported-pubsub-handlers)
  - [Plugins](#plugins)
  - [Connect to mock Firebolt OS](#connect-to-mock-firebolt-os)
    - [Timeout in UI prompt](#timeout-in-ui-prompt)

## Setup

Use a recent version of node. At the time of writing, Node 14.15.x was LTS. An `.nvmrc` file is included for those using a node version manager. Everyone else, swim at your own risk.

### FCA URL deployed and available in the S3

- Dev Branch

  - Development branch
  - S3 Edge URL - `https://s3-bucket.s3.amazonaws.com/index.html`

- Master Branch
  - Production branch
  - S3 Prod URL - `https://s3-prod-bucket.s3.amazonaws.com/index.html`

### Below are the steps to run FCA in local system

1. Cloning the FCA Repo
2. Do `npm install`
3. Run `npm start` to launch the App in browser
4. By default, it will be launched as localhost.
   - Example URL: `http://localhost:8081`
     To change it to the system Ip address, go to `Webpack.dev.js` file and update the host value to the system Ip address. Then restart the App.

## Supported ways of Execution

  It is possible to run the sanity suite in other platforms.
## Supported targets

- MFOS - `https://github.com/rdkcentral/mock-firebolt`
## Supported Modes of execution

Mode of execution implies the way in which an API is invoked. There are 2 modes of execution -

- SDK - Api's are invoked using Firebolt SDK.
- Transport - Api's are invoked by using Transport layer and thus bypassing SDK.

## Supported validations

- Schema Validation 
- Behavioural Validation 
## Supported ways of retrieving reports

- From UI

  - After executing suite from the UI in FCA, mocha json will uploaded to S3.
  - Download the `json report` from S3 and convert it to `html report`
    - `arn:aws:s3:::your-s3-Bucket-name`
  - Steps to convert into `html report`
    1.  Move the `json report` to root folder
    2.  Run the command `yarn marge filename.json -f report -o /destination_path`
    3.  Check the `html report` on the destination path

## Supported Report Parameters

- Schema: Schema validation response of each API’s. whether it passed/failed. Validation is done based on the Open RPC document
- Content: Behavioural validation can be done.
- Message: Defines the Schema of the API from the Open RPC document.
- Actual: The API response which is invoked by FCA on the device is stored in actuals.
- Error: Based on the schema validation done by FCA, if the schema validation fails then reason of failure is stored in error.

## PR and merge process

- PR should contain the description about Implementation, test steps etc.
- PR need to be approved by Peer reviewers.
- PR should be assigned to Team Manager for PO Acceptance.
- After approval from reviewers, PR is ready to be merged.
- Dev to master PR – Every Thursday, a dev to master PR is created. Once it is tested across platforms, the PR is merged to master. Then the dev changes will be available in master branch.

## Supported URL parameters

- Platform: platform=`<platform>`
  - The supported TARGET values are passed. While executing the test suite, if we provide wrong platform it will not execute the suite and will show "Unsupported target used." error
- Lifecycle Validation: lifecycle_validation=true
  - When we give lifecycle_validation=true it blocks the default execution of lifecycle.ready and lifecycle.finished method.
  - This will help us to validate lifecycle api's as per our need
- MFOS: mf=true
  - When we are passing mf=true or with userId, FCA will connect to MFOS server and when we invoke any api in FCA it will return the response fron MFOS.
- System Ui: systemui=true
  - If FCA systemui=true, FCA acts as the base app in case of ripple. The background color will be changed to purple and it will display one more button as "Launch FCA app" to launch FCA as third-party app on Ripple devices.
- TestContext: testContext=true
  - If testContext=true, it will add the field context in mocha report generated
- AppId: appId=`<appId>`
  - `appId` used to launch the app.
- Mac Address: macAddress=`<macAddress>`
  -  `macAddress` of the device running the tests.

## Supported Intent Parameters
- appType:
  - Classifier for the app - Launch the certification app for certification validations. Launching a firebolt app for app certification.
- appId: 
  - When `appId` is specified in the intent, it will be used to launch the app.
- macAddress: 
  -  When `macAddress` is specified in the intent, it indicates the mac address of the device running the tests.
- PubSub Publish Suffix: 
  -  When `pubSubPublishSuffix` is specified in the intent, it publishes to the topic.
- PubSub Subscribe Suffix: 
  -  When `pubSubSubscribeSuffix` is specified in the intent, it subscribes to the topic.
- pubSubUrl: 
  - Sets the the url to use for a PubSub server.
- testtoken: 
  - Utilise the `testtoken`. When `testtoken` is specified in the intent, .
- registerprovider: 
  - When `registerProvider = false`, then certification app will not register for userInterest provider.

## Supported PubSub Handlers

The code for handling different types of PubSub requests is located in `./src/pubsub/handlers`. Below are the supported handlers for various types of PubSub requests.

* [GetPubSubStatusHandler](./src/pubsub/handlers/GetPubSubStatusHandler.md)
* [RunTestHandler](./src/pubsub/handlers/RunTestHandler.md)
* [RegisterEventHandler](./src/pubsub/handlers/RegisterEventHandler.md)
* [CallMethodHandler](./src/pubsub/handlers/CallMethodHandler.md)
* [ClearEventHandler](./src/pubsub/handlers/clearEventHandler.md)
* [GetEventResponse](./src/pubsub/handlers/GetEventResponse.md)
* [HealthCheckHandler](./src/pubsub/handlers/HealthCheckHandler.md)
* [LifecycleRecordHandler](./src/pubsub/handlers/lifecycleRecordHandler.md)
* [RegisterProviderHandler](./src/pubsub/handlers/RegisterProviderHandler.md)
* [SetApiResponseHandler](./src/pubsub/handlers/setApiResponseHandler.md)
* [DataFetchHandler](./src/pubsub/handlers/DataFetchHandler.md)
* [ClearEventListeners](./src/pubsub/handlers/ClearEventListeners.md)
* [FireboltCommandHandler](./src/pubsub/handlers/FireboltCommandHandler.md)

## Plugins
Plugins are powerful tools that enable custom functionality to be added to FCA. They are optional. They are available for those who wish to extend or override FCA's capabilities. All plugins are located in the `/plugins` directory and use webpack to be added to the application during build time. Full overview of the Plugins functionalites can be found [here](./plugins/README.md).


## Connect to mock Firebolt OS

To activate Mock Firebolt, there are specific start-up scripts that exist inside of the directory `/plugins/startupScripts`. These scripts along with other scripts that are necessary during start-up are first bundled by webpack during the build process and are loaded in when the application is first loaded.

    - Clone the mock firebolt OS repository` https://github.com/rdkcentral/mock-firebolt`
    - Start the mock Firebolt OS based on steps mentioned in the repository.
    - Start the Firebolt Certification App with `npm start`
    - On launch add the `mf=true` queryParameter to the app launch url and relaunch the app.
    The above steps will by default connect the Firebolt Certification App to the mock Firebolt OS running on localhost at port 9998
    Note: To change the hosted location of the mock Firebolt OS use the guidelines as mentioned in `https://github.com/rdkcentral/mock-firebolt/blob/main/docs/UsageWithinApps.md#activating-mock-firebolt`


### Timeout in UI prompt

For pinChallenge and acknowledgeChallenge UI prompts , a timeout of 15s is added so that, if no action is taken when the prompts displays on the screen (i.e; neither yes/no/back button ), the prompts will be automatically dismissed with "null" value as the response.
The prompt is displayed when the user needs to grant/deny a particular api, or the user has to enter a pin in-case of pinChallenge.
If user wants to grant an api, yes button is pressed, for deniel - no button, and incase if the user wants to dismiss the prompt without any action, back button is pressed.