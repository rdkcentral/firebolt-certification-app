# RegisterProviderHandler 

## Overview

RegisterProviderHandler is invoked when the task specified in the intent has the value "registerProviderHandler". This handler helps to inform FCA to use testProviders instead of the actual provider so that we can set the responses for different api's like keyboard, profile etc.

It performs the following actions:
1. Parses the input message received to get the provider.
2. Informs FCA to use testProviders for setting the responses.
3. Formats and sends the response back to the IntentReader.

## Usage

### Request Format

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

#### Parameters

| Key               | Description                                                                                   | Required? |
|-------------------|-----------------------------------------------------------------------------------------------|-----------|
| task              | "registerProviderHandler"- Its a static value and should not be changed for this handler      | Y         |
| params            | Required provider params for  the intent. Here, "provider" is a mandatory parameter           | Y         |
| appType           | Corresponding intent is launching on which app                                                | Y         |

### Response Format
* Response can be either "true" or an error response

```json
    true/Keyboard provider registered successfully
```
#### Parameters

| Key                         | Description                                                                  |
| --------------------------- | -----------------------------------------------------------------------------|
| true                        | It indicates whether the mochawesome report from FCA is fetched or not       |


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

----------------------------------------------------------------------------------------------------------------------


### Invalid Intent and Response

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

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request when we pass empty provider name </summary>
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
