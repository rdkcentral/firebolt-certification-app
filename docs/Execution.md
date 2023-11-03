# FCA: Executing Tests

TODO: add intro

## Table of Contents

- [Certification Suite](#certification-suite)
- [Supported Ways of Execution](#supported-ways-of-execution)
- [Supported Modes of Execution](#supported-modes-of-execution)
- [Executing Remotely](#executing-remotely)

## Certification Suite

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Supported ways of Execution

EXISTING CONTENTS(needs revision):
> It is possible to run the sanity suite in other platforms.

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Supported Modes of execution

EXISTING CONTENTS(needs revision): 
> Mode of execution implies the way in which an API is invoked. There are 2 modes of execution -
>
> - SDK - APIs are invoked using Firebolt SDK.
> - Transport - APIs are invoked by using Transport layer and thus bypassing SDK.

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details


## Executing Remotely

### Background

FCA extends its capabilities by offering remote accessibility through API access, presenting automation opportunities for users responsible for managing test suites, as well as those without direct device access. By utilizing a PubSub client, users can dispatch requests to integrated devices running FCA, enabling the initiation of various tests, Firebolt calls, and other tasks (see [PubSub Handlers documentation](pubSubHandlers/PubSubHandlers.md)). However, it's essential to note that implementing a PubSub client is a prerequisite (refer to the [PubSub documentation](plugins/PubSub.md) for guidance). This remote communication feature provides distinct advantages, including the ability to schedule automated test suites, reduce the dependency on physical devices for developers, and more.

### Setup

Before you begin using FCA with API Access, there is one essential pre-requisite:

  - **PubSub Client**: In order to use the API access of FCA you first need to implement a PubSub client to handle incoming and outgoing calls. For information on setting up your own PubSub client please see the [PubSub documentation](plugins/PubSub.md).

TODO: add details for how to configure FCA's PubSub client topics, listeners/subscriptions, compressions, etc...
TODO: add details for how to configure a PubSub client to talk to FCA's PubSub Client.

### Usage

TODO: Add details for how to send a PubSub message to FCA's PubSub client

FCA includes supported PubSub handlers designed to manage various incoming PubSub methods. For more information on the supported PubSub please see the [PubSub Handlers documentation](pubSubHandlers/PubSubHandlers.md).
