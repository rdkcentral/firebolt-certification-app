# ClearEventListeners

## Overview

ClearEventListeners handler is invoked when the task specified in the intent has the value "clearAllListeners". This handler is used to deregister all the events that are registered already. 

It performs the following actions :
1. Deregister all the events.
2. Save the response/error.
3. Format the result and send the response back to IntentReader

## Usage
* This handler is invoked to clear all the event listeners at a time.

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "clearAllListeners",
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

| Key                   | Description                                                                           | Required? |
|-----------------------|---------------------------------------------------------------------------------------|-----------|
| task                  | "clearAllListeners"- Its a static value and should not be changed for this handler    | Y         |
| appType               | Corresponding intent is launching on which app                                        | Y         |


## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"clearAllListeners\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response </summary>
</details>

        Cleared Listeners
