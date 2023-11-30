# RegisterEventHandler 

## Overview

RegisterEventHandler is invoked when the task specified in the intent has the value "registerEvent". This handler is used to register an event in FCA.

It performs the following actions:
1. Parses the input message received to get the event.
2. FCA registers the event received in the input command.
3. Saves the response or error and performs schema validations. More about schema validations [here.](../Validations.md)
4. Formats the result and sends the response back to the IntentReader.

## Usage

### Request Format

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerEvent",
                "params": {
                    "event": "<event>",
                    "params": {}
                },
                "action": "NA",
                "context": {
                    "communicationMode": "<mode>"
                },
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

#### Parameters

| Key               | Description                                                                         | Required? |
|-------------------|-------------------------------------------------------------------------------------|-----------|
| task              | "registerEvent"- Its a static value and should not be changed for this handler      | Y         |
| params            | Required event params for  the intent. Here, "event" is a mandatory parameter       | Y         |
| appType           | Corresponding intent is launching on which app                                      | Y         |


### Response

```json

        {
            "eventName": "<eventName>",
            "eventListenerId": "<eventName>-146",
            "eventListenerResponse": {
                "listenerResponse": 146,
                "error": null
            },
            "eventListenerSchemaResult": {
                "status": "PASS",
                "eventSchemaResult": {}
            }
        }
```

#### Parameters

| Key                   | Description                                     | 
|-----------------------|-------------------------------------------------|
| eventName             | The name of the triggered event                 |
| eventListenerId       | ListenerId of the triggered event               | 
| eventResponse         | Response of the triggered event                 | 
| eventSchemaResult     | Schema result of the event                      |    

## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>
          
            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerEvent\",\"params\":{\"event\":\"<eventName>\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
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
            "eventListenerId": "<eventName>-146",
            "eventListenerResponse": {
                "listenerResponse": 146,
                "error": null
            },
            "eventListenerSchemaResult": {
                "status": "PASS",
                "eventSchemaResult": {}
            }
        }

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary>Request when we pass invalid event name </summary>
</details>
    
    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerEvent",
                "params": {
                    "event": "<Invalid eventName>",
                    "params": {}
                },
                "action": "NA",
                "context": {
                    "communicationMode": "SDK"
                },
                "appType": "firebolt"
            }
        }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "eventName": "<Invalid eventName>",
        "eventListenerId": null,
        "eventListenerResponse": {
            "result": null,
            "error": {
                "code": -32601,
                "message": "Method not Found"
            }
        },
        "eventListenerSchemaResult": {
            "status": "PASS",
            "eventSchemaResult": {
                "instance": {
                    "code": -32601,
                    "message": "Method not Found"
                }
            }
        }
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass empty params </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerEvent",
                "params": {},
                "action": "NA",
                "context": {
                    "communicationMode": "SDK"
                },
                "appType": " firebolt "
            }
        }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "Unable to find the response for the current request" 
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass invalid params </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerEvent",
                "params": "<Invalid Params>",
                "action": "NA",
                "context": {
                    "communicationMode": "SDK"
                },
                "appType": "firebolt "
            }
        }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "Unable to find the response for the current request" 
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass empty task </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "",
                "params": {
                    "event": "<eventName>",
                    "params": {}
                },
                "action": "NA",
                "context": {
                    "communicationMode": "SDK"
                },
                "appType": "firebolt"
            }
        }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "Unable to find the response for the current request" 
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass invalid task </summary>
</details>

    {
        "action": "search",
            "data": {
                "query": {
                    "task": "<Invalid Task>",
                    "params": {
                        "event": "<eventName>",
                        "params": {}
                    },
                    "action": "NA",
                    "context": {
                        "communicationMode": "SDK"
                    },
                    "appType": "firebolt"
                }
            }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "Unable to find the response for the current request" 
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass empty event </summary>
</details>

    {
        "action": "search",
            "data": {
                "query": {
                    "task": "registerEvent",
                    "params": {
                        "event": "",
                        "params": {}
                    },
                    "action": "NA",
                    "context": {
                        "communicationMode": "SDK"
                    },
                    "appType": "firebolt"
                }
            }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "Unable to find the response for the current request" 
    }

----------------------------------------------------------------------------------------------------------------------

### Intent for a Not Supported Event

If the intent has "isNotSupportedApi" = true, it indicates that the event is not implemented on the platform and we are expecting an error for the same. The error response will be validated against errorSchema instead of the openRpc schema and then will be returned. Detailed information on sending intent is given [here.](docs/pubSubHandlers/RegisterEventHandler.md).

<details>
    <summary>Request with isNotSupportedApi true for a supported event</summary>
</details>
    
    {
        "action": "search",
            "data": {
                "query": {
                    "task": "registerEvent",
                    "params": {
                        "event": "<eventName>",
                        "params": {}
                    },
                    "isNotSupportedApi":true,
                    "action": "NA",
                    "context": {
                        "communicationMode": "SDK"
                    },
                    "appType": "firebolt"
                }
            }
    }

<details>
    <summary>Response</summary>
</details>

    {
        "listenerResponse":9,
        "error":null
    }

- Event response is validated against errorSchema.
- Event listener schema validation: FAIL
