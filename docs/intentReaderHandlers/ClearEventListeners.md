# ClearEventListeners

## Overview

The ClearEventListeners handler is invoked when the task specified in the intent has the value "clearAllListeners". This handler is used to deregister all the events that are already registered.

It performs the following actions:
1. Deregisters all the events.
2. Saves the response or error.
3. Formats the result and sends the response back to IntentReader.

## Usage
* This handler is invoked to clear all the event listeners at a time.
* Request Format

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

* Response Format
* Response can be either "true" or an error response

```json
    true
```
### Parameters

| Key                         | Description                                                                                                |
| --------------------------- | -----------------------------------------------------------------------------------------------------------|
| true                        | It indicates whether all events are cleared or not                                                         |

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
