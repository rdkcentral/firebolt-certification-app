# HealthCheckHandler 

## Overview

HealthCheckHandler is invoked when the task specified in the intent has the value "healthCheck". This handler is used to check whether the FCA is successfully launched or not.

It performs the following actions:
1. Parses the input message received.
2. Confirms the status of FCA, i.e., whether it is launched or not.
3. Saves the response or error based on the status.
4. Formats and sends the response back to IntentReader.

## Usage

### Request Format

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

#### Parameters

| Key               | Description                                                                       | Required? |
|-------------------|-----------------------------------------------------------------------------------|-----------|
| task              | "healthCheck"- Its a static value and should not be changed for this handler      | Y         |
| appType           | Corresponding intent is launching on which app                                    | Y         |


### Response Format
* Response can be either "true" or an error response

```json
    true
```
#### Parameters

| Key                         | Description                                             |
| --------------------------- | --------------------------------------------------------|
| true                        | It indicates that the FCA is launched successfully      |
| error                       | It indicates that FCA is not launched successfully      |




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

           True/OK

----------------------------------------------------------------------------------------------------------------------

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
