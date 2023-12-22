# Handler

## Overview

Description of what the handler achieves and the basic use case.

## Usage

```json
{
    "task": "<INTENT_ASSOCIATED_WITH_HANDLER>",
    "params": {}
}
```

### Parameters

| Key               | Description             | Required? |
|-------------------|-------------------------|-----------|
| <PARAMETER_KEY>   | <PARAMETER_DESCRIPTION> | <Y/N>     |

## Examples

### Valid Payload - <CAN HAVE MULTIPLE VAILD SCENARIOS - FOR EACH THE FOLLOWING SHOULD BE INCLUDED>

<details>
    <summary>Request</summary>
</details>

    {
        "task": "<INTENT_ASSOCIATED_WITH_HANDLER>",
        "params": {
            <PARAMS_ASSOCIATED_WITH_SCENARIO>
        }
    }

<details>
    <summary>Response</summary>
</details>

    {
        <FCA_RESPONSE>
    }
<details>
    <summary>(FOR EVENT HANDLERS) Response - Event Found</summary>
</details>

    {
        <FCA_RESPONSE>
    }
<details>
    <summary>(FOR EVENT HANDLERS) Response - Event Not Found</summary>
</details>

    {
        <FCA_RESPONSE>
    }

### Invalid Scenario - <CAN HAVE MULTIPLE INVAILD SCENARIO - FOR EACH THE FOLLOWING SHOULD BE INCLUDED>

<details>
    <summary>Request</summary>
</details>

    {
        "task": "<INTENT_ASSOCIATED_WITH_HANDLER>",
        "params": {<INVALID_SCENARIO_PARAMS>}
    }

<details>
    <summary>Response</summary>
</details>

    {
        <FCA_ERROR_RESPONSE>
    }
