# FCA: Executing Tests

TODO: add intro

## Table of Contents

- [Certification Suite](#certification-suite)
- [Supported Ways of Execution](#supported-ways-of-execution)
  - [Sanity Test Execution](#sanity-test-execution)
  - [Regression Test Execution](#regression-test-execution)
- [Supported Modes of Execution](#supported-modes-of-execution)
- [Executing Remotely](#executing-remotely)

## Certification Suite

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Supported ways of Execution

Manual Execution via UI
Tests, including the sanity Test Suite, can be executed manually through the user interface. To do this, navigate as follows:

1. Start >SDK or Transport (Select communication mode).
2. After communication mode choose CoreSDK, ManageSDK or All SDKs
3. Select 'Invoke' to start the sanity suite, running all predefined API calls under each API.

#### Standalone Execution

FCA can be run with standalone=true parameter in the URL or with standalone:'true' in the intent message. This enables generation of Mochawesome reports in FCA. The JSON report is uploaded to an endpoint/standalone, places in an S3 bucket, and an AWS lambda function generates an HTML report in another publicly available S3 bucket.



#### Sanity Test Execution

The Sanity Test Suite, executable from the UI, tests all APIs by invoking predefined calls under each API.

#### Regression Test Execution

For more in depth regression testing, users can create custom test cases, where they send requests with custom params and verify responses against a predefined data set. This allows for more targeted and specific testing of new features or changes.

## Supported Modes of execution

SDK and Transport Modes ( can be passed via cli)

- *SDK*: APIs are invoked using the Firebolt SDK
- *Transport* : APIs are invoked using the Transport layer, bypassing the SDK. 

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
- TODO: ADD further details for configurations and usage.
