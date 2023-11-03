# Documenting Guide

Welcome to our documentation structure and standards guide. Here, you'll find templates for a variety of document types as well as documentation standards. These templates not only ensure the consistency and effectiveness of our application's documentation but also speed up the documentation process, helping you create high-quality documents efficiently.

## Documentation Standards

Follow these standards when creating and updating documentation for Firebolt Certification Application (FCA). These standards aim to provide a seamless user experience and ensure that users can easily understand, set up, and utilize FCA features.

- Documentation should be easily navigable.
  - Avoid overwhelming users with excessive information in high-level documents.
  - High-level documents should provide a brief description of a feature, allowing users to get a quick overview.
  - For users who want more detailed information, they should be able to navigate to more specific and detailed documents.
- Users should understand why the feature is necessary and how it can benefit them.
- Documentation should include clear and comprehensive instructions on how to set up a feature. This includes any prerequisites, configurations, or installations required.
- Documentation should provide step-by-step instructions on how to effectively use the feature.
- All documentation should be written with the assumption that the reader has no prior knowledge of FCA.
  - If prior knowledge is required for a particular feature, provide links to relevant documentation or resources where users can acquire the necessary background information.

## Document Templates

Within this section, you'll discover a collection of document templates that are essential when implementing brand-new features, functionalities, plugins, or PubSub handlers in FCA.

**NOTE**: For code changes that impact existing functionality you may not need to create new documents from these templates. However, it remains crucial to update existing documentation to align with the corresponding code changes.


### [LandingPageDoc.md](LandingPageDoc.md)

This template is intended for documents that require a landing page, serving as the main entry point for documentation categories like [Documentation.md](../Documentation.md), [Plugins.md](../plugins/Plugins.md), etc... It is unlikely you will need to create a landing page but as new documents like `MainFunctionality.md`, `PluginDoc.md`, or `PubSubHandlerDoc.md` are added, the various landing pages will require updates. For example:

- A new [MainFunctionalityDoc.md](#main-functionality) is added, ensure that [Documentation.md](../Documentation.md) reflects this change.
- A new [PluginDoc.md](#plugin-doc) is added, ensure that [Plugins.md](../plugins/Plugins.md) reflects this change.
- A new [PubSubHandlerDoc.md](#pubsub-handler-doc) is added, ensure that [PubSubHandlers.md](../pubSubHandlers/PubSubHandlers.md) reflects this change.

### [Main Functionality](MainFunctionalityTemplate.md)

This template is intended for documenting cohesive sets of functionality within FCA, such as Executions, Validations, and more. You have the option to either create this document from scratch when introducing a new set of documentation or, more commonly, add new features to an existing document. For instance, when a new execution feature is introduced, the relevant document (e.g., [Executions.md](../Execution.md)) must be updated following this template to maintain consistency and structure.

### [Plugin Doc](PluginTemplate.md)

This template is for plugins that users can implement to enhance its base functionality. Document specific plugins with ease by creating or extending this document. Whether you're introducing a new plugin or adding more information about an existing one, this template keeps your plugin-related documentation consistent and informative.

### [PubSub Handler Doc](PubSubHandlerTemplate.md)

Use this template when documenting specific PubSub Handlers and their expected inputs and outputs. Typically, you'll use this template when adding a new PubSub Handler to your application. It guides you through explaining the intricacies of a PubSub interaction.





