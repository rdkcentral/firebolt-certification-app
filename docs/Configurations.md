# FCA: Configurations

This document gives the various configurations available for Firebolt Certification App (FCA). It provides insights into setting up and utiizing different environments, parameters, and app types to facilitate effective testing and certification of applications using firebolt technology. 


## Table of Contents

- [Running with MFOS](#running-with-mfos)
- [Connect to Mock Firebolt](#connect-to-mock-firebolt)
- [Supported URL Parameters](#supported-url-parameters)
- [App Types](#app-types)

## Running with MFOS

### Background

Mock Firebolt (MFOS) is a simulated environment representing (real Firebolt running on device) that FCA can interact with.

### Setup

- *MFOS*: The open source GitHub project is accessible at [Mock-Firebolt](https://github.com/rdkcentral/mock-firebolt)
- Use Mock Firebolt's [usage documentation](https://github.com/rdkcentral/mock-firebolt#usage-local) to get set up. 

### Usage

Utilize MFOS for testing in a controlled, simulated environment. MFOS can be ideal for early-stage development and testing.

## Connect to Mock Firebolt

### Background

Connecting to Mock Firebolt enables testing against a simulated Firebolt OS, providing a safe and flexible enviroment for development and testing.

### Setup

- Clone the Repository [Mock-Firebolt](https://github.com/rdkcentral/mock-firebolt)
- Follow the instructions provided in the repository to start the Mock Firebolt.
- Launch the Firebolt Cretification App and add `mf=true` to the app launch URL to connect to the mock environment.

### Usage

- Use Mock Firebolt for testing API integrations and app behavior in a simulated Firebolt environment.


## Supported URL parameters


### Background

URL parameters allow customization of the FCA's behavior, enabling testers to tailor the testing environemt to specific needs.

### Setup

- Use various parameters like 'platform', 'lifecycle_validation','mf','systemui' and more as per the requirment.
- These parameters modify how the FCA interacts with the environemtn and the test suite.

### Usage

Customize the test execution and reporting based on the provided URL parameters for targeted testing scenarios.

| Parameter            | Description                                                                                                                                                                  | Possible Values           | Notes                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------------------|
| **platform**         | Name of targeted platform.                                                                                                                                                   | (platform name)           | Specify the platform for which the testing is targeted.                                                             |
| **lifecycle_validation** | Blocks the default execution of lifecycle.ready and lifecycle.finished methods when set to true.                                                                             | true / false              | Useful for validating lifecycle API’s as needed.                                                                    |
| **mf**               | Connects to MFOS server when set to true; affects how APIs in FCA respond.                                                                                                   | true / false              | Use when testing integration with MFOS server.                                                                      |
| **systemui**         | Changes the background color to purple and adds a “Launch FCA app” button when set to true, in the context of Ripple devices.                                                | true / false              | Relevant for testing FCA as a base app in Ripple environment.                                                       |
| **testContext**      | Adds the field ‘context’ in the mocha report generated when set to true.                                                                                                     | true / false              | Useful for including additional context in test reports.                                                             |
| **voiceGuidance**    | Enables voice output for navigated menu options in the FCA app when set to true.                                                                                             | true / false              | Enhances accessibility by providing voice guidance for menu navigation.                                              |
| **reportingId**      | Appends this ID to the report name to form the reporting URL.                                                                                                                | (custom ID)               | Customize the report name for easier identification and tracking.                                                    |
| **standalone**       | Designed for automated testing scenarios, enabling detailed reports and logs within FCA independently of other apps or frameworks. Set to true for standalone execution.     | true / false              | Essential for tests requiring independence from other apps or frameworks, with detailed reporting and logging needs. |

## App Types

### Background

Different app types in FCA denote various SDK's of applications that can be tested using the platform. 

### Setup

- Define the app types as part of the configuration before initiating tests (AppType can be sent via the intent message) [Remote Execution](https://github.com/rdkcentral/firebolt-certification-app/blob/docs/Execution.md#remotely).

### Usage

- Select the appropriate app type to ensure that tests are relevant and effective for the specific category of the application.
