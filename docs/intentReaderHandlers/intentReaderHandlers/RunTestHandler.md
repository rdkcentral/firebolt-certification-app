# RunTestHandler 

## Overview

Handler that triggers a test in FCA.This handler run on each test cases. Additional test parameters can be added to params field in payload.
For example if we are running a test suite, an array of method parameters are passed in param field of the payload while in a single test run only the required method is passed.
## Usage

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"runTest\",\"params\":{\"methodName\":\"<methodName>\",\"methodParams\":{}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
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
| params                    | required  params for  the intent                                              | optional  |
| appType                   | corresponding intent is launching on which app                                | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request of single test</summary>
</details>

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"lifecycle.close\",\"methodParams\":\"userExit\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                }
            }
<details>
    <summary> Response </summary>
</details>

        {
            "result": null,
            "error": null,
            "schemaResult": {
                "status": "PASS",
                "schemaValidationResult": {
                    "instance": null,
                    "schema": {
                        "const": null
                    },
                    "options": {},
                    "path": [],
                    "propertyPath": "instance",
                    "errors": [],
                    "disableFormat": false
                }
            }
        }
### Invalid Intent and Response

<details>
    <summary>Request if we pass invalid parameter </summary>
</details>
    
        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"lifecycle.close\",\"methodParams\":\"error\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response </summary>
</details>

        {
    "result": "undefined",
    "error": {
        "code": -32602,
        "message": "unknown variant e, expected one of remoteButton, userExit, error, appNotReady, resourceContention, done at line 1 column 13"
    },
    "schemaResult": {
        "status": "FAIL",
        "schemaValidationResult": {
            "instance": "undefined",
            "schema": {
                "const": null
            },
            "options": {},
            "path": [],
            "propertyPath": "instance",
            "errors": [
                {
                    "path": [],
                    "property": "instance",
                    "message": "does not exactly match expected constant: null",
                    "schema": {
                        "const": null
                    },
                    "instance": "undefined",
                    "name": "const",
                    "argument": null,
                    "stack": "instance does not exactly match expected constant: null"
                }
            ],
            "disableFormat": false
        }
    }
}

<details>
    <summary>Request if we pass invalid method </summary>
</details>

            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"<Invalid methodName\",\"methodParams\":\"userExit\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }
        
<details>
    <summary> Response </summary>
</details>

            Invalid lifecycle method passed
