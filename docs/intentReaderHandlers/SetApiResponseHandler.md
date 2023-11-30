# SetApiResponseHandler 

## Overview

SetApiResponseHandler is invoked when the task specified in the intent has the value "setApiResponse". This handler is used to assign the apiResponse value to an environment variable in FCA.

It performs the following actions:
1. Parses the input message received to get the API response, which is to be assigned.
2. Assigns the value to an environment variable.

## Usage
* This handler is invoked to assign the response value to an environment variable in FCA.

### Request Format

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
#### Parameters

| Key                   | Description                                                                              | Required? |
|-----------------------|------------------------------------------------------------------------------------------|-----------|
| task                  | "setApiResponse"- Its a static value and should not be changed for this handler          | Y         |
| params                | Required response params for the intent. Here, "apiResponse" is a mandatory parameter    | Y         |
| module                | Corresponding module name for which the API is called                                    | Y         |
| methodName            | The name of the invoked method                                                           | Y         |
| type                  | It indicates whether the response is of method/event                                     | Y         |
| appType               | Corresponding intent is launching on which app                                           | Y         |

### Response Format
* Response can be either "true" or an error response

```json
    true
```
#### Parameters

| Key                         | Description                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------       |
| true                        | It indicates that assigning the apiResponse value to an environment variable in FCA was successful.                    |
| error                       | It indicates the response where  assigning the apiResponse value to an environment variable in FCA was not successful. |

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

----------------------------------------------------------------------------------------------------------------------

### Valid Intent and Response

An invalid scenario is not possible for this handler as whatever the apiResponse value we are passing is assigned to an environment variable.