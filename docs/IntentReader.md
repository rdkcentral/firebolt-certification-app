# FCA: Intent Reader

IntentReader is a powerful feature of FCA that accepts an input command or intent and performs various actions and tasks based on the command received. This is possible with the help of multiple handlers implemented in FCA. The intent reader is the decision-maker who would choose which handler to call based on the input command. Input commands and intents are used interchangeably throughout this document.

For example, if the task is "clearAllListeners," it will be calling the "clearEventListeners" handler to clear all the event listeners and the event history. Similarly, if the task is "call method," "call method handler" will be called, which is used to invoke any APIs.

IntentReader is called mainly in two scenarios.
1. When PubSub communication is established first, then IntentReader is called by sending messages via the PubSub messaging system.
2. When FCA is used as a standalone app, here, intent is directly sent to FCA.

Details about each scenario are given below.
## Table of Contents
- [Acceptable Inputs](#acceptable-inputs)
- [Pub Sub](#pub-sub)
- [Standalone](#standalone)
- [Handlers](#handlers)

## Acceptable Inputs
FCA accepts input commands only in JSON format. Here, intentReader uses the value of the task to determine which handler to call.  

Examples/scenarios
Format :
```
  {
      "action": "search",
      "data": {
          "query": "{\"task\":\"<TASK_NAME>\",\"params\":{<INTENT_PARAMS>},\"action\":\"NA\",\"appType\":\"<APP_TYPE>\"}"
      },
      "context": {
          "source": "device"
      }
  }
```

### Variables

| Key             | Description                                                                                                                                                                                                                          | Required?                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| ----------------------------- |
| task            | The value of the task determines the handler to be called. This is a constant value for a particular purpose. (i.e., for CallMethodHandler, the task is "callMethod, and for GetPubSubStatusHandler, the task is "getPubSubStatus"). | Y                             |
| params          | The params required for the INTENT                                                                                                                                                                                                   | N - depends on the INTENT     |
| appType         | Type of app ( eg: "firebolt")                                                                                                                                                                                                        | Y                             |
## Pub Sub
### Background

FCA has the capability to send and receive messages by making use of a PubSub (Publish-Subscribe) messaging system. FCA makes use of the messaging system by integrating it as a plugin. Setup to configure and integrate a messaging system is outlined [here](../plugins/PubSub.md).

Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics.
We can send commands/intents to FCA, which will be parsed and formatted by using various handlers.

You can find the code for handling different types of PubSub requests in the [intentReaderHandlers directory.](./intentReaderHandlers)
For pubSub scenarios, initially pubSub client communication is established, and then after getting the client response message, FCA processes the incoming intents, and corresponding handlers are called as per the task in the intent.
### Setup

The PubSub plugin has to be integrated with FCA to call IntentReader with PubSub communication. Setup details [here.](../plugins/PubSub.md)

### Usage

* The external sender needs to have the PubSub plugin integrated into it.
* Once the Pubsub plugin is integrated into the sender, it has to subscribe to the topic FCA will be publishing.
* The server can then publish the intent on the same topic to which FCA has subscribed.

For example:
To invoke any APIs, the task will be "callMethod", and the corresponding methodName, methodParams, etc. should be passed.
Here, pubSub communication status is established first, and then intent is passed.

## Standalone
### Background

FCA has the ability to accept intents and input commands as a standalone application without having a PubSub messaging system integrated. Here also, when intentReader is called with a particular intent, it is processed, and the corresponding handler is called, which decides the action to be performed corresponding to the task received in the intent.

The standalone scenario supports only cold launch of FCA.

* Cold Launch Scenario: Here the input command or intent is sent along with the launch command used to launch FCA. The FCA will process the intent immediately after it is launched.

### Setup

No additional setup is required. 

### Usage
With the configuration and setup in place, we can perform any actions or tasks without having a PubSub messaging system integrated. For standalone, we can directly send the request in the below-given format.
The format of the request remains the same as in pubSub, as we have to pass the task name and corresponding parameters required to perform the task.For standalones, the intent format will be like the following example:

* The sender need not have a pubsub messaging system integrated.
* Sender can directly send the intent to FCA in the format given [here](#standalone-intent-format)
* Here, the standalone intent is sent as an argument along with the launch command used to launch FCA (cold launch).
#### Standalone Intent Format

<details>
    <summary>Standalone Intent Format</summary>
</details>


  {
    task: 'runTest',
    standalone: 'true',
    params: {
      appId: params.appId,
      certification: true,
      exceptionMethods: [
        '...'
      ],
      methodsToBeExcluded: [
        '...'
      ],
      modulesToBeExcluded: [],
      appType: 'firebolt',
    },
    action: 'CORE',
    context: { communicationMode: 'SDK' },
    metadata: {
      target: 'RIPPLE',
      targetVersion: '<version>',
      '...'
    },
    asynchronous: false
  }

## Handlers

The supported handlers in FCA are given below .
* [GetPubSubStatusHandler](./intentReaderHandlers/GetPubSubStatusHandler.md) - Checks the health status of the PubSub connection in FCA.
* [GetTestHandler](./intentReaderHandlers/GetTestHandler.md) - Fetches the Mochawesome report from FCA for sanity suite execution.
* [RunTestHandler](./intentReaderHandlers/RunTestHandler.md) - Triggers a sanity suite test in FCA and returns the generated report.
* [RegisterEventHandler](./intentReaderHandlers/RegisterEventHandler.md) - Used to register events in FCA
* [CallMethodHandler](./intentReaderHandlers/CallMethodHandler.md) - Used to invoke APIS and return the response, along with schema validation results in FCA.
* [ClearEventHandler](./intentReaderHandlers/ClearEventHandler.md) - Used to clear event listeners one at a time
* [GetEventResponse](./intentReaderHandlers/GetEventResponse.md) - Used to retrieve event responses after triggering each event.
* [HealthCheckHandler](./intentReaderHandlers/HealthCheckHandler.md) - Invoked after the health check is completed.
* [LifecycleRecordHandler](./intentReaderHandlers/LifecycleRecordHandler.md) - Used to record the lifecycle history of the app for a particular time period.
* [RegisterProviderHandler](./intentReaderHandlers/RegisterProviderHandler.md) - Used to register for test providers used for automation testing.
* [SetApiResponseHandler](./intentReaderHandlers/SetApiResponseHandler.md) - Used to assign value to an environment variable in FCA.
* [ClearEventListeners](./intentReaderHandlers/ClearEventListeners.md) -  Used to clear all event listeners and the event history.
