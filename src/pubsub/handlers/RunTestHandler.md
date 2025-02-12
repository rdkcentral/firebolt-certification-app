# RunTestHandler 

Handler that trigger a test in FCA.This handler run on each test case. Additional test parameters can be added to params field in payload.
For example if we are runing an test suite an array of method parameters are passed in param field of the payload.While in a single test run only the required method is passed.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## SLA Validation

### Overview

There are some additional checks that can be performed to validate the API response time. The maximum expected api execution time can be passed to FCA via intent using the field `globalSLA`. FCA uses this to compare against the actual api execution time in milliseconds. If no `globalSLA` is passed to FCA, sla-validation is skipped and testcase fails showing appropriate error message.

### Objective

To compare API execution time of each API with respect to maximum expected api execution time passed via intent

### Execution

To perform sla-validation, `sla-validation` flag needs to be set to true and passed in intent. Default value is false if not passed.

## Valid Intent and Response

- Sample Intent of single test

            {
                    "action": "search",
                    "data": {
                        "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"lifecycle.close\",\"methodParams\":\"userExit\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
                    },
                    "context": {
                        "source": "device"
                }
            }

- Sample Response

        {
            "result": null,
            "error": null,
            "schemaResult": {
                "status": "PASS",
                "schemaValidationResult": {
                    "instance": null,
                    "schema": {
                        "const": null
                    },
                    "options": {},
                    "path": [],
                    "propertyPath": "instance",
                    "errors": [],
                    "disableFormat": false
                }
            }
        }



- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"runTest","params":{"methodName":"lifecycle.close}"appType":"firebolt",action":"CORE","context":{"communicationMode":"SDK"}}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: {"params": {"certification":true,"exceptionMethods": [{{"method":"authentication.token","param":{"type":"distributor"}},"options":{"clientId":"your-client"}},.......],"methodsToBeExcluded":["accessory.pair",...],"modulesToBeExcluded":["keyboard",....],"metadata": {"target":"your-Target-device","targetVersion":"1c238a16","fireboltVersion":"0.10.0","deviceModel":"your-device-model","devicePartner":"your-device-Partner","fbVersion":"0.10.0","sla-validation":true,"globalSLA":20}}}}

## Invalid Intent and Response

- Scenario 1: If we pass invalid parameter.
- Sample error intent 

        {
            "action": "search",
            "data": {
                "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"lifecycle.close\",\"methodParams\":\"error\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Scenario 2: If we pass invalid lifecycle method.
- Sample error intent 

            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"runTest\",\"params\":{\"mode\":\"Lifecycle.validation\",\"methodName\":\"lifecycle.close\",\"methodParams\":\"userExit\"},\"context\":{\"communicationMode\":\"Lifecycle.validation\"},\"action\":\"Lifecycle.validation\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample response

            Invalid lifecycle method passed

