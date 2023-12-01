# FCA: Reporting

FCA is pre-configured to generate detailed mochawesome JSON reports following the completion of [sanity tests](./Execution.md#sanity). This functionality not only provides users with immediate test results. It also enables sending these reports to AWS or any other URL endpoint for further processing and analysis. Users have the flexibility to utilize the generated mochawesome report JSON in various ways, including transforming the JSON data into an HTML report.

## Table of Contents

- [Standard Reporting Logic](#standard-reporting-logic)
- [Standalone Reporting Logic](#standalone-reporting-logic)
- [Extending Report Processing](#extending-report-processing)

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

2. `Flexible Endpoint Posting`: Users have the flexibility to post the report JSON to an alternative endpoint. This means you have two distinct methods for handling the report JSON, offering versatility in your reporting process. For example, you can configure Endpoint A to perform the initial report generation, while Endpoint B, a lambda function or API, can be set up to perform additional post-report generation data manipulation. This dual-endpoint approach allows you to efficiently customize and extend your reporting workflow, ensuring that your data is processed and analyzed exactly as needed.

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

## Extending Report Processing

### Background

Enhancing FCA's reporting functionality opens up a world of possibilities for tailoring insights and expanding data utilization. Custom reporting can involve various actions such as generating HTML reports for visual clarity or seamlessly integrating with analytics tools for tracking historical test performance. These customizations empower you with deeper insights and finer control over your test data.

### Setup & Usage

Work will be required by the user to configure their own API endpoints. Once that is complete, users can harness the power of those endpoints to shape their reporting process. Here are some posibilities:

- `S3 Bucket Storage`: Set up a lambda function to receive the report JSON and automatically place it in an S3 bucket for safekeeping and further analysis.

- `Long-Term Reporting`: Establish connections to services that specialize in long-term recording and analysis of your reports. This ensures that you have a comprehensive record of your testing history.

By embracing these flexible endpoint options, you can craft a reporting workflow that perfectly aligns with your unique requirements. Each endpoint can be tailored to perform specific actions, providing a highly adaptable reporting system. Be prepared for a journey of configuration and customization as you fine-tune FCA's reporting to meet your needs.

---

Remember, effective reporting is key to understanding and improving your application's performance. With FCA, you have the flexibility to use default settings for quick setup or delve into custom configurations for deeper data insights.
