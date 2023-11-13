# RegisterEventHandler 

## Overview

Handler used to register the event in FCA.This handler intent is identified with field as task and value as "registerEvent" along with the event name in the param field of the payload.

## Usage

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerEvent\",\"params\":{\"event\":\"advertising.onPolicyChanged\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```

### Parameters

| Key               | Description                                       | Required? |
|-------------------|---------------------------------------------------|-----------|
| registerEvent     | corresponding intent for the task                 | Y         |
| params            | required event params for  the intent             | Y         |
| appType           | corresponding intent is launching on which app    | Y         |

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
### Invalid Intent and Response
### Invalid Event
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

### Empty params
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

### Invalid params
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

### Empty task
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

### Invalid task
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

### Empty Event 
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

### Empty Event 
<details>
    <summary>Request for a Not Supported Event </summary>
</details>
- Sample Intent - Here, if there is a key *isNotSupportedApi* with value *true* in the intent received, that event registration response will be validated against errorSchema. Detailed information on sending intent is given [here](docs/pubSubHandlers/RegisterEventHandler.md).

{
	    "task":"registerEvent",
	    "params":{
		    "method":"eventName",
		    "methodParams":{"key":"value"}
	    },
	    "isNotSupportedApi":true,
    }


    
