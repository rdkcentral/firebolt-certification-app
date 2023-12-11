# FCA: Configurations

This document gives the various configurations available for Firebolt Certification App (FCA). It provides insights into setting up and utiizing different environments, parameters, and app types to facilitate effective testing and certification of applications using firebolt technology. 


## Table of Contents

- [How to Connect with Mock Firebolt?](#connect-to-mock-firebolt)
- [Supported URL Parameters](#supported-url-parameters)
- [App Types](#app-types)

## Connect to Mock Firebolt

### Background

Mock Firebolt (MFOS) is a simulated environment (representing real Firebolt running on device) that FCA can interact with.
Connecting to Mock Firebolt enables testing against a simulated Firebolt OS, providing a safe and flexible enviroment for development and testing.

### Setup

- *MFOS*: The open source GitHub project is accessible at [Mock-Firebolt](https://github.com/rdkcentral/mock-firebolt)
- Use Mock Firebolt's [usage documentation](https://github.com/rdkcentral/mock-firebolt#usage-local) to get set up. 
- Clone the Repository [Mock-Firebolt](https://github.com/rdkcentral/mock-firebolt)
- Follow the instructions provided in the repository to start the Mock Firebolt.
- Launch the Firebolt Cretification App and add `mf=true` to the app launch URL to connect to the mock environment.

### Usage

Utilize MFOS for testing API integrations and app behavior in a controlled, simulated environment. MFOS can be ideal for early-stage development and testing.
Use MFOS if you don't have a device with firebolt running on it, or don't have a device at all.


## Supported URL parameters


### Background

URL parameters allow customization of the FCA's behavior, enabling testers to tailor the testing environemt to specific needs.

### Setup

- Parameters are passed in the app URL. For example:
 `https://<DEPLOYED_FCA_HOST>/index.html?systemui=true`
- Passing multiple parameters in the URL is also possible and can be handled by FCA gracefully, For example:
`https://<DEPLOYED_FCA_HOST>/index.html?lifecycle_validations=true&systemui=true`

### Examples and Benefits

These examples illustrate how URL parameters can be effectively used to adapt the FCA to various testing requirements, enhancing the flexibility and efficiency of the testing process:

- **platform**: By specifying a platform (e.g., `platform=Sony`), testers can ensure that the testing environment is accurately configured for the specific platform, leading to more reliable and relevant test results.
- **lifecycle_validation**: Setting this to `true` (e.g., `lifecycle_validation=true`) helps in testing the lifecycle methods independently, ensuring they work as expected without the interference of default executions.
- **mf**: When integrating with an MFOS server, setting `mf=true` can simulate the behavior of the FCA in a connected environment, aiding in comprehensive API testing.
- **systemui**: For Ripple device testing, `systemui=true` alters the UI to match the Ripple context, facilitating a more accurate testing scenario.
- **voiceGuidance**: Enabling this feature (e.g., `voiceGuidance=true`) can help in assessing the accessibility of the app, ensuring it caters to users requiring voice navigation.
- **testContext**: If testContext=true is passed, the report should have the context field under each test updated with the following fields `params` `result` `error`
    if testContext=false or not passed the report should have the context field. However the context field will be set to null. 

### Usage

Customize the test execution and reporting based on the provided URL parameters for targeted testing scenarios.

| Parameter            | Description                                                                                                                                                                  | Possible Values           | Notes                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------------------------------------------------------------------------------------------------------------|
| **platform**         | Name of targeted platform.                                                                                                                                                   | e.g.,'Sony','X1','XUMO'           | Clarify which specific platform or operating system the testing is focused on.                                                             |
| **lifecycle_validation** | Blocks the default execution of lifecycle.ready and lifecycle.finished methods when set to true.                                                                             | true / false              | Useful for manually validating lifecycle API's  without automatic execution.                                                                    |
| **mf**               | When set to true, FCA interacte with the MFOS server, which affects how FCA's API's respond. This means FCA will call methods on MFOS instead of directly on the device.                                                                                                   | true / false              | Enables testing of FCA's integration with MFOS; especially relevant for verifying API responses in different setups.                                                                      |
| **systemui**         | Adds a visual cue, such as changing the background color, it also has elevated permissions and capabilities, such as enabling provider patterns.                                                | true / false              | This mode activates unique visual cues (like color changes and a launch button), special provider patterns only available in systemui, and elevates permissions for a more comprehensive testing experience in Ripple environments.                                                       |
| **testContext**      | Adds the field 'context' in the mocha report generated when set to true.                                                                                                     | true / false              | Useful for including additional context in test reports.                                                             |
| **voiceGuidance**    | Enables voice output for navigated menu options in the FCA app when set to true.                                                                                             | true / false              | Enhances accessibility by providing voice guidance for menu navigation.                                              |
| **reportingId**      | Appends this ID to the report name to form the reporting URL(it replaces the uuid with the passed value).                                                                                                                | (custom ID)               | Customize the report name for easier identification and tracking.                                                    |
| **standalone**       | Designed for automated testing scenarios, enabling detailed reports and logs within FCA independently of other apps or frameworks. Set to true for standalone execution.     | true / false              | [Standalone execution guide](https://github.com/rdkcentral/firebolt-certification-app/blob/FIRECERT-1500/docs/IntentReader.md#standalone) Essential for tests requiring independence from other apps or frameworks, with detailed reporting and logging needs.|

## App Types

### Background

Different app types in FCA denote various SDK's of applications that can be tested using the platform. 

### Setup

- Define the app types as part of the configuration before initiating tests (AppType can be sent via the intent message) [Remote Execution](./Execution.md#remotely).

### Usage

- Select the appropriate app type to ensure that tests are relevant and effective for the specific category of the application (e.g.,'Firebolt').
