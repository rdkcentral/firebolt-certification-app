# Plugins
Plugins are powerful tools that enable custom functionality to be added to FCA. They are optional and available for those who wish to extend or override FCA's capabilities. All plugins are located in the `/plugins` directory and use webpack to be added to the application during build time.

## Table of Contents
* [PubSub Client](#pubsub-client)
* [External Invokers](#external-invokers)
* [Startup Scripts](#startup-scripts)
* [External Views](#external-views)
* [Lifecycle](#lifecycle)
* [Config](#configjs)
* [External Test Data](#external-test-data)

## PubSub Client

The PubSub plugin is optional but is necessary for communicating with the FCA application from a PubSub system outside the user interface. PubSub is a messaging pattern where publishers send messages to a central topic, and subscribers receive messages from that topic. This plugin allows FCA to subscribe to topics and receive messages from them. Employing the PubSub pattern in FCA ensures seamless message brokering between different parts of your system, ensuring the app remains responsive and up-to-date with any external events.

To set up a PubSub plugin, you'll need to follow the instructions [here](PubSub.md). Once the plugin is set up, you'll be able to communicate with FCA using your PubSub system of choice.

## External Invokers

External invokers are custom files that invoke external services or APIs. Use external invokers when you want to bridge the gap between FCA and third-party services or APIs. These invokers provide an abstraction layer, ensuring that the main application remains separate from external dependencies while still benefiting from their functionalities. To set up custom external invokers, follow the instructions [here](ExternalInvokers.md).

## Startup Scripts

Startup script plugins allow you to customize the behavior of FCA on app load. They're particularly useful when you need to establish specific preconditions or prime the app with particular data or behaviors upon startup. For instance, they can be used for configuring application settings, initializing third-party libraries, or executing any preliminary code. To set up startup scripts follow the instructions [here](StartUpScripts.md).

## External Views

External Views are custom files that allow the application to be loaded with additional menu options. With External Views, the application's UI can be expanded dynamically. This is particularly useful when the default UI doesn't address unique user workflows. Instructions can be found [here](ExternalViews.md) on how to set up custom external views.

## Lifecycle

This directory contains additional lifecycle functionality for app types not included in the base functionality of the application. It can be used in conjunction with custom [external invokers](ExternalInvokers.md).  Especially important for apps that have distinct stages or states during their runtime, this plugin ensures that these unique lifecycles are managed and handled appropriately. Additional details on how to use the lifecycle plugin can be found [here](Lifecycle.md).

## Config.js

This file contains a JSON object where variables can be defined. Variables defined here will be appended to the constants in `src/constants.js`. If a variable is already defined in `src/constants.js`, it would be overridden with the value present in this file. By consolidating configuration variables here, it streamlines application setup and maintenance. Users are encouraged to add their constants in `plugins/config.js` to tailor the app to their specific needs. While constants in `src/constants.js` should remain global and generic for the entire application. Additional details on how to use the config plugin can be found [here](Config.md).

## External Test Data

External test data is used within the `firebolt-certification-app` repository for a couple of functions that require importing data-sets outside the application. By the introduction of external datasets, this plugin aids in comprehensive testing. Details on how external test data is used and how developers can leverage the functionality can be found [here](ExternalTestData.md).
