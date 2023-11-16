# ClearEventHandler 

## Overview

Handler used to clear event listeners. This handler is invoked to clear a single event at a time.This handler intent is identified with field as task and value as "clearEventHandler" along with the event name which needs to be cleared in the params field of the payload.
## Usage
* This handler is invoked to clear a single event at a time.

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"clearEventHandler\",\"params\":{\"event\":\"<eventName>\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```

### Parameters

| Key                   | Description                                                                           | Required? |
|-----------------------|---------------------------------------------------------------------------------------|-----------|
| task                  | "clearEventHandler"- Its a static value and should not be changed for this handler    | Y         |
| params                | required event params for the intent                                                  | Y         |
| appType               | corresponding intent is launching on which app                                        | Y         |


## Examples

### Valid Intent and Response

<details>
    <summary>Request</summary>
</details>

{
    "action": "search",
    "data": {
        "query": {
            "task": "clearEventHandler",
            "params": {
                "event": "<eventName>"
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
    <summary>Response as true</summary>
</details>

            true


### Invalid Intent and Response
### Request without event name
<details>
    <summary>Request without event name </summary>
</details>
    {
        "action": "search",
            "data": {
                "query": {
                    "task": "clearEventHandler",
                    "params": {
                        "event": ""
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
    <summary>Response</summary>
</details> 
    {
        "error": {
            "code": "FCAError",
            "message": "Error while clearing event listeners: undefined is not an object (evaluating 'eventName.slice')"
        }
    }

### Request with invalid event name
<details>
    <summary>Request without event name </summary>
</details>
    {
        "action": "search",
            "data": {
                "query": {
                    "task": "clearEventHandler",
                    "params": {
                        "event": "<Invalid eventName>"
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
    <summary>Response</summary>
</details> 
    {
        "error": {
            "code": "FCAError",
            "message": "Error while clearing event listeners: undefined is not an object (evaluating 'eventName.slice')"
        }
    }
