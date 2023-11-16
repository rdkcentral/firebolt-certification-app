# ClearEventListeners

## Overview

This handler will clear the eventListeners and the event history for the listener as a part of FCA.This handler is invoked to clear all the event listeners at a time. Once all event listeners are cleared, there will be no remaining history of the event listeners that were used.

## Usage
* This handler is invoked to clear all the event listeners at a time.

```json
 {
            "action": "search",
            "data": {
                "query": "{\"task\":\"clearAllListeners\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
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
| appType               | corresponding intent is launching on which app                                        | Y         |


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
