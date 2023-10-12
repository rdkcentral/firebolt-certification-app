# GetPubSubStatusHandler

Handler that check the status of PubSub connection in FCA.This handler intent is identified with task parameter as "getPubSubStatus" is the mandatory parameter.There are few optional parameters like action,appType.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

        {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

- Sample Response

        [
            true,
            null
        ]


- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"getPubSubStatus","appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we are not able to connect to PubSub 
- Sample error intent 
    
            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"getPubSubStatus\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }


- Sample response

            PubSub ACK not received from FCA. App not launched in 30000 ms
