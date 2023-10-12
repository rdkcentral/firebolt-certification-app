# External Views

External Views will pull in any external launcher in the `/plugins/externalView` directory. External launchers are custom files used to launch the app with menu options not packaged with the base application. They are optional. Below are the steps on how to set up a custom external launcher.

## Adding External Launcher

An external launcher is JavaScript file that contains a single class to launch the app with desired menu options. To add external launcher to your project, follow these steps:

Place your external launcher file in the `/plugins/externalView` directory. Each external launcher file should export a single class to launch the desired menu options. It can also contain static named exports.

To ensure consistency and ease of use, external launcher files should adhere to the following schema:

```
// External launcher files should export a default class that contains methods 

export default class  CustomLauncher extends lng.Component {

    _init() {
        // Add logic to launch an app with desired menu options.
    }
}
export const name = " ";

```
