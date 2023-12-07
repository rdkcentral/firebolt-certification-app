# GetEventResponse

## Overview

The GetEventResponse handler is invoked when the task specified in the intent has the value "getEventResponse". This handler is used to get event responses after triggering each event.

It performs the following actions:
1. Parse the input message received to get the event name.
2. Fetches the response of the triggered event in FCA.
3. Saves the response or error and performs schema validations. More about schema validations [here.](../Validations.md).
4. Formats the result and sends the response back to the IntentReader.

## Usage
* This handler is to get event response after triggering each event.
### Request Format

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getEventResponse",
                "params": {
                    "event": "<eventName>"
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

| Key                     | Description                                                                            | Required?   |
| ----------------------- | -------------------------------------------------------------------------------------- | ----------- |
| task                    | "getEventResponse"- It is a static value and should not be changed for this handler    | Y           |
| params                  | Required event params for the intent. Here, "event" is a mandatory parameter           | Y           |
| appType                 | Corresponding intent is launching on which app                                         | Y           |

### Response Format

```json
    {
        "eventName": "<eventName>",
        "eventListenerId": "<eventName>-id",
        "eventResponse": {
            "<eventResponse>"
        },
        "eventSchemaResult": {
            "status": "PASS",
            "eventSchemaResult": []
        },
        "eventTime": "<Time>"
    }

```

#### Parameters

| Key                   | Description                                     | 
|-----------------------|-------------------------------------------------|
| eventName             | The name of the triggered event                 |
| eventListenerId       | ListenerId of the triggered event               | 
| eventResponse         | Response of the triggered event                 | 
| eventSchemaResult     | Schema result of the event                      |    
| eventTime             | Event triggered time                            |         


## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "getEventResponse",
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
    <summary> Response </summary>
</details>

    {
        "eventName": "<eventName>",
        "eventListenerId": "<eventName>-id",
        "eventResponse": {
            <eventResponse>
        },
        "eventSchemaResult": {
            "status": "PASS",
            "eventSchemaResult": []
        },
        "eventTime": "<Time>"
    }

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary>Request without event name </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "getEventResponse",
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
    <summary> Response as null </summary>
</details>

    {
        null
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request with invalid event name </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "getEventResponse",
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
    <summary> Response as null </summary>
</details>

    {
        null
    }

