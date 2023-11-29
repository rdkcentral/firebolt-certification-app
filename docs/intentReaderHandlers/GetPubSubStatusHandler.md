# GetPubSubStatusHandler

## Overview

GetPubSubStatusHandler is invoked when the task specified in the intent has the value "getPubSubStatus". This handler is used to check the status of PubSub connection in FCA.

It performs the following actions :
1. Parse the input message received.
2. Check the status of pubSub connection. 
3. Save the response/error.
4. Format the result and send the response back to IntentReader.

## Usage
* This handler is used to check the status of PubSub connection in FCA.

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getPubSubStatus",
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

| Key               | Description                                                                           | Required? |
|-------------------|---------------------------------------------------------------------------------------|-----------|
| task              | "getPubSubStatus"- Its a static value and should not be changed for this handler      | Y         |
| appType           | Corresponding intent is launching on which app                                        | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

        {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }


<details>
    <summary> Response </summary>
</details>

        [
            true,
            null
        ]

### Invalid Intent and Response

<details>
    <summary>Request when we are not able to connect to PubSub </summary>
</details>

            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }
<details>
    <summary> Response </summary>
</details>

            PubSub ACK not received from FCA. App not launched in 30000 ms
