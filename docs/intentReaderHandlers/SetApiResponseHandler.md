# SetApiResponseHandler 

## Overview

This handler is invoked to assign the response value to an environment variable in FCA.This handler intent is identified with field as task and 
value as "setApiResponse" alone with the apiResponse in the param field of the payload.

It performs the following actions :
1. Parse the input message received to get the apiResponse.
2. Assign the value to an environment variable

## Usage
* This handler is invoked to assign the response value to an environment variable in FCA

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "setApiResponse",
                "params": {
                    "apiResponse": {
                        "module": "<moduleName>",
                        "methodName": "<methodName>",
                        "type": "method",
                        "attributes": [
                            {
                                "..."
                            }
                        ]
                    }
                },
                "action": "NA",
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```
### Parameters

| Key                   | Description                                                                              | Required? |
|-----------------------|------------------------------------------------------------------------------------------|-----------|
| task                  | "setApiResponse"- Its a static value and should not be changed for this handler          | Y         |
| params                | Required response params for the intent. Here, "apiResponse" is a mandatory parameter    | Y         |
| appType               | Corresponding intent is launching on which app                                           | Y         |

## Examples
### Valid Intent and Response

<details>
    <summary>Request for setApiResponse of keyboard.email api</summary>
</details>

{
    "action": "search",
    "data": {
        "query": {
            "task": "setApiResponse",
            "params": {
                "apiResponse": {
                    "module": "keyboard",
                    "methodName": "keyboard.email",
                    "type": "method",
                    "attributes": [
                        {
                            "ApiText": "john@doe.com",
                            "isCancelled": false,
                            "withUi": false,
                            "result": "john@doe.com"
                        }
                    ]
                }
            },
            "action": "NA",
            "appType": "firebolt"
        }
    },
    "context": {
        "source": "device"
    }
}

<details>
    <summary> Response </summary>
</details>

            "Received keyboard ApiResponse parameters"
