# External Test Data

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

The `firebolt-certification-app` repository utilizes external test data to handle and manipulate response data in two distinct ways. Both of these methods are facilitated by functions located in `/src/utils/Utils.js`.

1. Data Censoring: `censorData()`
This function is integral for ensuring data privacy within the application. It takes two parameters: `methodName` (the name of the method) and `response` (the response of the method that needs to be masked). It uses configurations from `censorData.json` to determine which data fields of specific methods' responses need to be masked, hiding any sensitive information.

2. Data Fetching: `testDataHandler()`
This function serves as a handler to retrieve specific test data based on provided parameters. It takes two parameters: `requestType` and `dataIdentifier`. It effectively manages external test data, streamlining the process of accessing relevant information during testing.

## Configuration

#### Data Censoring Configuration

The data fields that require censoring are configured in `censorData.json` found in `/plugins/external-test-data`. This JSON file maps method names to the fields that need censoring.

#### Data Fetching Configuration
Data for modules to be used by the `testDataHandler()` is stored in the format `moduleName.json` inside `/plugins/external-test-data/fixtures/modules`.

## Setup

#### Data Censoring Setup
1. Ensure the presence of the `censorData.json` file within `/plugins/external-test-data`.

2. For each method that requires data censoring, create a key with the method's name and associate it with the fields that need censoring.

Sample `censorData.json`:

```
{
  "methodName": {
    "field": ["value"]
  }
}
```

#### Data Fetching Setup
1. Inside `/plugins/external-test-data/fixtures/modules`, create JSON files for each module you want to include in your test data.

2. Name the JSON file based on the module's identifier (lowercase).

3. Populate this JSON file with the relevant test data.

Sample module data structure:

```
{
    "MODULE_1": {
        "property1": "value1",
        "property2": "value2"
    }
    // ... (Additional modules)
}

```
## Usage

#### Data Censoring Usage

When using the `censorData()` function, pass in the method's name and the response that needs to be censored. The function will refer to `censorData.json` for the necessary configurations and mask the relevant fields. This function is called in two files `Card.js` & `Test_Runner.js`.

###### Usage in [Card.js](../../src/Card.js)

After a method is invoked, the `ResultText` tag  is wrapped in the `censorData()` function which will remove any text from a response that needs to be censored.

###### Usage in [Test_Runner.js](../../src/Test_Runner.js)

Whenever the `response` is to be outputed or stored, it's passed through the `censorData()` function.

#### Data Fetching Usage

Utilize the `testDataHandler()` function by specifying the `requestType` (either "param" or "content") and the `dataIdentifier` (module name). Based on these parameters, the function will fetch and return the associated test data.

Generic Example:

```
let testData = testDataHandler("content", "MODULE_1");
```

###### Usage in [DiscoveryInvoker.js](../../src/invokers/DiscoveryInvoker.js)

The `testDataHandler` function is imported into this file and initializes two constants, `PURCHASEDCONTENTEXAMPLES` and `ENTITYINFOEXAMPLES`, using the associated test data from the external test data repository.

```
const PURCHASEDCONTENTEXAMPLES = testDataHandler('content', 'PURCHASEDCONTENT');

const ENTITYINFOEXAMPLES = testDataHandler('content', 'CONTENT');
```

Note: Always handle potential errors or exceptions during data retrieval. Use the `logger.error` function for logging any issues.
