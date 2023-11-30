# GetTestHandler 

## Overview

GetTestHandler is invoked when the task specified in the intent has the value "getTest". This handler is used to fetch mochawesome report from FCA.

It performs the following actions:
1. Parses the input message received to get the job ID.
2. Fetches the mochawesome report of the job ID received.
3. Sends the response back to the IntentReader.

## Usage

### Request Format

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": "<jobId>"
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

#### Parameters

| Key               | Description                                                                   | Required? |
|-------------------|-------------------------------------------------------------------------------|-----------|
| task              | "getTest"- Its a static value and should not be changed for this handler      | Y         |
| params            | Required job ID params for the intent. Here, "jobId" is a mandatory parameter  | Y         |
| appType           | Corresponding intent is launching on which app                                | Y         |


### Response Format
* Response can be either "true" or an error response

```json
    true
```
#### Parameters

| Key                         | Description                                                                  |
| --------------------------- | -----------------------------------------------------------------------------|
| true/null                   | It indicates whether the mochawesome report from FCA is fetched or not       |



## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": "85e5d9c......"
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

            True/Report generated.

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary> Empty JobId  </summary>
</details>
    
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": ""
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
    <summary> Response  </summary>
</details>

            Report not generated from firebolt
