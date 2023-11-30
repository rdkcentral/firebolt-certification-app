# RunTestHandler 

## Overview

RunTestHandler is invoked when the task specified in the intent has the value "runTest". This handler is used to run sanity tests in FCA. When this handler is invoked, it will loop through all the APIs in the openRpc schema, invoke the APIs, and perform schema validations on the responses. Once the execution is over, a test report is generated. For more about execution, [click here](../Execution.md#sanity-test-execution) and for reporting [here.](../Reporting.md#supported-ways-of-retrieving-reports) 

It performs the following actions:
1. Parses the input message received to fetch the action and corresponding parameters.
2. FCA loops through the APIs in openRpc. 
3. Executes and saves the API response or error and performs schema validation.
4. Formats the result and sends the response back to IntentReader.

## Usage

### Request Format

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

#### Parameters

| Key                         | Description                                                                                                                              | Required?   |
| --------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------| ----------- |
| task                        | "runTest"- Its a static value and should not be changed for this handler.                                                                | Y           |
| params                      | Required  params for  the intent.                                                                                                        | optional    |
| exceptionMethods            | Inner field of params where we pass the list of not supported methods and these method responses will be validated against error schema. | optional    |
| methodsToBeExcluded         | Inner field of params where we pass the list of methods which are likely to interupt the normal sanity execution                         | optional    |
| modulesToBeExcluded         | Inner field of params where we pass the list of modules to be excluded for test execution.                                               | optional    |
| action                      | It indicates whether its core, manage or all suite run.                                                                                  | Y           |
| communicationMode           | It indicates whether the test is run on transport or sdk mode mode.                                                                      | optional    |
| metadata                    | The info: related to target platform like deviceModel, devicePartner.                                                                    | optional    |
| appType                     | Corresponding intent is launching on which app.                                                                                          | Y           |

### Response Format

```json
    {
        "stats": {
            "pending": 0,
            "pendingPercent": 0,
            "..."
        },
        "results": [
            {
                "uuid": "<uuid>",
                "title": "Summary",
                "..."
            }
        ]

    }
```

#### Parameters

| Key                         | Description                                                                                    |
| --------------------------- | -----------------------------------------------------------------------------------------------|
| stats                       | It indicates the status of the test run like the pass percentage, number of failures etc       |
| results                     | It gives the details about each test in the suite run                                          |

## Examples

### Valid Intent and Response

<details>
    <summary> Valid request of core suite run </summary>
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
                    "communicationMode": "SDK/Transport"
                },
                "metadata": {
                    "target": "<Target Platform>",
                    "targetVersion": "<Version>",
                    "..."
                },
                "asynchronous": false,
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }


<details>
    <summary> Response of the valid request </summary>
</details>

    {
        "stats": {
            "pending": 0,
            "pendingPercent": 0,
            "other": 0,
            "hasOther": false,
            "skipped": 13,
            "hasSkipped": true,
            "suites": 1,
            "duration": 93015,
            "tests": 199,
            "start": "<startTime>",
            "end": "<endTime>",
            "testsRegistered": 199,
            "passes": 178,
            "failures": 8,
            "passPercent": 89
        },
        "results": [
            {
                "uuid": "<uuid>",
                "title": "Summary",
                "fullFile": "",
                "file": "",
                "beforeHooks": [],
                "afterHooks": [],
                "tests": [],
                "suites": [
                    {
                        "uuid": "<uuid>",
                        "title": "Summary",
                        "fullFile": "",
                        "file": "",
                        "beforeHooks": [],
                        "afterHooks": [],
                        "tests": [],
                        "suites": [],
                        "passes": [],
                        "failures": [],
                        "pending": [],
                        "skipped": [],
                        "duration": 0,
                        "root": false,
                        "rootEmpty": false,
                        "_timeout": 2000
                    }
                ],
                "passes": [],
                "failures": [],
                "pending": [],
                "skipped": [],
                "duration": 0,
                "root": true,
                "rootEmpty": true,
                "_timeout": 2000
            },
            {
                "uuid": "<uuid>",
                "title": "Firebolt SDK Version : "<version>" , Mode : "<mode>" , Firmware : <firware> , Hash : <hash> , AppId : <appId>",
                "fullFile": "",
                "file": "",
                "beforeHooks": [],
                "afterHooks": [],
                "tests": [],
                "suites": [
                    {
                        "uuid": "<uuid>",
                        "title": "CORE",
                        "fullFile": "",
                        "file": "",
                        "beforeHooks": [],
                        "afterHooks": [],
                        "tests": []
                    }
                ]
            }
        ]
    }

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary> Invalid request with empty params </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "runTest",
                "params": {},
                "action": "CORE",
                "context": {
                    "communicationMode": "SDK"
                },
                "metadata": {
                    "target": "RIPPLE",
                    "deviceModel": "Sercomm XiOne",
                    "devicePartner": "Comcast"
                },
                "asynchronous": false,
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }

<details>
    <summary> Response for invalid request with empty params </summary>
</details>

    Unable to get Response from FCA

----------------------------------------------------------------------------------------------------------------------
### Valid Intent and Response of lifecycle validation

<details>
    <summary> Request of Lifecycle Validation </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "runTest",
                "params": {
                    "mode": "Lifecycle.validation",
                    "methodName": "Lifecycle.ready"
                },
                "context": {
                    "communicationMode": "SDK"
                },
                "action": "Lifecycle.validation",
                "appType": "firebolt"
            }
        }
    }

<details>
    <summary> Response of lifecycle validation </summary>
</details>


    {
        "type": "NotifyMessage",
        "requestId": "<requestId>",
        "headers": {
            "id": "<id>",
            "Client": "fca"
        },
        "messageType": null,
        "topic": "<topic>",
        "payload": {
            "report": {
                "method": "callMethod",
                "params": [
                    "<appId>",
                    {
                        "action": "search",
                        "context": {
                            "source": "voice"
                        },
                        "data": {
                            "query": {
                                "params": {
                                    "lifecycle_validation": true,
                                    "appType": "<appType>",
                                    "appId": "<appId>"
                                }
                            }
                        }
                    }
                ],
                "responseCode": 0,
                "apiResponse": {
                    "result": true,
                    "error": null
                },
                "schemaValidationStatus": "PASS",
                "schemaValidationResponse": {
                    "instance": true,
                    "schema": {
                        "type": "boolean"
                    },
                    "options": {},
                    "path": [],
                    "propertyPath": "instance",
                    "errors": [],
                    "disableFormat": false
                }
            }
        }
    }

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response of lifecycle validation

<details>
    <summary> Request of Lifecycle Validation with wrong methodName </summary>
</details>

        {
        "action": "search",
        "data": {
            "query": {
                "task": "runTest",
                "params": {
                    "mode": "Lifecycle.validation",
                    "methodName": "Lifecycle.testName"
                },
                "context": {
                    "communicationMode": "SDK"
                },
                "action": "Lifecycle.validation",
                "appType": "firebolt"
            }
        }
    }


<details>
    <summary>Response</summary>
</details>  

    {
        "result": null,
        "error": {
            "code": -32601,
            "message": "Wrong Method Name"
        }
    }
