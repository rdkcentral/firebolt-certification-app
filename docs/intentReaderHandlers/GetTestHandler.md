# GetTestHandler 

## Overview

Handler that fetches mochawesome report from FCA. An additional parameter as jobId is added to params field in the payload.This handler intent is identified with field as task and value as "getTest" along with jobId as param in the payload.There are few optional parameters like action,appType.

It performs the following actions :
1. Parse the input message received to get the jobId.
2. Fetch the mochawesome report
3. Send the response back to the IntentReader

## Usage

```json
{
            "action": "search",
            "data": {
                "query": "{\"task\":\"getTest\",\"params\":{\"jobId\":<jobId>},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }
```

### Parameters

| Key               | Description                                                                   | Required? |
|-------------------|-------------------------------------------------------------------------------|-----------|
| task              | "getTest"- Its a static value and should not be changed for this handler      | Y         |
| params            | Required jobId params for the intent. Here, "jobId" is a mandatory parameter  | Y         |
| appType           | Corresponding intent is launching on which app                                | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

	{
            "action": "search",
            "data": {
                "query": "{\"task\":\"getTest\",\"params\":{\"jobId\":\"85e5d9c7-420c-4272-96ca-3616ced55564\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response </summary>
</details>

            Report generated.

### Invalid Intent and Response
### Empty JobId
<details>
    <summary>Request when we are not able to generate report ,that is jobId is not passed and isReportGenerated is "false"  </summary>
</details>
    
            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"getTest\",\"params\":{\"jobId\":\"\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response  </summary>
</details>

            Report not generated from firebolt
