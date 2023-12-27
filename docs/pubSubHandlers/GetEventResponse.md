# GetEventResponse

Handler used to get event response after triggering each event.The response is fetch only after the event is triggered.This handler intent is identified with field as task and value as "getEventResponse" alone with the event name for which response need to fetch in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"getEventResponse\",\"params\":{\"event\":\"advertising.onPolicyChanged-8\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

- Sample Response

                {
                "eventName": "navigateTo",
                "eventListenerId": "discovery.onNavigateTo-7",
                "eventResponse": {
                    "action": "home",
                    "context": {
                        "source": "voice"
                    }
                },
                "eventSchemaResult": {
                    "status": "PASS",
                    "eventSchemaResult": []
                },
                "eventTime": "2023-04-26T12:09:35.910Z"
            }

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"getEventResponse","params":{"event":"advertising.onPolicyChanged-8"}"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If no event name is passed
- Sample error intent 
    
            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"getEventResponse\",\"params\":{\"event\":\"\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

- Sample response

            {
                "": null
            }

 
