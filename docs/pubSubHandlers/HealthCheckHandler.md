# HealthCheckHandler 

## Overview

This handler is invoked once healthcheck is done.This handler is responsible for sending healthCheck command and validate whether FCA launched as 3rd party app or not.This handler intent is identified with field as task and value as "healthCheck" in the payload.

## Usage

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"healthCheck\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```

### Parameters

| Key               | Description                                       | Required? |
|-------------------|---------------------------------------------------|-----------|
| healthCheck       | corresponding intent for the task                 | Y         |
| appType           | corresponding intent is launching on which app    | Y         |

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
