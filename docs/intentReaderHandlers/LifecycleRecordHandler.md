# LifecycleRecordHandler

## Overview

This handler is invoked to record the lifecycle history of each test cases. There are two stage of lifecycleRecordHandler. They are startLifecycleRecording and stopLifecycleRecording.

**`StartLifecycleRecording`** - This handler is invoked once a lifecycle state is fetched. This handler intent is identified with field as task and value as "startLifecycleRecording" in the payload.

**`StopLifecycleRecording`** - This handler is invoked once a recording is started and it needs to stop for the identification of the current lifecycle state. This handler is used to stop the recording of the lifecycle history. This handler intent is identified with field as task and value as "stopLifecycleRecording" in the payload.

It performs the following actions :
1. Parse the input message received to get the appId.
2. Start/Stop the lifecycle recording 
3. Save the response/error and perform schema validations. More about schema validations here : [validation documentation](../Validations.md).
4. Format the result and send the response back to the IntentReader

## Usage
* Request for startLifecycleRecording
```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "startLifecycleRecording",
                "params": {
                    "appId": "<appId>",
                    "params": []
                },
                "action": "NA",
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

* Request for stopLifecycleRecording
```json
{
    "action": "search",
    "data": {
        "query": {
            "task": "stopLifecycleRecording",
            "params": {
                "appId": "<appId>",
                "params": []
            },
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

| Key      | Description                                                                                                       | Required? |
|----------|-------------------------------------------------------------------------------------------------------------------|-----------|
| task     | "startLifecycleRecording / stopLifecycleRecording"- Its a static value and should not be changed for this handler | Y         |
| params   | Required appId params for  the intent. Here, "appId" is a mandatory parameter                                     | Y         |
| appType  | Corresponding intent is launching on which app                                                                    | Y         |

* Response

```json
        {
            "appId": "<appId>",
            "history": [
                {
                    "event": {
                        "previous": "<lifecycle-previous-state>",
                        "state": "<lifecycle-next-state>"
                    },
                    "timestamp": 1682067435630
                },
                {
                    "event": {
                        "previous": "<lifecycle-previous-state>d",
                        "state": "<lifecycle-next-state>"
                    },
                    "timestamp": 1682067438820
                }
            ]
        }

```

### Parameters

| Key      | Description                                                        |
|----------|--------------------------------------------------------------------|
| appId     | The appId whose lifecycle state is recorded                       |
| history   | An array of lifecycle events and states                           | 


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