# RegisterProviderHandler 
This handler is invoked to trigger the provider.This handler is triggered once an entity that provides services to another/external party.This handler intent is identified with field as task and value as "registerProviderHandler" alone with the provider name in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"keyboard\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

- Sample Response 
            
            "Keyboard provider registered successfully"

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"registerProviderHandler","params":{"provider":"keyboard","params":[]},"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we pass invalid provider name.
- Sample error intent 

            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"testing\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

- Sample response

            No provider has been specified...
