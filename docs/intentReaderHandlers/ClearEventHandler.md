# ClearEventHandler 

## Overview

ClearEventHandler is invoked when the task specified in the intent has the value "clearEventHandler". This handler is used to deregister an event that has been registered already.

It performs the following actions:
1. Parses the input message received to get the event.
2. Deregisters the single event passed in the params field.
3. Saves the response or error.
4. Formats the result and sends the response back to IntentReader

## Usage
* This handler is invoked to clear a single event at a time.
* Request Format

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

* Response Format
* Response can be either "true" or an error response

```json
    true
```
### Parameters

| Key                         | Description                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| true                        | It indicates whether the passed event is cleared or not                                                                                       |

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

----------------------------------------------------------------------------------------------------------------------

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

----------------------------------------------------------------------------------------------------------------------

### Request with invalid event name
<details>
    <summary>Request with invalid event name </summary>
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
