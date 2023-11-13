# CallMethodHandler 

## Oveview

Handler used to invoke the api and return the response along with schema validation result in FCA. In each test call methodhandler is used to invoke all the method required to get the response as per the schema defined.This handler intent is identified with field as task and value as "callMethod" along with the method this handler going to call in the param field of the payload. In this payload another field called communicationMode is passed to tell the FCA,from which mode this method should be invoked.

## Usage
* This handler is used to invoke all the methods required to get the response as per the predefined schema.

```json
{
			"action": "search",
			"data": {
				"query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"device.version\",\"methodParams\":{}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
			},
			"context": {
				"source": "device"
			}
		}
```

### Parameters

| Key               | Description                                      | Required? |
|-------------------|--------------------------------------------------|-----------|
| callMethod        | corresponding intent for the task                | Y         |
| params            | required params for call method intent           | Y         |
| appType           | corresponding intent is launching on which app   | Y         |
    


## Examples

### Valid Intent and Response

<details>
    <summary>Sample Request</summary>
</details>

    {
			"action": "search",
			"data": {
				"query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"<methodName>\",\"methodParams\":{}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
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
                    "result": "4300568572992702016",
                    "error": null
                },
                "schemaValidationStatus": "PASS",
                "schemaValidationResponse": {
                    "instance": "4300568572992702016",
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
                "result": "john@doe.com",
                "error": null
            },
            "schemaValidationStatus": "PASS",
            "schemaValidationResponse": {
                "instance": "john@doe.com",
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


### Invalid Intent and Response

<details>
    <summary>Request with invalid method params</summary>
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
    undefined
    
<details>
    <summary>Request with empty methodParams for setters</summary>
</details>

    {
            "action": "search",
                "data": {
                    "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"<setMethodName>\",\"methodParams\":\"\"},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                 }
    }

<details>
    <summary>Response</summary>
</details>  
 - Returns the default value
    {
        "result": false,
        "error": null
    }
 
## Intent for a Not Supported API

- Sample Intent - Here, if there is a key *isNotSupportedApi* with value *true* in the intent received, that api responsewill be validated against errorSchema.

<details>
    <summary>Request with isNotSupportedApi true</summary>
</details>
    {
	    "task":"callMethod",
	    "params":{
		    "method":"APIName",
		    "methodParams":{"key":"value"}
	    },
	    "isNotSupportedApi":true,
    }