# ClearEventHandler 

## Overview

Handler used to clear event listeners. This handler is invoked to clear a single event at a time.This handler intent is identified with field as task and value as "clearEventHandler" along with the event name which needs to be cleared in the params field of the payload.

It performs the following actions :
1. Parse the input message received to get the event to be cleared
2. Clear the single event passed in the params field 
3. Save the response/error and perform schema validations. (More about schema validations here : [validation documentation](../Validations.md).)
4. Format the result and send the response back to the IntentReader

## Usage
* This handler is invoked to clear a single event at a time.

```json
    {
        "action": "search",
        "data": {
            "query": {
                "query": {
                    "task": "clearEventHandler",
                    "params": {
                        "event": "<eventName>"
                    },
                    "action": "NA",
                    "appType": "<appType>"
                }
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
| task                  | "clearEventHandler"- Its a static value and should not be changed for this handler    | Y         |
| params                | Required event params for the intent. Here, "event" is the mandatory parameter        | Y         |
| appType               | Corresponding intent is launching on which app                                        | Y         |


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
