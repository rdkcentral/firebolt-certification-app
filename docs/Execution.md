# FCA: Executing Tests

This document provides a detailed guide on the various methods of executing tests on integrated devices using the Firebolt SDK. It is designed to give developers and testers clear insights into the functionality, setup, and usage of different test execution methods.

## Table of Contents

- [Supported Ways of Execution](#supported-ways-of-execution)
- [Sanity Test Execution](#sanity-test-execution)
- [Regression Test Execution](#regression-test-execution)
- [Supported Modes of Execution](#supported-modes-of-execution)
- [Executing Remotely](#executing-remotely)


## Supported ways of Execution

### Background

Understanding the different execution modes to efficiently conduct testing on integrated devices. 

### Manual Execution via UI
### Background
Manual execution via the user interface allows for interactive and immediate testing, giving testers direct control over the test process.

**Setup**

Navigate through the Firebolt UI.
Choose the communication mode: SDK or Transport.
Select the desired SDK mode: CoreSDK, ManageSDK, or All SDKs.

### Usage

Invoke the sanity suite or specific tests manually.
Useful for quick checks and immediate feedback on the test results.

### Standalone Execution

### Background

Standalone execution is designed for automated testing scenarios, where generating detailed reports and logs is crucial.

**Setup**

Enable standalone execution by setting the standalone=true parameter in the URL or within the intent message.
This mode is particularly useful for integrating testing into automated workflows.

### Usage

Upon execution, Mochawesome reports are generated.
Reports are uploaded to a specific endpoint, processed, and made accessible as HTML reports in an S3 bucket.



## Sanity Test Execution

### Background

Sanity testing ensures that all APIs function correctly at a basic level, serving as a quick check method.

**Setup**

Execute the Sanity Test Suite from the UI, as described in the 'Supported Ways of Execution' section.

### Usage

This suite tests all APIs by invoking predefined calls under each API, offering a comprehensive overview of basic functionality.

## Regression Test Execution

### Background

Regression testing involves in-depth testing to ensure new features or changes haven't adversely affected existing functionality.

**Setup**

Create custom test cases with specific parameters tailored to the features or changes being tested.

### Usage

Send requests with custom parameters and verify responses against predefined data sets for targeted testing.

## Supported Modes of Execution

### Background

Different modes of execution offer flexibility in test approach, tailored to specific testing needs.

### Setup and Usage

- **SDK Mode:** Invoking APIs using the Firebolt SDK.
- **Transport Mode:** Bypassing the SDK and using the Transport layer for API invocation.


## Executing Remotely

### Background

FCA extends its capabilities by offering remote accessibility through API access,benefiting users managing test suites or without direct device access.

- **PubSub Client**: 

A PubSub client is necessary to trigger FCA remotely.
Users can also send messages via WebStock (WSS) on local area network (LAN).

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
                "query": "{    \"task\": \"runTest\",    \"params\": {        \"certification\": true,        \"exceptionMethods\": [            {                \"method\": \"APIName.session\"            },            {                \"method\": \"APIName.latlon\"            },            {                \"method\": \"APIName.token\",                \"param\": {                    \"type\": \"distributor\"                }            },            {                \"method\": \"ApiName3.token\",                \"param\": {                    \"type\": \"distributor\",                    \"options\": {                        \"clientId\": \"CIMA\"                    }                }            },            {                \"method\": \"Authentication.token\",                \"param\": {                    \"type\": \"distributor\",                    \"options\": {                        \"clientId\": \"OAT\"                    }                }            }        ],        \"methodsToBeExcluded\": [            \"APIName.pair\",            \"APIName.provision\",            \"APIName.session\",            \"Power.sleep\",            \"Wifi.connect\",            \"Wifi.disconnect\",            \"Wifi.wps\",            \"APIName.discover\",            \"APIName.shutdown\",            \"APIName.appAuth\",            \"APIName.approveContentRating\",            \"APIName.approvePurchase\",            \"APIName.deeplink\",            \"APIName.navigateToCompanyPage\",            \"APIName.navigateToEntityPage\",            \"APIName.navigateToFullScreenVideo\",            \"APIName.promptEmail\",            \"APIName.showPinOverlay\",            \"APIName.launch\",            \"APIName.finished\",            \"APIName.dismissLoadingScreen\",            \"APIName.compareAppSettings\",            \"APIName.xscd\",            \"APIName.getOat\",            \"APIName.resizeVideo\",            \"APIName.getSystemInfo\",            \"APiName.email\",            \"APIName.password\",            \"APIName.standard\",            \"APIName.standardFocus\",            \"APIName.passwordFocus\",            \"APIName.emailFocus\",            \"APiName.standardResponse\",            \"APIName.standardError\",            \"APIName.passwordResponse\",            \"APIName.passwordError\",            \"APIName.emailResponse\",            \"APiName.emailError\",            \"APIName.challengeFocus\",            \"APIName.challengeResponse\",            \"APIName.challengeError\",            \"APIName.challengeFocus\",            \"APIName.challengeResponse\",            \"APIName.challengeError\",            \"APIName.grant\",            \"APIName.deny\",            \"APIName.clear\",            \"APIName.purchasedContent\",            \"APIName.entityInfo\",            \"APIName.onPullPurchasedContent\",            \"APIName.onPullEntityInfo\"        ]    },    \"action\": \"CORE\",    \"context\": {        \"communicationMode\": \"Transport\"    },    \"metadata\": {        \"target\": \"TragetName\",        \"targetVersion\": \"7836e61\",        \"deviceModel\": \"DeviceModel\",        \"devicePartner\": \"PartnerName\",        \"fbVersion\": \"NA\"    },    \"asynchronous\": false,    \"appType\": \"AppId\"}"
            },
            "context": {
                "source": "device"
            }
        }
    }
}
```

**Setup**

Before using FCA with API access, implement a PubSub client as per the [PubSub documentation](plugins/PubSub.md).

### Usage

- Send a PubSub message to FCA's client follwoing the instructions in the [PubSub Handlers documentation](pubSubHandlers/PubSubHandlers.md).
