# RegisterProviderHandler 

## Overview

RegisterProviderHandler is invoked when the task specified in the intent has the value "registerProviderHandler". This handler helps to inform FCA to use test Providers instead of the actual provider files. Test provider can be used to manipulate the different values to be returned for api's like keyboard, profile which requires a user input. Test provider will manage any provider that has refui.

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
| task              | "registerProviderHandler"- It is a static value and should not be changed for this handler      | Y         |
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

#### Use case - Requirement is to return abc@gmail.com for keyboard.email api

* Register for the Keyboard Test Provider by sending the below intent - src/providers/KeyboardUIProviderTest.js
*  
```json

    {
        "action": "search",
        "data": {
            "query": {
                "task": "registerProviderHandler",
                "params": {
                    "provider": "keyboard",
                    "params": []
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }

```
* Set the response for keyboard.email using the SetApiResponseHandler by sending the below intent
*   
```json

    {
        "action": "search",
        "data": {
            "query": {
                "task": "setApiResponse",
                "params": {
                    "apiResponse": {
                        "module": "keyboard",
                        "methodName": "keyboard.email",
                        "type": "method",
                        "attributes": [
                            {
                                "ApiText": "abc@gmail.com",
                                "isCancelled": false,
                                "withUi": false,
                                "result": "john@doe.com"
                            }
                        ]
                    }
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }

```
* Call Keyboard.email api from UI .
* With the intents sent to RegisterProviderHandler and SetApiResponseHandler , keyboard.email will return abc@gmail.com
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
