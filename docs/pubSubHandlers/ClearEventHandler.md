# ClearEventHandler 

Handler used to clear event Listener.This handler is invoked to clear a single event at a time.This handler intent is identified with field as task and value as "clearEventHandler" alone with the event name which need to clear from the test in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"clearEventHandler\",\"params\":{\"event\":\"advertising.onPolicyChanged\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

- Sample Response

                true
            

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"clearEventHandler","params":{"event":"advertising.onPolicyChanged"}"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we are not passing event name
- Sample error intent 
    
            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"clearEventHandler\",\"params\":{\"event\":\"\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }
- Sample response

        false
