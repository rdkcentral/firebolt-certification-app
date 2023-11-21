# FCA: Intent Reader

IntentReader is a powerful feature of FCA which accepts an input command or intent and perform various actions/tasks based on the command received. This is possible with the help of multiple  handlers implemented in FCA. IntentReader is the decision maker which would choose which handler to call based on the input command. Input command/intent is used interchangeably throughout this document.

For eg: if the task is "clearAllListeners", it will be calling the "clearEventListeners" handler to clear all the eventListeners and the event history. Similarly if the task is "callMethod", "CallMethodHandler" will be called which is used to invoke any apis.

IntentReader is called mainly in 2 scenarios. 
1. When PubSub communication is established first and then IntentReader called by sending messages via PubSub messaging system. 
2. When FCA is used as a standalone app. Here intent is directly sent to FCA  

Details about each scenario is given below.
## Table of Contents

- Acceptable Inputs
- Pub Sub
- Standalone
- Handlers

## Acceptable Inputs
FCA accepts input commands only in json format. Here intentReader uses the value of task to determine which handler to call.  

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

| Key           |Description                                                                                                                      																							| Required?                   |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| task     		| Value of task determines the handler to be called. This is a constant value for a particular intent.(i.e; for CallMethodHandler the task is "callMethod",for GetPubSubStatusHandler the task is "getPubSubStatus")  		| Y                           |                                                                                | Y                           |
| params 		| The params required for the INTENT                                                                                              																							| N - depends on the INTENT   |
| appType      	| Type of app ( eg: "firebolt")                                                                                                   																							| Y                           |
## Pub Sub
### Background

FCA has the capability to send and receive messages by making use of a PubSub (Publish-Subscribe) messaging system. FCA makes use of the messaging system by integrating it as a plugin. Setup to configure and integrate a messaging system is outlined here[PubSub plugin](../plugins/PubSub.md).

Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics.
We can send commands/intents to FCA which will be parsed and formatted by using various handlers.

You can find the code for handling different types of PubSub requests in the [./intentReaderHandlers directory](./intentReaderHandlers).
For pubSub scenarios, initially pubSub client communication is established, and then after getting the client response message, FCA processes the incoming intents and corresponding handler responses are called as per the task in the intent.
PubSub scenario supports both cold launch and hot launch of FCA. 

### Setup

PubSub plugin has to be integrated with FCA to call IntentReader with PubSub communication. Setup details here: [PubSub plugin](../plugins/PubSub.md).

### Usage

With the configuration and setup in place, we can perform any actions/tasks with intentReaders and with the help of multiple handlers.
For performing a particular task, give the required taskName in the "task" field and the corresponding task parameters required to perform the task.
For eg :
To invoke any apis, the task will be "callMethod", and the corresponding methodName, methodParams etc should be passed.
## Standalone
### Background

FCA has the ability to accept intents/input commands as a standalone application without having a PubSub messaging system integrated. Here also, when intentReader is called with a particular intent, it is processed and the correspondig handler is called which decides the action to be performed corresponding to the task received in the intent.

Standalone scenario supports both cold launch and hot launch of FCA. 
1. Cold Launch scenarios - Here the input command/intent is sent along with the launch command used to launch FCA. FCA will process the intent immediately after it is launched. 

2. Hot Launch scenarios - Here, FCA is launched first and intents are sent later. Since the intents are sent only after FCA is launched, we can send any number of intents as needed at any point of time. 

### Setup

No additional setup is required. 

### Usage
With the configuration and setup in place, we can perform any actions/tasks without having a PubSub messaging system integrated. The format of the request remains the same as in pubSub as we have to pass the taskName and corresponding params required to perform the task. We have to follow the same format for intents.
## Handlers

The supported handlers in FCA are given below .
* [GetPubSubStatusHandler](./intentReaderHandlers/GetPubSubStatusHandler.md) - Checks the health status of the PubSub connection in FCA.
* [GetTestHandler](./intentReaderHandlers/GetTestHandler.md) - Fetches the Mochawesome report from FCA for sanity suite execution.
* [RunTestHandler](./intentReaderHandlers/RunTestHandler.md) - Triggers a sanity suite test in FCA and returns the generated report.
* [RegisterEventHandler](./intentReaderHandlers/RegisterEventHandler.md) - Used to register events in FCA
* [CallMethodHandler](./intentReaderHandlers/CallMethodHandler.md) - Used to invoke APIs and return the response, along with schema validation results in FCA.
* [ClearEventHandler](./intentReaderHandlers/ClearEventHandler.md) - Used to clear event listeners one at a time
* [GetEventResponse](./intentReaderHandlers/GetEventResponse.md) - Used to retrieve event responses after triggering each event
* [HealthCheckHandler](./intentReaderHandlers/HealthCheckHandler.md) - Invoked after the health check is completed
* [LifecycleRecordHandler](./intentReaderHandlers/LifecycleRecordHandler.md) - Used to record the lifecycle history of the app for a particular time period
* [RegisterProviderHandler](./intentReaderHandlers/RegisterProviderHandler.md) - Used to register for test providers used for automation testing.
* [SetApiResponseHandler](./intentReaderHandlers/SetApiResponseHandler.md) - Used to assign value to an environment variable in FCA
* [ClearEventListeners](./intentReaderHandlers/ClearEventListeners.md) -  Used to clear all event listeners and the event history
