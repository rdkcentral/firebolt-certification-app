# FCA: Validations

FCA has the ability to make firebolt api calls to the device when it's launched. FCA supports Schema Validation which can be used to validate that a firebolt api response is adhering to the firebolt open rpc schema.

## Table of Contents

- [Schema Validation](#schema-validation)

## Schema Validation

### Background
* JSON Schema is an [IETF](https://www.ietf.org/standards/) standard providing a format for JSON data. JSON Schema Validation asserts constraints on a JSON data based on the JSON schema structure. When FCA makes a firebolt api call to the device, Schema Validation is performed on the API response according to the firebolt open rpc document. Here, firebolt api response is the JSON data validated and firebolt open rpc document specifies the expected JSON schema structure. Based on whether the api response is adhering to the schema, validation result will be PASS/FAIL. 
* FCA uses the [JSON Schema Validator](https://www.npmjs.com/package/jsonschema) for performing Schema Validation


### SetUp

There is no extra setup required for Schema Validation. 
If there is a requirement to validate firebolt api response against a different open rpc, do the following
* Change the SDK version in [package.json](../package.json) against "@firebolt-js/manage-sdk": "0.17.1" and "@firebolt-js/sdk": "0.17.1", fields. For eg, to run on 0.9.0 SDK version, change the value to 0.9.0 in package.json
* Do npm install to reinstall dependencies
* npm start to start the application 
* Now, the FCA will be using 0.9.0 firebolt open rpc document


### Usage

* FCA is primarily used for making API calls for the following :
    - [Sanity test execution](Execution.md#sanity-test-execution) 
    - [Regression test execution](Execution.md#regression-test-execution)

* Example : Schema Validation against Firebolt open rpc schema
    -   Sample openRPC schema 

            ```
            {
                "name": "apiName",
                "params": [],
                "result": {
                    "name": "apiName",
                    "schema": {
                        "type": "string"
                    }
                }
            }
            ```
    -   Validation Result will be PASS if API Response is a string. eg - "1234".
    -   Validation Result will be FAIL if API Response is not a string. eg - {"id" : "1234"}.
* There is an exception where open rpc schema is not used to validate schema. Instead [errorSchema.json](../src/source/errorSchema.json) is used for validation. In case of a not supported api (An api maybe not supported according to the platform in which FCA is launched), we are expecting to get an error as response as the api is not supported by the platform. FCA identifies whether an api is not supported or not based on the intents received in [IntentReader](IntentReader.md). The 3 intents/instances where an api response is validated against errorSchema are listed below :
    - **Sanity test execution** - Here, if there is a field *exceptionMethods* in the intent received, responses of those api's will be validated against errorSchema. Detailed information on sending intent is given [here](intentReaderHandlers/RunTestHandler.md#passing-list-of-not-supported-apis-in-intent).
    - **Regression test execution for firebolt api call** - Here, if there is a key *isNotSupportedApi* with value *true* in the intent received, that api responsewill be validated against errorSchema. Detailed information on sending intent is given [here](intentReaderHandlers/CallMethodHandler.md#intent-for-a-not-supported-api).
    - **Regression test execution for firebolt event registration** - Here, if there is a key *isNotSupportedApi* with value *true* in the intent received, that event registration response will be validated against errorSchema. Detailed information on sending intent is given [here](intentReaderHandlers/RegisterEventHandler.md#intent-for-a-not-supported-event).

* Example : Schema Validation against Error schema
    -   Sample error schema 

            ```
            {
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
            ```
    -   Validation Result will be PASS if API Response is an object and has the fields code and message. eg - `{"code": -50100,"message": "api is not supported"}`. 
    -   Validation Result will be FAIL if API Response is not an object. eg - "1234".