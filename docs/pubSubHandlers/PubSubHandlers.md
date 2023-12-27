# Supported PubSub Handlers

If you've implemented a [PubSub plugin](../plugins/PubSub.md), FCA provides a set of PubSub handlers to facilitate Firebolt calls and event listeners. You can find the code for handling different types of PubSub requests in the [./src/pubsub/handlers directory](../../src/pubsub/handlers).

### Common Input
TODO: Ensure this info is up-to-date and accurate

All handlers will accept valid JSON objects with the format:

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
TODO: Ensure this info is up-to-date and accurate

| Key           | Description                                                                                         | Required?                   |
|---------------|-----------------------------------------------------------------------------------------------------|-----------------------------|
| INTENT        | The coresponding intent for the task (i.e. `callMethod` -> [CallMethodHandler](#callmethodhandler)) | Y                           |
| INTENT_PARAMS | The params need for the INTENT                                                                      | N - depending on the INTENT |
| APP_TYPE      | TODO                                                                                                | TODO                        |


Below, you'll find an overview of the supported handlers for various PubSub request types.

## Table of Contents
* [GetPubSubStatusHandler](#getpubsubstatushandler)
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

## GetPubSubStatusHandler

The **GetPubSubStatusHandler** checks the status of the PubSub connection in FCA. The intent is determined by the mandatory task parameter as `getPubSubStatus`. Optional parameters like action and appType are available. For more details, refer to the [GetPubSubStatusHandler documentation](GetPubSubStatusHandler.md).

## GetTestHandler

The **GetTestHandler** fetches the Mochawesome report from FCA with an additional parameter, jobId, added to the params field in the payload. It's typically used in conjunction with the asynchronous flag set to `true` in runTest. The intent is determined by the task and value as `getTest` along with the jobId as a param in the payload. Optional parameters like action and appType are also available. For more details, see the [GetTestHandler documentation](GetTestHandler.md).

## RunTestHandler

The **RunTestHandler** triggers a test in FCA, running on each test case. Additional test parameters can be added to the params field in the payload. For example, when running a test suite, an array of method parameters is passed in the param field of the payload. In a single test run, only the required method is passed. For a comprehensive understanding, please refer to the [RunTestHandler documentation](RunTestHandler.md).

## RegisterEventHandler

The **RegisterEventHandler** is used to register events in FCA. The intent is determined by the task with the value `registerEvent` along with the event name in the param field of the payload. For more comprehensive details, please refer to the [RegisterEventHandler documentation](RegisterEventHandler.md).

## CallMethodHandler

The **CallMethodHandler** is used to invoke APIs and return the response, along with schema validation results in FCA. In each test call, this handler is used to invoke all the required methods to obtain the response as per the defined schema. The intent is determined by the task with the value `callMethod`, along with the method to be called in the param field of the payload. Another field, called communicationMode, is passed in the payload to specify the mode in which this method should be invoked. For more information, consult the [CallMethodHandler documentation](CallMethodHandler.md).

## ClearEventHandler

The **ClearEventHandler** is utilized to clear event listeners one at a time. The intent is determined by the task with the value `clearEventHandler`, along with the event name to be cleared from the test in the param field of the payload. For detailed insights, see the [ClearEventHandler documentation](ClearEventHandler.md).

## GetEventResponse

The **GetEventResponse** handler is used to retrieve event responses after triggering each event. The response is fetched only after the event is triggered. The intent is determined by the task with the value `getEventResponse,` along with the event name for which the response needs to be fetched in the param field of the payload. For more details, refer to the [GetEventResponse documentation](GetEventResponse.md).

## HealthCheckHandler

The **HealthCheckHandler** is invoked after the health check is completed. This handler is responsible for sending the healthCheck command and validating whether FCA is launched as a third-party app. The intent is determined by the task with the value `healthCheck` in the payload. To delve deeper, please refer to the [HealthCheckHandler documentation](HealthCheckHandler.md).

## LifecycleRecordHandler

The **LifecycleRecordHandler** is used to record the lifecycle history of each test case. It consists of two stages: startLifecycleRecording and stopLifecycleRecording. For comprehensive information, consult the [LifecycleRecordHandler documentation](LifecycleRecordHandler.md).

## RegisterProviderHandler

The **RegisterProviderHandler** is invoked to trigger the provider registration. It is triggered when an entity provides services to another or an external party. The intent is determined by the task with the value `registerProviderHandler,` along with the provider name in the param field of the payload. For more detailed information, consult the [RegisterProviderHandler documentation](RegisterProviderHandler.md).


## SetApiResponseHandler

The **SetApiResponseHandler** is invoked to assign the response value to an environment variable in FCA. The intent is determined by the task with the value `setApiResponse,` along with the apiResponse in the param field of the payload. To understand its usage thoroughly, please refer to the [SetApiResponseHandler documentation](SetApiResponseHandler.md).

## DataFetchHandler

The **DataFetchHandler** is invoked when data is fetched from the fixtures directory. This handler is responsible for publishing the fetched data via PubSub with the method parameter set to `dataFetch`. For in-depth information, refer to the [DataFetchHandler documentation](DataFetchHandler.md).

## ClearEventListeners

The **ClearEventListeners** handler is employed to clear event listeners and the event history for the listener as a part of FCA. It clears all event listeners at once, erasing all remaining history of used event listeners. For comprehensive details, see the [ClearEventListeners documentation](ClearEventListeners.md).

## FireboltCommandHandler

The **FireboltCommandHandler** is used to invoke any API and return its response. Once this handler is invoked, it is mandatory to provide the API call in the parameter. For a comprehensive understanding, refer to the [FireboltCommandHandler documentation](FireboltCommandHandler.md).

