# CallMethodHandler 

## Oveview
 
CallMethodHandler is invoked when the task specified in the intent has the value "callMethod". This handler is used to make FIREBOLT API calls to the device and perform schema validation on the response. More about schema validation [here.](../Validations.md#schema-validation)

It performs the following actions:
1. Parses the input message received to fetch the API name and the parameters required.
2. Calls the API with the parameters required for the API call.
3. Saves the API response or error and performs schema validation.
4. Formats the result and sends the response back to IntentReader.
## Usage

### Request Format
```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "callMethod",
                "params": {
                    "method": "<methodName>",
                    "methodParams": {}
                },
                "action": "NA",
                "context": {
                    "communicationMode": "<mode>"
                },
                "isNotSupportedApi": false,
                "appType": "<appType>"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

#### Parameters

| Key                       | Description                                                                                			| Required? |
|---------------------------|-------------------------------------------------------------------------------------------------------|-----------|
| task                      | "callMethod"- Its a static value and should not be changed for this handler                			| Y         |
| params                    | Required params for call method intent. Here, "method" and "methodParams" are mandatory fields        | Y         |
| appType                   | Corresponding intent is launching on which app                                             			| Y         |    
| communicationMode         | It indicates whether the test is run on transport or sdk mode mode.                                   | optional  |
| isNotSupportedApi         | It indicates whether the passed API is supported or not by the platform.                              | optional  |


* Response Format
```json
{
    "method": "callMethod",
    "params": [],
    "responseCode": 0,
    "apiResponse": {
        "result": "<value>",
        "error": null
    },
    "schemaValidationStatus": "PASS",
    "schemaValidationResponse": {
        "instance": "<value>",
        "schema": {
            "type": "string"
        },
        "options": {},
        "path": [],
        "propertyPath": "instance",
        "errors": [],
        "disableFormat": false
    }
}

```
### Parameters

| Key                       | Description                                                                                			                                      |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| method                    | The name of method we are invoking                			                                                                              |
| params                    | The params we passed for invoking the APIs                                                                                                  |
| responseCode              | The responseCode can be 0,1,2 or 3, which indicates whether the request successful or not. 0-PASS, 1-FAIL, 2-SKIPPED, 3- PENDING            |    
| apiResponse               | The apiResponse field reflects the response of the API we invoked. It contains "result" and "error" as the inner fields                     |    
| result                    | The inner field "result" contains a successful response if FCA receives a response from the device.                                         |    
| error                     | The inner field "error" contains a failure response if FCA receives an error from the device.                                               |    
| schemaValidationStatus    | Indicates whether schema validation is PASS/FAIL.                                            	                                              |    
| schemaValidationResponse  | Contains the result of schema validation.                                            	                                                      |    


## Examples

### Valid Intent and Response

<details>
    <summary>Request with Empty methodParams</summary>
</details>

    {
			"action": "search",
			"data": {
				"query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"device.version\",\"methodParams\":{}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
			},
			"context": {
				"source": "device"
			}
		}


<details>
    <summary>Response With Empty Params</summary>
</details>

    {
                "method": "callMethod",
                "params": [],
                "responseCode": 0,
                "apiResponse": {
                    "result": "<value>",
                    "error": null
                },
                "schemaValidationStatus": "PASS",
                "schemaValidationResponse": {
                    "instance": "<value>",
                    "schema": {
                        "type": "string"
                    },
                    "options": {},
                    "path": [],
                    "propertyPath": "instance",
                    "errors": [],
                    "disableFormat": false
                }
            }
----------------------------------------------------------------------------------------------------------------------
<details>
    <summary>Request with valid methodParams</summary>
</details>

    {
			"action": "search",
			"data": {
				"query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"keyboard.email\",\"methodParams\":{ "type": "signIn", "message": "Enter your email to sign into this app"}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
			},
			"context": {
				"source": "device"
			}
		}


<details>
    <summary>Response With Params</summary>
</details>      

        {
            "method": "callMethod",
            "params": [
                "signIn",
                "Enter your email to sign into this app"
            ],
            "responseCode": 0,
            "apiResponse": {
                "result": "<email>",
                "error": null
            },
            "schemaValidationStatus": "PASS",
            "schemaValidationResponse": {
                "instance": "<email>",
                "schema": {
                    "type": "string"
                },
                "options": {},
                "path": [],
                "propertyPath": "instance",
                "errors": [],
                "disableFormat": false
            }
        }

----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary>Request with invalid methodParams (invalid type passed)</summary>
</details>

    {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"<methodName>\",\"methodParams\":{\"type\":\"platform1\"}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }

<details>
    <summary>Response with unknown variant error</summary>
</details>    

            {
                "method": "callMethod",
                "params": [
                    "platform1"
                ],
                "responseCode": 0,
                "apiResponse": {
                    "result": null,
                    "error": {
                        "code": -32602,
                        "message": "unknown variant `platform1`, expected one of `platform`, `device`, `distributor`, `root` at line 1 column 19"
                    }
                },
                "schemaValidationStatus": "PASS",
                "schemaValidationResponse": {
                    "instance": {
                        "code": -32602,
                        "message": "unknown variant `platform1`, expected one of `platform`, `device`, `distributor`, `root` at line 1 column 19"
                    },
                    "schema": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "number"
                            },
                            "message": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "code",
                            "message"
                        ]
                    },
                    "options": {},
                    "path": [],
                    "propertyPath": "instance",
                    "errors": [],
                    "disableFormat": false
                }
            }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request with invalid method name</summary>
</details>

    {
            "action": "search",
                "data": {
                    "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"<Invalid methodName>\",\"methodParams\":\"\"},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                 }
    }

<details>
    <summary>Response</summary>
</details>  

    {
        "result": null,
        "error": {
            "code": -32601,
            "message": "Wrong Method Name"
        }
    }

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request with empty method name</summary>
</details>

    {
            "action": "search",
                "data": {
                    "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"\",\"methodParams\":\"\"},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                 }
    }

<details>
    <summary>Response</summary>
</details>  

    {
        "responseCode": 1,
        "error": {
            "message": "FCA in exception block: undefined is not an object (evaluating 'method.includes')",
            "code": "FCAError"
        }
    }
    
----------------------------------------------------------------------------------------------------------------------

### Intent for a Not Supported API

If the intent has "isNotSupportedApi" = true, it indicates that the API is not implemented on the platform, and we are expecting an error for the same. The error response will be validated against errorSchema instead of the openRpc schema, and the response will be returned.

<details>
    <summary>Request with isNotSupportedApi true for a supported API</summary>
</details>

    {
        "action": "search",
            "data": {
                "query": {
                    "task": "callMethod",
                    "params": {
                        "method":"accessibility.closedCaptionsSettings",
                        "methodParams":{
                            "key":"value"
                        }
                    },
                    "isNotSupportedApi":true,
                    "action": "NA",
                    "appType": "firebolt"
                }
            },
            "context": {
                "source": "device"
            }
    }

<details>
    <summary>Response</summary>
</details>

    {
    "method": "callMethod",
    "params": [],
    "responseCode": 0,
    "apiResponse": {
        "result": "<value>",
        "error": null
    },
    "schemaValidationStatus": "FAIL",
    "schemaValidationResponse": {
        "instance": "<value>",
        "schema": {
            "type": "string"
        },
        "options": {},
        "path": [],
        "propertyPath": "instance",
        "errors": [],
        "disableFormat": false
    }
}


- API response is validated against errorSchema.
- Schema validation Check: FAIL. 

----------------------------------------------------------------------------------------------------------------------

<details>
    <summary>Request with isNotSupportedApi true for a not supported api</summary>
</details>

        {
        "action": "search",
            "data": {
                "query": {
                    "task": "callMethod",
                    "params": {
                        "method":"authentication.token",
                        "methodParams":{
                            "type":"distributor"
                        }
                    },
                    "isNotSupportedApi":true,
                    "action": "NA",
                    "appType": "firebolt"
                }
            },
            "context": {
                "source": "device"
            }
    }

<details>
    <summary>Response</summary>
</details>

    {
        "result": null,
        "error": {
            "code": -50100,
            "message": "capability xrn:firebolt:capability:token:session is not supported"
        }
    }