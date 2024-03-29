# PubSub

In the current version of the codebase, there is a functional `pubSubClient.js` file located in the `/src` directory. This file serves as a simple PubSub websocket client that can be utilized after updating the URL in the constructor of the class (this.url) to point to your PubSub websocket server.

The Webpack Alias Plugin has been configured to create an alias called `pubSubClient` that resolves to `/plugins/pubSubClient.js` or `/src/pubSubClient.js`. `plugins/pubSubClient.js` takes precedence over `/src/pubSubClient.js`. This allows developers to easily swap in their own custom PubSub client by taking advantage of the alias configuration in the webpack.config.js file.

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

### Creating Your Own PubSub Client

If you would like to extend the functionality of the existing PubSub client or create your own custom PubSub client, you can use the PubSubClient class provided in `src/pubSubClient.js` as a template. This file is designed to work with a basic PubSub server.

Here is an overview of the functions provided by the PubSubClient class:

- `initialize()` - Initializes a WebSocket connection to the specified URL.

- `publish(topic, message)` - Publishes a message to the specified topic.

- `subscribe(topic, callback)` - Subscribes to the specified topic and executes a callback function when a message is received.

- `unsubscribe(topic)` - Unsubscribes from the specified topic.

- `isConnected()` - Checks WebSocket connection status.

It's important to note that while the payload data can be anything you desire, maintaining the same function names and parameters in your code ensures compatibility with the existing functions inside the PubSubClient class.

Before deploying your PubSub client to a production environment, it is recommended to thoroughly test its functionality to ensure it behaves as expected.
