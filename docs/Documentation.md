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
- [Intent Reader](#intent-reader)

## Graphical User Interface

When you launch the Firebolt Certification Application (FCA) GUI, you gain access to a range of features and functionalities designed to facilitate Firebolt SDK testing and validation on integrated devices. For more details about the GUI please read the [Graphical User Interface documentation](GUI.md).

## Configuration Options

To learn more about configuration options see the [configuration documentation](./Configurations.md).

## Test Executions

To learn more about how to execute tests please see the [execution documentation](./Execution.md).

## Validations

FCA has the ability to make firebolt api calls to the device when it's launched. FCA supports Schema Validation which can be used to validate that a firebolt api response is adhering to the firebolt open rpc schema. For more details about the Validations please read the [validation documentation](./Validations.md).

## Reporting

FCA features an integrated reporting system that generates mochawesome JSON reports that can be used for test execution analysis. For a detailed exploration of FCA's reporting, from its built-in functions to custom solutions, please refer to our [comprehensive reporting documentaion](./Reporting.md).

## Plugins

Plugins are powerful tools that enable custom functionality to be added to FCA. They are optional. They are available for those who wish to extend or override FCA's capabilities. All plugins are located in the `/plugins` directory and use webpack to be added to the application during build time. Full overview of the Plugins functionalities can be found [here](plugins/Plugins.md).

## Intent Reader

If you are interested in taking advantage of the built-in reporting please see the [intent reader documentation](./IntentReader.md).
