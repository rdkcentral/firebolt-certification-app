# GetPubSubStatusHandler

## Overview

GetPubSubStatusHandler is invoked when the task specified in the intent has the value "getPubSubStatus". This handler is used to check the status of the PubSub connection in FCA.

It performs the following actions:
1. Parses the input message received.
2. Checks whether the pubSub communication is successful or not.
3. Saves the response or error based on pubSub connection status.
4. Formats the result and sends the response back to IntentReader.

## Usage
* This handler is used to check the status of PubSub connection in FCA.

### Request Format

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

#### Parameters

| Key                 | Description                                                                             | Required?   |
| ------------------- | --------------------------------------------------------------------------------------- | ----------- |
| task                | "getPubSubStatus"- It is a static value and should not be changed for this handler      | Y           |
| appType             | Corresponding intent is launching on which app                                          | Y           |

### Response Format
* Response can be either "true" or an error response string

```json
    true/null
```

#### Parameters

| Key                         | Description                                                        |
| --------------------------- | -------------------------------------------------------------------|
| true/null                   | It indicates whether pubSub connection is established or not       |



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

    true

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary>Request when we are not able to connect to PubSub </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\\"appType\":\"firebolt\"}"
        },
        "context": {
            "source": "device"
        }
    }

<details>
    <summary> Response </summary>
</details>

    PubSub ACK not received from FCA. App not launched in 30000 ms
