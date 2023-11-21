# RegisterProviderHandler 

## Overview

This handler is invoked to trigger the provider.This handler is triggered once an entity provides services to another/external party.This handler intent is identified with field as task and value as "registerProviderHandler" alone with the provider name in the param field of the payload.

It performs the following actions :
1. Parse the input message received to get the provider.
2. Trigger the provider passed in params
3. Save the response/error and perform schema validations. More about schema validations here : [validation documentation](../Validations.md).
4. Format the result and send the response back to the IntentReader

## Usage

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerProviderHandler",
                "params": {
                    "provider": "<providerName>",
                    "params": []
                },
                "action": "NA",
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

### Parameters

| Key               | Description                                                                                   | Required? |
|-------------------|-----------------------------------------------------------------------------------------------|-----------|
| task              | "registerProviderHandler"- Its a static value and should not be changed for this handler      | Y         |
| params            | Required provider params for  the intent. Here, "provider" is a mandatory parameter           | Y         |
| appType           | Corresponding intent is launching on which app                                                | Y         |

## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"keyboard\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

<details>
    <summary> Response </summary>
</details>
            
            "Keyboard provider registered successfully"

### Invalid Intent and Response
### Invalid Provider Name
<details>
    <summary>Request when we pass invalid provider name </summary>
</details>

            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"testing\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

<details>
    <summary> Response </summary>
</details>

            Provider registeration failed

### Empty Provider Name
<details>
    <summary>Request when we pass invalid provider name </summary>
</details>

            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

<details>
    <summary> Response </summary>
</details>

            Provider registeration failed
