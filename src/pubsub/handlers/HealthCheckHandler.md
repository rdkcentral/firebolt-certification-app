# HealthCheckHandler 

This handler is invoked once healthcheck is done.This handler is responsible for sending healthCheck command and validate FCA launched as 3rd party app or not.This handler intent is identified with field as task and value as "healthCheck" in the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"healthCheck\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
- Sample Response

            OK

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"healthCheck","appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we are sending healthCheck command but FCA third party not launched.
- Sample error intent 
    
        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"healthCheck\",\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample response

            false
