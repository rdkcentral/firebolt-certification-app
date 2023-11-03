# PubSub

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

The PubSub (Publish-Subscribe) pattern is a messaging pattern where senders (publishers) send messages without a specific receiver in mind. Instead, they categorize the sent messages into different classes. On the other side, receivers (subscribers) express interest in one or more classes and only receive messages that are of interest. This decoupling of publishers from subscribers can lead to a more scalable and flexible system.

The `pubSubClient.js` serves as a foundation or a blueprint that developers can use to integrate their own PubSub system, whether it's a simple implementation or a more complex system interfacing with external services.

By utilizing the Webpack alias, developers have the flexibility to either extend the existing "dummy" `pubSubClient.js` or swap it out entirely for a more robust solution without having to alter references throughout the codebase. It's important to note that any extensions should be made within the `plugins/pubSubClient.js` directory and not `src/pubSubClient.js`, as there are forthcoming plans to develop a basic PubSub client within the `src` directory. This modular approach ensures the codebase remains clean and easily maintainable.

## Configuration

While we anticipate the introduction of a more comprehensive PubSub websocket client in the future, developers can leverage this existing file as a foundational guide. To use it as a starting point for your custom PubSub client plugin, simply copy it to the `plugins` directory or use the template provided in [the setup section](#setup) to create a new file inside of the `plugins` directory and make your desired modifications.

The Webpack Alias Plugin has been configured to create an alias called pubSubClient that resolves to `/plugins/pubSubClient.js` or `/src/pubSubClient.js`. `plugins/pubSubClient.js` takes precedence over `/src/pubSubClient.js`. This allows developers to easily swap in their own custom PubSub client by taking advantage of the alias configuration included in the `webpack.config.js` file.

```
resolve: {
  plugins: [ new AliasPlugin('described-resolve', [
    { name: 'pubSubClient', alias: [
      '/plugins/pubSubClient.js',
      '/src/pubSubClient.js'
    ]},
  ], 'resolve') ],
}
```

## Setup

If you would like to add your own PubSub client to the project, you can use the sample `PubSubClient` class provided below as a template.

Ensure that the `url` within the `PubSubClient` constructor is directed towards your WebSocket server. Additionally, you might need to adjust the message payload based on the expectations of the WebSocket server you're communicating with. 

```
class PubSubClient {
  constructor() {
    this.ws = null;
    this.url = 'https://your-ws-url-here.com';
  }

  // Initializes a WS connection
  async initialize() {
    // Establish WS Connection
    this.ws = new WebSocket(this.url);
    logger.info('Establishing a WS connection...', 'initialize');

    return new Promise((resolve, reject) => {
      this.ws.addEventListener('open', (event) => {
        logger.info('WS connection initialized...', event);
        resolve(true);
      });

      this.ws.addEventListener('error', (event) => {
        logger.error('Failed to initialize a WS connection...', 'initialize');
        reject(false);
      });
    });
  }

  // Publish a message to a topic
  publish(topic, message) {
    if (!topic) {
      logger.info('No topic provided...');
      return false;
    }

    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'publish',
      payload: message,
      timestamp: new Date().getTime(),
    };

    try {
      this.ws.send(JSON.stringify(samplePayload));
      return true;
    } catch (err) {
      logger.error('Failed to publish message...', err);
      return false;
    }
  }

  // Subscribe to a topic
  subscribe(topic, callback) {
    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'subscribe',
      topic: topic,
      timestamp: new Date().getTime(),
    };

    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.type == 'EventMessage') {
        callback(JSON.stringify(data));
      }
    });

    try {
      this.ws.send(JSON.stringify(samplePayload));
    } catch (err) {
      logger.error('Failed to subscribe to topic...', err);
    }
  }

  // Unsubscribe to a topic
  unsubscribe(topic) {
    // Payload can be configured to match what your specific WS server is expecting to receive.
    const samplePayload = {
      operation: 'unsubscribe',
      topic: topic,
      timestamp: new Date().getTime(),
    };

    try {
      this.ws.send(JSON.stringify(samplePayload));
      return true;
    } catch (err) {
      logger.error('Failed to unsubscribe from topic...', err);
      return false;
    }
  }
}

const getClient = async () => {
  const pubSubClient = new PubSubClient();
  await pubSubClient.initialize();
  return pubSubClient;
};

module.exports = { getClient };
```

Note: When changes are made to this plugin, users must run the command `npm run build` in order for their changes to be properly compiled and integrated into the application.

## Usage

Here is an overview of the functions provided by the PubSubClient class:

- `initialize()` - Initializes a WebSocket connection to the specified URL.

- `publish(topic, message)` - Publishes a message to the specified topic.

- `subscribe(topic, callback)` - Subscribes to the specified topic and executes a callback function when a message is received.

- `unsubscribe(topic)` - Unsubscribes from the specified topic.

The `getClient()` function is used to create a new instance of the `PubSubClient` class.

To understand more about how a PubSub system works within FCA, please refer to the following documentation: [Executing Tests Remotely](../Execution.md#executing-remotely).

It's important to note that the payload data can be anything you want, but you should use the same function names and parameters in your code to ensure compatibility with the existing functions inside the `PubSubClient` class.

It is recommended to test your PubSub client thoroughly to ensure that it works as expected before using it in a production environment.

FCA includes supported PubSub handlers designed to manage various incoming PubSub methods. For more information on the supported PubSub handlers, please refer to [PubSub Handlers](../pubSubHandlers/PubSubHandlers.md).
