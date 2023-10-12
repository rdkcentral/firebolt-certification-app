# SetApiResponseHandler 

This handler is invoked to assign the response value to an environment variable in FCA.This handler intent is identified with field as task and value as "setApiResponse" alone with the apiResponse in the param field of the payload.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"setApiResponse\",\"params\":{\"apiResponse\":{\"module\":\"keyboard\",\"methodName\":\"keyboard.email\",\"type\":\"method\",\"attributes\":[{\"ApiText\":\"john@doe.com\",\"isCancelled\":false,\"withUi\":false,\"result\":\"john@doe.com\"}]}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }


- Sample Response 

            "Received ApiResponse parameters"

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"setApiResponse","params":{"apiResponse":{"module":"keyboard","methodName":"keyboard.email","type":"method","attributes":[{"ApiText":"john@doe.com","isCancelled":false,"withUi":false,"result":"john@doe.com"}]}},"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we pass invalid parameter.
- Sample error intent 


        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"setApiResponse\",\"params\":{\"apiResponse\":{\"module\":\"federatedData\",\"methodName\":\"content.purchases\",\"type\":\"error\",\"attributes\":[{\"scenario\":false,\"purchasedContentTestCase\":\"PURCHASEDCONTENT_WAYSTOWATCH_WITHOUT_IDENTIFIERS\",\"error\":{\"code\":-32400,\"message\":\"Invalid params\"}}]}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample response

        Received ApiResponse parameters
