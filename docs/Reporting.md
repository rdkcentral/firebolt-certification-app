# FCA: Reporting

FCA is pre-configured to generate detailed mochawesome JSON reports following the completion of [sanity tests](./Execution.md#sanity). This functionality not only provides users with immediate test results. It also enables sending these reports to AWS or any other URL endpoint for further processing and analysis. Users have the flexibility to utilize the generated mochawesome report JSON in various ways, including transforming the JSON data into an HTML report.

## Table of Contents

- [Standard Reporting Logic](#standard-reporting-logic)
- [Standalone Reporting Logic](#standalone-reporting-logic)
- [Creating Your Own Reporting Logic](#creating-your-own-reporting-logic)

## Standard Reporting Logic

### Background

The default reporting mechanism in FCA is designed to streamline your test analysis process. Post-execution of sanity tests, the app generates detailed mochawesome JSON. The `northBoundSchemaValidationAndReportGeneration()` function in [Test_Runner.js](../src/Test_Runner.js) orchestrates this entire process. The function returns the report data as an object. Additionally, for users leveraging `IntentReader`, the [runTestHandler](../src/pubsub/handlers/RunTestHandler.js) class can be utilized to execute a sanity test and the [getTestHandler](../src/pubsub/GetTestHandler.js) can be used to receive the generated report.

### Setup

**NOTES**:

- The steps below are tailored for AWS configurations. For other platforms, adjustments will be necessary.

- `pushReportToS3()` is a versatile function that can interface with non-AWS POST endpoints to transfer your mochawesome JSON.

To initiate the built-in reporting, follow the preliminary steps below.

1. Create a POST endpoint in AWS API Gateway to accept incoming JSON.

2. Configure your endpoint in [config.js](../plugins/config.js) as follows, to set up the report publishing process:

```
REPORT_PUBLISH_URL: '', // Endpoint for standard report publishing
```

### Usage

Initiate a sanity test run to activate the reporting function. Upon completion, FCA automatically processes and generates the mochawesome JSON report.

## Standalone Reporting Logic

### Background

Furthermore, FCA supports `standalone` report generation. This mode is particularly useful for specialized report handling or when integrating with unique endpoint requirements. Below are the key differences between standalone reporting and standard reporting:

1. `Reporting ID`: In standalone mode, users can specify a `reportingId` that will take precedence over the default JSON report filename when it is sent to an endpoint.

2. `Flexible Endpoint Posting`: Users have the flexibility to post the report JSON to an alternative endpoint. This means you have two distinct methods for handling the report JSON, offering versatility in your reporting process.

### Setup

In order to activate `standalone` mode, include the following paramaters:

- `standalone` (string: required): Set to `true` to enable standalone mode.

- `reportingId` (string: optional): string - An identifier for naming the generated report JSON file.

Parameters can be provided via intent or as URL query parameters.

```
REPORT_PUBLISH_STANDALONE_URL: '', // Endpoint for standalone report publishing
REPORT_PUBLISH_STANDALONE_REPORT_URL: '', // Optional: Endpoint for hosting a live HTML report
```

### Usage

To make use of `standalone` mode follow these steps:

1. Ensure you have set the necessary parameters as mentioned in the setup section above.

2. Once you have configured the necessary parameters for `standalone` mode, initiate a sanity test run. Ensure that the `standalone` parameter is set to `true`. The system will generate and handle the report accordingly.

## Creating Your Own Reporting Logic

### Background

Enhancing FCA's reporting functionality allows for tailored insights and expanded data usage. Custom reporting might include HTML report generation for easy visualization, or integration with analytics tools for historical test performance tracking. These customizations offer deeper insights and more granular control over test data.

Consider modifying `northBoundSchemaValidationAndReportGeneration()` for custom report processing. Additionally, use [Utils.js](../src/utils/Utils.js) to include any helper reporting functions.

### Setup & Usage

Custom reporting setups will vary based on your specific requirements and the tools you integrate with. Be prepared for a unique configuration journey as you tailor FCA’s reporting to your needs.

---

Remember, effective reporting is key to understanding and improving your application's performance. With FCA, you have the flexibility to use default settings for quick setup or delve into custom configurations for deeper data insights.
