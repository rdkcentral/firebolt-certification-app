# FCA: Intent Reader

TODO: add intro

## Table of Contents

- Acceptable Inputs
- Pub Sub
- Standalone
- Handlers

## Acceptable Inputs

Examples/scenarios

## Pub Sub
FCA has the capability to send and receive messages by making use of a PubSub (Publish-Subscribe) messaging system. FCA makes use of the messaging system by integrating it as a plugin. Setup to configure and integrate a messaging system is outlined here[PubSub plugin](../plugins/PubSub.md).
Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics( firebolt-api and events). Messages received by FCA is parsed and formatted by using various Pubsub  Handlers.
You can find the code for handling different types of PubSub requests in the [./pubSubHandlers directory](./pubSubHandlers).

### Background

TODO: add details

### Setup

TODO: add details - link to plugins docs for pub sub

### Usage

TODO: add details

## Standalone

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details


## Handlers
Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics( firebolt-api and events). Messages received by FCA is parsed and formatted by using various Pubsub  Handlers.
You can find the code for handling different types of PubSub requests in the ./pubSubHandlers directory.

* [GetPubSubStatusHandler](GetPubSubStatusHandler.md) - Checks the status of the PubSub connection in FCA
* [GetTestHandler](GetTestHandler.md) - Fetches the Mochawesome report from FCA
* [RunTestHandler](RunTestHandler.md) - Triggers a test in FCA, running on each test case
* [RegisterEventHandler](RegisterEventHandler.md) - Used to register events in FCA
* [CallMethodHandler](CallMethodHandler.md) - Used to invoke APIs and return the response, along with schema validation results in FCA.
* [ClearEventHandler](ClearEventHandler.md) - Used to clear event listeners one at a time
* [GetEventResponse](GetEventResponse.md) - Used to retrieve event responses after triggering each event
* [HealthCheckHandler](HealthCheckHandler.md) - Invoked after the health check is completed
* [LifecycleRecordHandler](LifecycleRecordHandler.md) - Used to record the lifecycle history of each test case
* [RegisterProviderHandler](RegisterProviderHandler.md) - Invoked to trigger the provider registration
* [SetApiResponseHandler](SetApiResponseHandler.md) - invoked to assign the response value to an environment variable in FCA
* [ClearEventListeners](ClearEventListeners.md) - Used to clear all event listeners and the event history for the listener as a part of FCA
* [ClearEventHandler](ClearEventHandler.md) - Used to clear a single event at a time

