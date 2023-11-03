# RegisterEventHandler 

Handler used to register the event in FCA.This handler intent is identified with field as task and value as "registerEvent" alone with the event name in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent
            
            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerEvent\",\"params\":{\"event\":\"advertising.onPolicyChanged\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

- Sample Response

        {
            "eventName": "advertising.onPolicyChanged",
            "eventListenerId": "advertising.onPolicyChanged-146",
            "eventListenerResponse": {
                "listenerResponse": 146,
                "error": null
            },
            "eventListenerSchemaResult": {
                "status": "PASS",
                "eventSchemaResult": {}
            }
        }

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"registerEvent","params":{"event":"advertising.onPolicyChanged","params":[]}"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we pass invalid event name
- Sample error intent 
    
                {
            "eventName": "discovery.onNavigateTos",
            "eventListenerId": null,
            "responseCode": 3,
            "eventListenerResponse": {
                "result": null,
                "error": {
                    "code": -32601,
                    "message": "Method not found"
                }
            },
            "eventListenerSchemaResult": {
                "status": "FAIL",
                "eventSchemaResult": {}
            }
        }
