# LifecycleRecordHandler

## Overview

This handler is invoked to record the lifecycle history of each test cases.There are two stage of lifecycleRecordHandler.
They are startLifecycleRecording and stopLifecycleRecording.

**`StartLifecycleRecording`** - This handler is invoked once a lifecycle state is fetched.This handler intent is identified with field as task and value as "startLifecycleRecording" in the payload.

**`StopLifecycleRecording`** - This handler is invoked once a recording is started it need to stop for the identification of the current lifecycle state.This handler is used to stop the recording of the lifecycle history.This handler intent is identified with field as task and value as "stopLifecycleRecording" in the payload.

## Usage

```json
	{
    "action": "search",
    "data": {
        "query": "{\"task\":\"startLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUI\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
    },
    "context": {
        "source": "device"
    }
}
```
### Parameters

| Key      | Description                                                                                                       | Required? |
|----------|-------------------------------------------------------------------------------------------------------------------|-----------|
| task     | "startLifecycleRecording / stopLifecycleRecording"- Its a static value and should not be changed for this handler | Y         |
| params   | required appId params for  the intent                                                                             | Y         |
| appType  | corresponding intent is launching on which app                                                                    | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request of startLifecycleRecording </summary>
</details>

	{
    "action": "search",
    "data": {
        "query": "{\"task\":\"startLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUI\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
    },
    "context": {
        "source": "device"
    }
}

<details>
    <summary> Request of stopLifecycleRecording </summary>
</details>

	{
            "action": "search",
            "data": {
                "query": "{\"task\":\"stopLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUI\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response </summary>
</details>

        {
            "appId": "your-generic-appid",
            "history": [
                {
                    "event": {
                        "previous": "foreground",
                        "state": "background"
                    },
                    "timestamp": 1682067435630
                },
                {
                    "event": {
                        "previous": "background",
                        "state": "foreground"
                    },
                    "timestamp": 1682067438820
                }
            ]
        }

### Invalid Intent and Response

<details>
    <summary>Request if we pass invalid appID for startLifecycleRecording </summary>
</details>

            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"startLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUIs\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary>Request error Intent of stopLifecycleRecordin </summary>
</details>

            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"stopLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUIs\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }


<details>
    <summary> Response  </summary>
</details>

            AppId fireboltCertificationSystemUIs passed does not match launched app "your-generic-appid".