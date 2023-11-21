# RunTestHandler 

## Overview

Handler that triggers a test in FCA.This handler run on each test cases. Additional test parameters can be added to params field in payload.
For example if we are running a test suite, an array of method parameters are passed in param field of the payload while in a single test run only the required method is passed.

## Usage

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "runTest",
                "params": {
                    "certification": true,
                    "exceptionMethods": [
                        {
                            "method": "<methodName>",
                            "param": {}
                        }
                    ],
                    "methodsToBeExcluded": [],
                    "modulesToBeExcluded": []
                },
                "action": "<CORE/MANAGE/FIREBOLT-ALL>",
                "context": {
                    "communicationMode": "<mode>"
                },
                "metadata": {},
                "asynchronous": false,
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

### Parameters

| Key                       | Description                                                                   | Required? |
|---------------------------|-------------------------------------------------------------------------------|-----------|
| task                      | "runTest"- Its a static value and should not be changed for this handler      | Y         |
| params                    | Required  params for  the intent.                                             | optional  |
| action                    | It indicates whether it core, manage or all suite run                         | Y  |
| appType                   | Corresponding intent is launching on which app                                | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request of core suite run</summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "runTest",
                "params": {
                    "certification": true,
                    "exceptionMethods": [
                        {
                            "method": "Authentication.token",
                            "param": {
                                "type": "distributor"
                            }
                        },
                        "..."
                    ],
                    "methodsToBeExcluded": [
                        "Accessory.pair",
                        "Device.provision",
                        "..."
                    ],
                    "modulesToBeExcluded": []
                },
                "action": "CORE",
                "context": {
                    "communicationMode": "SDK"
                },
                "metadata": {
                    "target": "RIPPLE",
                    "targetVersion": "470d26a",
                    "..."
                },
                "asynchronous": false,
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }
