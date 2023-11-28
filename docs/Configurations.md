# FCA: Configurations

This document gives the various configurations available for Firebolt Certification App ( FCA). It provides insights into setting up and utiizing different environemtns, parameters, and app types to facilitate effective testing and certification of applications using firebolt technology. 


## Table of Contents

- [Running with MFOS](#running-with-mfos)
- [Connect to Mock Firebolt](#connect-to-mock-firebolt)
- [Supported URL Parameters](#supported-url-parameters)
- [App Types](#app-types)

## Running with MFOS

### Background

Mock Firebolt OS (MFOS) is a simulated environment that FCA can interact with.

### Setup

- *MFOS*: Accessible at `https://github.com/rdkcentral/mock-firebolt`
- Follow the instructions provided in the repository to setup the MFOS environment 

### Usage

Utilize MFOS for testing in a controled , simulated environment, ideal for early-stage dvelopment and testing.

## Connect to Mock Firebolt

### Background

Connecting to Mock Firebolt enables testing against a simulated Firebolt OS, providing a safe and flexible enviroment for development and testing.

### Setup

- Clone the Mock Firebolt Repository `https://github.com/rdkcentral/mock-firebolt`
- Follow the instructions provided in the repository to start the Mock Firebolt OS.
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

- Customize the test execution and reporting based on the provided URL parameters for targeted testing scenarios.
**Parameters usage:**
- **platform**: name of targeted platform
- **lifecycle_validation**: When user passes lifecycle_validation=true it blocks the default execution of lifecycle.ready and lifecycle.finished method.
This will help  to validate lifecycle api's as needed.
- **mf**: If mf=true is passed in the URL, FCA will connect to MFOS server and when we invoke any api in FCA it will return the response fron MFOS.
- **systemui**: If FCA systemui=true, FCA acts as the base app in case of ripple. The background color will be changed to purple and it will display one more button as "Launch FCA app" to launch FCA as third-party app on Ripple devices.
- **testContext**: If testContext=true, it will add the field context in mocha report generated
- **voiceGuidance** : if FCA voiceGuidance=true app will voice out navigated menu options.
- **reportingId**:
- **standalone**: Standalone execution is designed for automated testing scenarios, where generating detailed reports and logs is crucial to be within FCA independantly of any other apps or frameworks. Enable standalone execution by setting the standalone=true parameter in the URL example:(https://firecertapp.firecert.com/edge/index.html?standalond=true) or within the intent message example:(intent>data>query>params>"standalone":true).
- **testtoken**: 
- **pubsub_uuid**: 


## App Types

### Background

Different app types in FCA denote various categories or classifications of applications that can be tested using the platform. 

### Setup

- Define the app types as part of the configuration before initiating tests.
- This may involve specifying the type of applocation under test, such as media apps, utility apps, etc.

### Usage

- Select the appropriate app type to ensure that tests are relevant and effective for the specific category of the application.


