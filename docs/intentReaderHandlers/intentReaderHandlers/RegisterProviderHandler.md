# RegisterProviderHandler 

## Overview

This handler is invoked to trigger the provider.This handler is triggered once an entity provides services to another/external party.This handler intent is identified with field as task and value as "registerProviderHandler" alone with the provider name in the param field of the payload.
## Usage

```json
{
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"registerProviderHandler\",\"params\":{\"provider\":\"<providerName>\",\"params\":[]},\"action\":\"NA\",\"appType\":\"firebolt\"}"
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
| params            | required provider params for  the intent                                                      | Y         |
| appType           | corresponding intent is launching on which app                                                | Y         |

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
    <summary>Request if we pass invalid provider name </summary>
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
    <summary>Request if we pass invalid provider name </summary>
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
