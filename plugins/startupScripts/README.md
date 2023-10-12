# Configuring Startup Scripts

Within the `plugins` directory is a `startupScripts` directory. This directory can contain JavaScript files that are executed when the app is loaded. These files will be bundled into a separate startupScripts.bundle.[hash].js file using Webpack.

## Adding a Startup Script

To add a new startup script follow these steps:

1. Create a new JavaScript file in the `/plugins/startupScripts` directory.
2. Write your code in the JavaScript file.
3. Make sure that your code exports a function that will be executed when the app is loaded.
4. Save the JavaScript file.

## Building Webpack

To build Webpack and include startup scripts, follow these steps:

1. Add your startupScripts as an entry point in your Webpack configuration:

```
entry: {
  startupScripts: glob.sync('./plugins/startupScripts/*.js'),
  main: './src/index.js',
}
```
2. Open the terminal.
3. Navigate to the project directory.
4. Run the command `npm run build`.
5. Webpack will bundle the app into the dist/web directory.
6. `startupScripts` will be included in the startupScripts.bundle.[hash].js file.
