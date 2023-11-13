# SetApiResponseHandler 

## Overview

This handler is invoked to assign the response value to an environment variable in FCA.This handler intent is identified with field as task and value as "setApiResponse" alone with the apiResponse in the param field of the payload.

## Usage
* This handler is invoked to assign the response value to an environment variable in FCA

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"setApiResponse\",\"params\":{\"apiResponse\":{\"module\":\"keyboard\",\"methodName\":\"keyboard.email\",\"type\":\"method\",\"attributes\":[{\"ApiText\":\"john@doe.com\",\"isCancelled\":false,\"withUi\":false,\"result\":\"john@doe.com\"}]}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
```
### Parameters

| Key                   | Description                                       | Required? |
|-----------------------|-------------------------------------------------- |-----------|
| setApiResponse        | corresponding intent for the task                 | Y         |
| params                | required event params for the intent              | Y         |
| appType               | corresponding intent is launching on which app    | Y         |

## Examples
### Valid Intent and Response

<details>
    <summary>Request</summary>
</details>

{
  "action": "search",
  "data": {
    "query": "{\"task\":\"setApiResponse\",\"params\":{\"apiResponse\":{\"module\":\"keyboard\",\"methodName\":\"keyboard.email\",\"type\":\"method\",\"attributes\":[{\"ApiText\":\"john@doe.com\",\"isCancelled\":false,\"withUi\":false,\"result\":\"john@doe.com\"}]}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
  },
  "context": {
    "source": "device"
  }
}

<details>
    <summary> Response </summary>
</details>

            "Received ApiResponse parameters"

### Invalid Intent and Response

<details>
    <summary>Request if we pass invalid parameter </summary>
</details>
    
        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"setApiResponse\",\"params\":{\"apiResponse\":{\"module\":\"federatedData\",\"methodName\":\"content.purchases\",\"type\":\"error\",\"attributes\":[{\"scenario\":false,\"purchasedContentTestCase\":\"PURCHASEDCONTENT_WAYSTOWATCH_WITHOUT_IDENTIFIERS\",\"error\":{\"code\":-32400,\"message\":\"Invalid params\"}}]}},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

<details>
    <summary> Response </summary>
</details>

        Received ApiResponse parameters