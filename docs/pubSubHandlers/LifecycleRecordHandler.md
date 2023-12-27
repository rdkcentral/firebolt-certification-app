# LifecycleRecordHandler

This handler is invoked to record the lifecycle history of each test cases.There are two stage of lifecycleRecordHandler.
They are startLifecycleRecording and stopLifecycleRecording.

**`StartLifecycleRecording`** - This handler is invoked once a lifecycle state is fetched.This handler intent is identified with field as task and value as "startLifecycleRecording" in the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

Sample Intent of startLifecycleRecording

	{
    "action": "search",
    "data": {
        "query": "{\"task\":\"startLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUI\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
    },
    "context": {
        "source": "device"
    }
}


- StopLifecycleRecording - This handler is invoked once a recording is started it need to stop for the identification of the current lifecycle state.This handler is used to stop the recording of the lifecycle history.This handler intent is identified with field as task and value as "stopLifecycleRecording" in the payload.

Sample Intent of stopLifecycleRecording

	{
            "action": "search",
            "data": {
                "query": "{\"task\":\"stopLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUI\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

Sample Response with event

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


- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"startLifecycleRecording/stopLifecycleRecording","params":{"appId":"fireboltCertificationSystemUI","params":[]},"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we pass invalid appID
- Sample error Intent of startLifecycleRecording
    
            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"startLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUIs\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample error Intent of stopLifecycleRecording

            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"stopLifecycleRecording\",\"params\":{\"appId\":\"fireboltCertificationSystemUIs\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }


- Sample response

            AppId fireboltCertificationSystemUIs passed does not match launched app "your-generic-appid".