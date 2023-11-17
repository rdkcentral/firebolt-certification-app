# FCA: Intent Reader

IntentReader is used to make FCA do certain actions based on the input received. The actions are performed based on the task received in intent. 

For eg: if the task is "clearAllListeners", it will be returning the "clearEventListeners" handler to clear all the eventListeners and the event history.Similarly if the task is "callMethod", "CallMethodHandler" will be returned which is used to to invoke any apis.
So, when an intentReader is called with a particular intent, it is processed and the corresponding handler response is returned.

It is mainly called from 2 scenarios. One is using "pubSub" where linchpin communication is established first and then intent is sent to FCA. The second scenario "standalone" is by directly sending intent to FCA without any pubSub dependency. 
## Table of Contents

- Acceptable Inputs
- Pub Sub
- Standalone
- Handlers

## Acceptable Inputs

Examples/scenarios
Format :
```
{
    "action": "search",
    "data": {
        "query": "{\"task\":\"<INTENT>\",\"params\":{<INTENT_PARAMS>},\"action\":\"NA\",\"appType\":\"<APP_TYPE>\"}"
    },
    "context": {
        "source": "device"
    }
}
```

### Variables

| Key           |Description                                                                                                                      																							| Required?                   |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| INTENT        | The corresponding intent for the task.The intent is determined by the mandatory task parameter.(i.e; for CallMethodHandler the intent is "callmethodhandler",for GetPubSubStatusHandler the intent is "getPubSubStatus")  | Y                           |                                                                                | Y                           |
| INTENT_PARAMS | The params required for the INTENT                                                                                              																							| N - depends on the INTENT   |
| APP_TYPE      | Type of app ( eg: "firebolt")                                                                                                   																							| Y                           |

## Pub Sub
### Background

FCA has the capability to send and receive messages by making use of a PubSub (Publish-Subscribe) messaging system. FCA makes use of the messaging system by integrating it as a plugin. Setup to configure and integrate a messaging system is outlined here[PubSub plugin](../plugins/PubSub.md).

Once the PubSub plugin is integrated into FCA, it can send or receive messages by publishing and listening to various topics( firebolt-api and events). Messages received by FCA is parsed and formatted by using various Pubsub  Handlers.

You can find the code for handling different types of PubSub requests in the [./pubSubHandlers directory](./pubSubHandlers).
For pubSub scenarios, initially linchpin communication is established, and then after getting the linchpin response message, FCA processes the incoming intents and corresponding handler responses are returned as per the task in the intent.
PubSub scenario supports both cold launch and hot launch of FCA. 

## Standalone
### Background

Standalone is the case where intent is directly sent to FCA without any pubSub dependencies. Here also, when intentReader is called with a particular intent, it is processed and the correspondig handler response is returned which decides the action to be performed corresponding to the task received in the intent.

Standalone scenario supports both cold launch and hot launch of FCA. 
In cold launch scenarios, Parameters.initialization api is called along with the app launch and later process the corresponding intents.
In hot launch scenarios, after FCA is launched, we register the "navigateTo" event and process the intent.

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

