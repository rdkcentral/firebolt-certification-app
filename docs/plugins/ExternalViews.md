# External Views

## Table of Contents

- [Background](#background)
- [Configuration](#configuration)
- [Setup](#setup)
- [Usage](#usage)

## Background

External Views, also referred to as external launchers, are specifically designed to allow the app to start with customized menu options not originally packaged with the core application. These launchers are not mandatory but offer a flexible mechanism for users to tailor the application's starting view. 

Beyond simply altering the application's starting view, external launchers can introduce custom features or functionalities tailored to specific user needs. This could include new interactive elements, altered navigation flows, or additional capabilities that expand upon the base application.

When an external view is incorporated, users experience a more personalized interface. This can be beneficial in scenarios when the application is being tailored for a specific audience or function, ensuring that users are immediately presented with the most relevant options and features for their needs.

## Configuration

To automatically integrate any external launchers, the system looks for them in the `/plugins/externalViews` directory. The `index.js` file inside `/plugins/externalViews` bundles all the files included in this directory together, and they are combined into a single module with webpack.
```
resolve: {
    alias: {
      'externalViews': path.resolve(__dirname, 'plugins/externalViews')
    }
}
```

Thus, it is vital to ensure that all custom external launchers are stored within this specified directory.

External launchers are automatically imported into `MenuBuilder.js` to help in the dynamic creation of menu items based on the available external launchers. The app integrates external launchers by importing all available views from the `externalViews` module. It checks for their presence and then loops through each available module, extracting the necessary details to create a corresponding menu item for each launcher.

## Setup

Creating an external launcher requires you to craft a JavaScript file built around a unique class structure, designed to launch the application with your desired menu configurations.

To incorporate an external launcher into your project:

1. Design your custom launcher file.

2. Position this file within the `/plugins/externalViews` directory.

Each launcher file should export a single class that encapsulates the logic and configurations for presenting the desired menu options. This class can extend from base classes as needed. The file can also house static named exports for additional configurations or utilities.

For a standardized approach, all external launcher files should align with the following structure:

```
// The external launcher should predominantly export a default class, capturing the launching logic.
export default class CustomLauncher extends lng.Component {

    _init() {
        // Logic here dictates how the app launches with specific menu configurations.
    }
}
// Named exports, like 'name', can be added as needed for further customizations.
export const name = "CustomLauncherName";
```

## Usage

Once the external launchers are set up and configured, they will automatically appear as menu items in the application. As a developer or user, you won't need to manually add them to any menu; the application will dynamically generate their menu entries based on the configured launchers. When you select one of these menu items, the corresponding external view will be launched, providing a customized starting view for the application.

Note: If you make changes to the external launcher plugin files, ensure you run the command `npm run build` so that your modifications are properly compiled and integrated into the application.
