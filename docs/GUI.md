# FCA: Graphical User Interface

When you launch the Firebolt Certification Application (FCA) GUI, you gain access to a range of features and functionalities designed to facilitate Firebolt SDK testing and validation on integrated devices. Here's an overview of what's available to you:

- **API’s**: This option allows a user to invoke Firebolt API's on device and view the API response in UI.
- **Lifecycle History**: Consists of lifecycle state transition of firecert app.
- **Demos**: Having a media player with sample video.
- **Start**: This feature enables a user to run Firebolt API's [Certification Suite](Execution.md#certification-suite). Results of the suite run will be displayed in UI.
- FCA can be launched as systemui by adding the url parameter systemui=true. When this parameter is added, system UI acts as the base app or UI in RIPPLE device.


## Table of Contents

- [APIs](#apis)
- [Lifecycle History](#lifecycle-history)
- [Demos](#demos)
- [Start](#start)
- [SystemUI](#systemui)

## APIs

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

#### Timeout in UI prompt

For pinChallenge and acknowledgeChallenge UI prompts , a timeout of 15s is added so that, if no action is taken when the prompts displays on the screen (i.e; neither yes/no/back button ), the prompts will be automatically dismissed with "null" value as the response.
The prompt is displayed when the user needs to grant/deny a particular api, or the user has to enter a pin in-case of pinChallenge.
If user wants to grant an api, yes button is pressed, for denial - no button, and in case if the user wants to dismiss the prompt without any action, back button is pressed.



## Lifecycle History

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Demos

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Start

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

# SystemUI

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details
