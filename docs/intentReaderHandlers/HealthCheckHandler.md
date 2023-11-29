# HealthCheckHandler 

## Overview

HealthCheckHandler is invoked when the task specified in the intent has the value "healthCheck". This handler is responsible for sending the healthCheck command and validating whether FCA is launched as a 3rd party app or not

It performs the following actions :
1. Parse the input message received.
2. Confirm the healthCheck status. 
3. Save the response/error.
4. Format the result and send the response back to IntentReader.

## Usage

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "healthCheck",
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

| Key               | Description                                                                       | Required? |
|-------------------|-----------------------------------------------------------------------------------|-----------|
| task              | "healthCheck"- Its a static value and should not be changed for this handler      | Y         |
| appType           | Corresponding intent is launching on which app                                    | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

{
    "action": "search",
    "data": {
        "query": {
            "task": "healthCheck",
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

            OK


### Invalid Intent and Response

<details>
    <summary>Request when we are sending healthCheck command but FCA third party not launched  </summary>
</details>
 
    {
        "action": "search",
            "data": {
                "query": {
                    "task": "healthCheck",
                    "action": "NA",
                    "appType": "firebolt"
                }
            },
            "context": {
                "source": "device"
            }
    }

<details>
    <summary> Response  </summary>
</details>

            false
