
# FCA: Documentation

Welcome to the FCA (Firebolt Certification Application) documentation. Explore FCA's diverse capabilities, from configuration options to executing tests, validations, and more. This landing page offers concise overviews of each functionality offered, with links to more detailed documentation for comprehensive guidance.

The basic idea of FCA is:

- Launch FCA on an integrated device
- Use FCA to make Firebolt SDK calls on the device
- Validate the SDK responses
  
## Table of Contents

  - [Graphical User Interface (GUI)](#graphical-user-interface)
  - [Configuration Options](#configuration-options)
  - [Test Executions](#test-executions)
  - [Validations](#validations)
  - [Reporting](#reporting)
  - [Plugins](#plugins)

## Graphical User Interface

When you launch the Firebolt Certification Application (FCA) GUI, you gain access to a range of features and functionalities designed to facilitate Firebolt SDK testing and validation on integrated devices. For more details about the GUI please read the [Graphical User Interface documentation](GUI.md).

## Configuration Options

This document gives the various configurations available for Firebolt Certification App ( FCA). It provides insights into setting up and utiizing different environemtns, parameters, and app types to facilitate effective testing and certification of applications using firebolt technology.
[configuration documentation](./Configurations.md).

## Test Executions

This document provides a detailed guide on the various methods of executing tests on integrated devices using the Firebolt SDK. It is designed to give developers and testers clear insights into the functionality, setup, and usage of different test execution methods.

Test Types
Modes of Communication
[execution documentation](./Execution.md).

## Validations

FCA has the ability to make firebolt api calls to the device when it's launched. FCA supports Schema Validation which can be used to validate that a firebolt api response is adhering to the firebolt open rpc schema. For more details about the Validations please read the [validation documentation](./Validations.md).

## Reporting

If you are interested in taking advantage of the built-in reporting please see the [reporting documentation](./Reporting.md).

## Plugins
Plugins are powerful tools that enable custom functionality to be added to FCA. They are optional. They are available for those who wish to extend or override FCA's capabilities. All plugins are located in the `/plugins` directory and use webpack to be added to the application during build time. Full overview of the Plugins functionalities can be found [here](plugins/Plugins.md).
