# GetPubSubStatusHandler

## Overview

Handler that checks the status of PubSub connection in FCA.This handler intent is identified with task parameter as "getPubSubStatus" and is a mandatory parameter in the data passed.There are few optional parameters like action,appType.

## Usage
* This handler is used to check the status of PubSub connection in FCA.

```json
{
                "action": "search",
                "data": {
                    "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
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
| appType           | corresponding intent is launching on which app                                        | Y         |

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
