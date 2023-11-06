# RegisterEventHandler 

Handler used to register the event in FCA.This handler intent is identified with field as task and value as "registerEvent" alone with the event name in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)
* [Intent for a Not Supported Event](#intent-for-a-not-supported-event)

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

## Intent for a Not Supported Event

- Sample Intent - Here, if there is a key *isNotSupportedApi* with value *true* in the intent received, that event registration response will be validated against errorSchema. Detailed information on sending intent is given [here](docs/pubSubHandlers/RegisterEventHandler.md).
    ```
    {
	    "task":"registerEvent",
	    "params":{
		    "method":"eventName",
		    "methodParams":{"key":"value"}
	    },
	    "isNotSupportedApi":true,
    }
    ```
    TODO - More details to be added