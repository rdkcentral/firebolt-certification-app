# GetEventResponse

## Overview

Handler used to get event response after triggering each event.The response is fetched only after the event is triggered.This handler intent is identified with field as task and value as "getEventResponse" along with the event name for which response needs to be fetched in the param field of the payload.


## Usage
* This handler is to get event response after triggering each event.

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"getEventResponse\",\"params\":{\"event\":\"advertising.onPolicyChanged-8\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```

### Parameters

| Key                   | Description                                       | Required? |
|-----------------------|---------------------------------------------------|-----------|
| getEventResponse      | corresponding intent for the task                 | Y         |
| params                | required event params for the intent              | Y         |
| appType               | corresponding intent is launching on which app    | Y         |

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

### Invalid Intent and Response
### Without Event Name
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
                "": null
            }

### With Invalid Event Name

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

            No Response

