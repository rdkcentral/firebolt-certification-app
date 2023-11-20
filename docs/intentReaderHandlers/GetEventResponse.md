# GetEventResponse

## Overview

Handler used to get event response after triggering each event.The response is fetched only after the event is triggered.This handler intent is identified with field as task and value as "getEventResponse" along with the event name for which response needs to be fetched in the param field of the payload.

It performs the following actions :
1. Parse the input message received to get the event name
2. Fetch the response of the triggered event
3. Save the response/error and perform schema validations. More about schema validations here : [validation documentation](../Validations.md).
4. Format the result and send the response back to the IntentReader


## Usage
* This handler is to get event response after triggering each event.
```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"getEventResponse\",\"params\":{\"event\":<eventName>},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```

### Parameters

| Key                   | Description                                                                          | Required? |
|-----------------------|--------------------------------------------------------------------------------------|-----------|
| task                  | "getEventResponse"- Its a static value and should not be changed for this handler    | Y         |
| params                | Required event params for the intent. Here, "event" is a mandatory parameter         | Y         |
| appType               | Corresponding intent is launching on which app                                       | Y         |

* Response
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

