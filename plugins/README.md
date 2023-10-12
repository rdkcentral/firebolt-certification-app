# Plugins
Plugins are powerful tools that enable custom functionality to be added to FCA. They are optional. They are available for those who wish to extend or override FCA's capabilities. All plugins are located in the `/plugins` directory and use webpack to be added to the application during build time.

* [PubSub Client](#pubsub-client)
* [External Invokers](#external-invokers)
* [Startup Scripts](#startup-scripts)
* [External Views](#external-views)
* [Lifecycle](#lifecycle)
* [Config](#configjs)
* [External Test Data](#external-test-data)

## PubSub Client

The PubSub plugin is optional but is necessary for communicating with the FCA application from a PubSub system outside of the user interface. PubSub is a messaging pattern where publishers send messages to a central topic, and subscribers receive messages from that topic. This plugin enables FCA to subscribe to topics and receive messages from them.

To set up a PubSub plugin, you'll need to follow the instructions [here](./pubsub.md). Once the plugin is set up, you'll be able to communicate with FCA using your PubSub system of choice.

## External Invokers

External invokers are custom files that invoke external services or APIs. Instructions can be found [here](./sdks/README.md) on how to set up custom external invokers.

## Startup Scripts

Startup script plugins allow you to customize the behavior of FCA on app load. To set up startup scripts follow the instructions [here](./startupScripts/README.md).

## External Views

External Views are custom files that allow the application to be loaded with additional menu options. Instructions can be found [here](./externalViews/README.md) on how to set up custom external views.

## Lifecycle

This direcotry contain additional lifecycle functionality for app types not included in the base functionality of the application. It can be used in conjuction with external invoker enhancements.  Additional details on how to use the lifecyle plugin can be found [here](./lifecycle/README.md).

## Config.js

This file contains a JSON object where variables can be defined. Variables defined here will be appended to the constants in `src/constants.js`. If a variable is already defined in `src/constants.js` it would be overriden with the value present in this file. Additional details on how to use the config plugin can be found [here](./config.md).

## External Test Data

External test data is used within the firebolt-certification-app repository for a couple of functions that require importing data-sets outside of the application. Details on how external test data is used and how developers can leverage the functionality can be found here [here](./external-test-data/externalTestData.md).
