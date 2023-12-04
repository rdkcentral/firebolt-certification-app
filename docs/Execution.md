# FCA: Executing Tests

This document provides a detailed guide on the various methods of executing tests on integrated devices using the Firebolt SDK. It is designed to give developers and testers clear insights into the functionality, setup, and usage of different test execution methods.

## Table of Contents
- [Supported Ways of Execution](#supported-ways-of-execution)
  - [UI](#ui)
  - [Remotely](#remotely)
- [Test Types](#test-types)
  - [Sanity](#sanity)
  - [Regression](#regression)
- [Modes of Communication](#modes-of-communication)

## Supported ways of Execution

### UI

**Background**:

Manual execution via the user interface allows for interactive and immediate testing, giving testers direct control over the test process.

**Setup**:

Launch the app on the device.

**Usage**:
Navigate through the Firebolt UI.
Choose the communication mode: SDK or Transport.
Select the desired SDK mode: CoreSDK, ManageSDK, or All SDKs.
Invoke the sanity suite or specific tests manually.
Useful for quick checks and immediate feedback on the test results.
For specific instructions on navigation, visit this doc [GUI](GUI.md).

### Remotely

**Background**:

FCA extends its capabilities by offering remote accessibility through API access,benefiting users managing test suites or without direct device access.

**Setup**:

- **PubSub Client**: 
A PubSub client is necessary to trigger FCA remotely.
Before using FCA with API access, implement a PubSub client as per the [PubSub documentation](plugins/PubSub.md).

**Usage**:

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

For more specific triggering follow instructions 
[RunTest Handler documentation](intentReaderHandlers/RunTestHandler.md).


## Test Types

### Sanity

Sanity testing ensures that all APIs function correctly at a basic level, serving as a quick check method.
Execute the Sanity Test Suite, as described in the [Supported Ways of Execution](#supported-ways-of-execution) section.
This suite tests all APIs by invoking predefined calls under each API, offering a comprehensive overview of basic functionality.

### Regression

For regression testing a user may want to send requests with custom parameters and verify responses against predefined data sets for targeted testing. To trigger those tests, users may be inclined to build out a Framework that allows for communicating with your device, and can both send requests and verify responses as needed.


## Modes of communication

Different modes of communication offer flexibility in test approach, tailored to specific testing needs.

## SDK Mode
 Invoking APIs using the Firebolt SDK.
## Transport Mode
 Bypassing the SDK ( directly communicating with the device, skipping SDK layer), by setting communicationMode param in the intent to Transport and using the Transport layer for API invocation. All validations or data messaging is handled directly between FCA and the device.
