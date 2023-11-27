# FCA: Executing Tests

This document provides a detailed guide on the various methods of executing tests on integrated devices using the Firebolt SDK. It is designed to give developers and testers clear insights into the functionality, setup, and usage of different test execution methods.

## Table of Contents
- [Supported Ways of Execution](#supported-ways-of-execution)
  - [UI](#ui)
  - [Standalone](#standalone)
  - [Remotely](#remotely)
- [Test Types](#test-types)
  - [Sanity](#sanity)
  - [Regression](#regression)
- [Modes of Communication](#modes-of-communication)

# Supported ways of Execution

## UI

### Background

Manual execution via the user interface allows for interactive and immediate testing, giving testers direct control over the test process.

### Setup

Launch the app on the device.

### Usage
Navigate through the Firebolt UI.
Choose the communication mode: SDK or Transport.
Select the desired SDK mode: CoreSDK, ManageSDK, or All SDKs.
Invoke the sanity suite or specific tests manually.
Useful for quick checks and immediate feedback on the test results.
For specific instructions on navigation, visit this doc [GUI](GUI.md).

## Standalone

### Background

Standalone execution is designed for automated testing scenarios, where generating detailed reports and logs is crucial to be within FCA independantly of any other apps or frameworks.

### Setup

Enable standalone execution by setting the standalone=true parameter in the URL example:(https://firecertapp.firecert.com/edge/index.html?standalond=true) or within the intent message example:(intent>data>query>params>"standalone":true).

This mode is particularly useful for integrating testing into automated workflows.
For more info check 
[Intent Reader](IntentReader.md).

### Usage

Upon execution, Mochawesome reports are generated.
Reports are uploaded to a specific endpoint, processed, and made accessible as HTML reports in an S3 bucket.
For more info check [Reporting](Reporting.md).


## Remotely

### Background

FCA extends its capabilities by offering remote accessibility through API access,benefiting users managing test suites or without direct device access.

### Setup

- **PubSub Client**: 
A PubSub client is necessary to trigger FCA remotely.
Users can also send messages via WebStock (WSS) on local area network (LAN).
Before using FCA with API access, implement a PubSub client as per the [PubSub documentation](plugins/PubSub.md).

### Usage

- Send a PubSub message to FCA's client follwoing the instructions in the [PubSub Handlers documentation](pubSubHandlers/PubSubHandlers.md).

- **Sample Intent Message**:
A sample intent message to trigger FCA remotely is provided below:

```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "APIName",
    "params": {
        "appId": "AppId",
        "intent": {
            "action": "search",
            "data": {
                "query": {
                    "task": "runTest",
                    "params": {
                        "certification": true,
                        "exceptionMethods": [
                            {
                                "method": "Api.method",
                                "param": {
                                    "type": "distributor"
                                }
                            },
                            "..."
                        ],
                        "methodsToBeExcluded": [
                            "Api.method",
                            "Api.method",
                            "..."
                        ],
                        "modulesToBeExcluded": []
                    },
                    "action": "CORE",
                    "context": {
                        "communicationMode": "SDK"
                    },
                    "metadata": {
                        "target": "targetName",
                        "targetVersion": "targetVersion",
                        "...": "..."
                    },
                    "asynchronous": false,
                    "appType": "firebolt"
                }
            },
            "context": {
                "source": "device"
            }
        }
    }
}

```

for more specific triggering follow instructions 
[RunTest Handler documentation](intentReaderHandlers/RunTestHandler.md).


# Test Types

## Sanity

Sanity testing ensures that all APIs function correctly at a basic level, serving as a quick check method.
Execute the Sanity Test Suite from the UI, as described in the 'Supported Ways of Execution' section.
This suite tests all APIs by invoking predefined calls under each API, offering a comprehensive overview of basic functionality.

## Regression

Regression testing involves in-depth testing to ensure new features or changes haven't adversely affected existing functionality.
Create custom test cases with specific parameters tailored to the features or changes being tested.
Send requests with custom parameters and verify responses against predefined data sets for targeted testing.
to trigger those tests, build a framework communicating with your device, and send requests and verify responses as needed.


# Modes of communication

Different modes of communication offer flexibility in test approach, tailored to specific testing needs.

## SDK Mode
 Invoking APIs using the Firebolt SDK.
## Transport Mode
 Bypassing the SDK ( directly communicating with the device, skipping SDK layer), by setting communicationMode param in the intent to Transport and using the Transport layer for API invocation. All validations or data messaging is handled directly between FCA and the device.
