# External Test Data Inside FCA

External test data is used within two functions in the `firebolt-certification-app` repository. Those functions can both be found in `/src/utils/Utils.js`.

### censorData()

The first function `censorData()` is responsible for hiding sensitive information withing the application. It takes two parameters: `methodName` (the name of the method) and `response` (the response of the method that needs to be masked). Inside the function, it loads a JSON file named "censorData.json" from `/plugins/external-test-data`. This file is expected to contain information about the fields that need to be censored for different methods. If the JSON file is successfully loaded and the methodName exists as a key in the JSON object, the function proceeds to iterate over the fields defined for that method. For each field, it checks if the field exists in the response object. If it does, it replaces the characters within the field's value with asterisks (\*), effectively censoring the sensitive information.Additionally, there is a special case where if the field is an empty string and the response is a string, it replaces the characters within the response string itself with asterisks. If any errors occur during the process of loading the JSON file or accessing the fields, an error message is logged using a logger.error function. Finally, the modified response is returned from the function.

In summary, the censorData function reads a JSON file that defines which fields in the response of a specific method need to be censored. It then applies the censoring by replacing the sensitive information with asterisks and returns the modified response.

Below is a sample `censorData.json` file.

```
{
  "methodName": {
    "field": ["value"]
  }
}
```

### testDataHandler()

The second function, `testDataHandler()`, is responsible for fetching and parsing parameters or content from external-test-data. It takes two parameters: `requestType` and `dataIdentifier`. If the requestType is "param", it logs an informational message indicating that params are not currently used by FCA, and then returns without performing any further actions. If the requestType is "content", it proceeds to fetch the corresponding module's data from the external-test-data. The dataIdentifier parameter is converted to lowercase and used to determine the module's name. It attempts to import the JSON file located at ../../plugins/external-test-data/fixtures/modules/${moduleName}.json, where moduleName is derived from the dataIdentifier. The imported module's data is then evaluated, stringified, and parsed back into a JavaScript object. If the parsed data exists, it is returned from the function. If the parsed data is not found or any errors occur during the process, an error message is logged using a logger.error function. If the requestType is neither "param" nor "content", the function throws an error.

Below is a sample external-test-data module:

```
{
    "MODULE_1": {
        "property1": "value1",
        "property2": "value2"
    },
    "MODULE_2": {
        "property1": "value1",
        "property2": "value2"
    },
    "MODULE_3": {
        "property1": "value1",
        "property2": "value2"
    },
    "MODULE_4": {
        "property1": "value1",
        "property2": "value2"
    },
    "MODULE_5": {
        "property1": "value1",
        "property2": "value2"
    }
}
```
