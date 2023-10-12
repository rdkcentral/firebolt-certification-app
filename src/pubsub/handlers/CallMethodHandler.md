# CallMethodHandler 

Handler used to invoke the api and return the response along with schema validation result in FCA. In each test call method handler is used,to invoke all the method required to get the response as per the schema defined.This handler intent is identified with field as task and value as "callMethod" alone with the method this handler going to call in the param field of the payload.In this payload an another field called communicationMode is passed to tell the FCA,from which mode this method should be invoked.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

- Sample Intent
		
        {
			"action": "search",
			"data": {
				"query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"device.version\",\"methodParams\":{}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
			},
			"context": {
				"source": "device"
			}
		}

- Sample Response with empty params
        
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

- Sample Response with params

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

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"callMethod","params":{"method":"device.version"},"context":{"communicationMode":"SDK"},"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: {"params":{"methodParams":{}},"action":"NA"}}

## Invalid Intent and Response

- Scenario 1:  If we pass invalid method params
- Sample error intent 
                
                {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"authentication.token\",\"methodParams\":{\"type\":\"platform1\"}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                    }
                }
- Sample response
            
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



- Scenario 2 :  If we pass invalid method name
- Sample error intent 
            
            {
                "action": "search",
                "data": {
                    "query": "{\"task\":\"callMethod\",\"params\":{\"method\":\"keyboardtesting.email\",\"methodParams\":{\"type\":\"signIn\",\"message\":\"Enter your email to sign into this app\"}},\"action\":\"NA\",\"context\":{\"communicationMode\":\"SDK\"},\"appType\":\"firebolt\"}"
                },
                "context": {
                    "source": "device"
                }
            }

- Sample response

            {
                "method": "callMethod",
                "params": [
                    "signIn",
                    "Enter your email to sign into this app"
                ],
                "responseCode": 1,
                "apiResponse": {
                    "result": null,
                    "error": {}
                },
                "schemaValidationStatus": "FAIL",
                "schemaValidationResponse": {
                    "instance": {},
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
                    "errors": [
                        {
                            "path": [],
                            "property": "instance",
                            "message": "requires property \"code\"",
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
                            "instance": {},
                            "name": "required",
                            "argument": "code",
                            "stack": "instance requires property \"code\""
                        }
                    ],
                    "disableFormat": false
                }
            }
