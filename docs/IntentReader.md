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
FCA has the capability to send and receive messages by making use of a PubSub (Publish-Subscribe) messaging system. FCA makes use of the messaging system by integrating it as a plugin. Setup to configure and integrate a messaging system is outlined herePubSub plugin. Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics( firebolt-api and events). Messages received by FCA is parsed and formatted by using various Pubsub Handlers. You can find the code for handling different types of PubSub requests in the ./pubSubHandlers directory.

* [GetPubSubStatusHandler](#getpubsubstatushandler) - use for xyz
* [GetTestHandler](#gettesthandler)
* [RunTestHandler](#runtesthandler)
* [RegisterEventHandler](#registereventhandler)
* [CallMethodHandler](#callmethodhandler)
* [ClearEventHandler](#cleareventhandler)
* [GetEventResponse](#geteventresponse)
* [HealthCheckHandler](#healthcheckhandler)
* [LifecycleRecordHandler](#lifecyclerecordhandler)
* [RegisterProviderHandler](#registerproviderhandler)
* [SetApiResponseHandler](#setapiresponsehandler)
* [DataFetchHandler](#datafetchhandler)
* [ClearEventListeners](#cleareventlisteners)
* [FireboltCommandHandler](#fireboltcommandhandler)

