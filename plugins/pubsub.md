# PubSub

In the current version of the codebase, there is a "dummy" `pubSubClient.js` file located in the `/src` directory. This file serves as a placeholder until a more robust PubSub websocket client is provided. However, developers can still use this file as a starting point to build their own custom PubSub client plugin, or create a new plugin from scratch to handle more advanced functionality.

The Webpack Alias Plugin has been configured to create an alias called pubSubClient that resolves to `/plugins/pubSubClient.js` or `/src/pubSubClient.js`. `plugins/pubSubClient.js` takes precedence over `/src/pubSubClient.js`. This allows developers to easily swap in their own custom PubSub client by taking advantage of the alias configuration in the webpack.config.js file
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

## Adding Your Own PubSub Client

If you would like to add your own PubSub client to the project, you can use the sample `PubSubClient` class provided below as a template:

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

  // Checking WebSocket Connection status
  isConnected() {
    let status = false;
    if(this.ws && this.ws.readyState == this.ws.OPEN){
      logger.info('WS connection already Established');
      status = true;
    }
    return status;
  }
}

const getClient = async () => {
  const pubSubClient = new PubSubClient();
  await pubSubClient.initialize();
  return pubSubClient;
};

module.exports = { getClient };
```

Here is an overview of the functions provided by the PubSubClient class:

- `initialize()` - Initializes a WebSocket connection to the specified URL.

- `publish(topic, message)` - Publishes a message to the specified topic.

- `subscribe(topic, callback)` - Subscribes to the specified topic and executes a callback function when a message is received.

- `unsubscribe(topic)` - Unsubscribes from the specified topic.

- `isConnected()` - Checking WebSocket Connection status.

To add your own PubSub client, create a new instance of the PubSubClient class in `/plugins/pubSubClient.js` and use the functions provided by the class to publish and subscribe to topics. You can use the getClient() function to create a new instance of the `PubSubClient` class.

It's important to note that the payload data can be anything you want it to be, but you should use the same function names and parameters in your code to ensure compatibility with the existing functions inside the `PubSubClient` class.

It is recommended to test your PubSub client thoroughly to ensure that it works as expected before using it in a production environment.
