# ClearEventListeners

This handler will clear the eventListeners and the event hsitory for the listener as a part of FCA.This handler is invoked to clear all the event listeners at a time.Once all event listeners are cleared it will not left with any history of event listeners were been used too.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"clearAllListeners\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample Response 

        Cleared Listeners

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"clearAllListeners","appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If no event name passed
- Sample error intent 
        
        {
            "method": "clearAllListeners",
            "params": {
                "event": "/",
                "params": []
            }
        }


- Sample response
            
            {
                "accessibility.onClosedCaptionsSettingsChanged-473": null
            }
