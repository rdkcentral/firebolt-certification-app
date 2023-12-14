# GetTestHandler 

## Overview

GetTestHandler is invoked when the task specified in the intent has the value "getTest". This handler is used to fetch mochawesome report from FCA.

It performs the following actions:
1. Parses the input message received to get the job ID of the report to be fetched.
2. Fetches the mochawesome report based on the job ID received.
3. Sends the response back to the IntentReader.

## Usage

### Request Format

```json
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": "<jobId>"
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }
```

#### Parameters

| Key                 | Description                                                                     | Required?   |
| ------------------- | ------------------------------------------------------------------------------- | ----------- |
| task                | "getTest"- It is a static value and should not be changed for this handler      | Y           |
| params              | Required job ID params for the intent. Here, "jobId" is a mandatory parameter   | Y           |
| appType             | Corresponding intent is launching on which app                                  | Y           |


### Response Format
* Response can be either the valid report in json format or error response string as "Report not generated from firebolt"

```json
    {
    "stats": {
        "pending": 0,
        "pendingPercent": 0,
        "other": 0,
        "hasOther": false,
        "skipped": 13,
        "hasSkipped": true,
        "suites": 1,
        "duration": 97019,
        "tests": 199,
        "start": "<startTime>",
        "end": "<endTime>",
        "testsRegistered": 199,
        "passes": 178,
        "failures": 8,
        "passPercent": 89
    },
    "results": [
        {
            "uuid": "4e1e...",
            "title": "Firebolt SDK Version : <version> , Mode : <Mode> , Firmware : <Firmware> , Hash : <Hash> , AppId : <AppId",
            "fullFile": "",
            "file": "",
            "beforeHooks": [],
            "afterHooks": [],
            "tests": [],
            "suites": [
                {
                    "uuid": "cef6...",
                    "title": "CORE",
                    "fullFile": "",
                    "file": "",
                    "beforeHooks": [],
                    "afterHooks": [],
                    "tests": [
                        {
                            "title": "",
                            "fullTitle": "",
                            "duration": 81,
                            "state": "passed",
                            "pass": true,
                            "fail": false,
                            "code": "{}",
                            "err": {
                                "err": "No error found"
                            },
                            "uuid": "0913...",
                            "parentUUID": "cef6...",
                            "timedOut": false,
                            "speed": "fast",
                            "pending": false,
                            "context": "{}",
                            "isHook": false,
                            "skipped": false
                        },
                        "..."
                    ],
                    "suites": [],
                    "passes": [
                        "0913...",
                        "..."
                    ],
                    "failures": [
                        "1717...",
                        "..."
                    ],
                    "pending": [],
                    "skipped": [
                        "affe...",
                        "..."
                    ],
                    "duration": 96856,
                    "root": false,
                    "rootEmpty": false,
                    "_timeout": 0
                }
            ],
            "passes": [],
            "failures": [],
            "pending": [],
            "skipped": [],
            "duration": 0,
            "root": false,
            "rootEmpty": false,
            "_timeout": 0
        }
    ]
}
```
#### Parameters

| Key                           | Description                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| stats                         | It indicates the overall status of the suite run like count of pending, skipped, failures etc.         |
| results                       | It is an array which indicates the individual status of each test                                      |





## Examples

### Valid Intent and Response

<details>
    <summary> Request </summary>
</details>

    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": "85e5d9c......"
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }

<details>
    <summary> Response </summary>
</details>

    {
        "stats": {
            "pending": 0,
            "pendingPercent": 0,
            "other": 0,
            "hasOther": false,
            "skipped": 13,
            "hasSkipped": true,
            "suites": 1,
            "duration": 97019,
            "tests": 199,
            "start": "<startTime>",
            "end": "<endTime>",
            "testsRegistered": 199,
            "passes": 178,
            "failures": 8,
            "passPercent": 89
        },
        "results": [
            {
                "uuid": "4e1e...",
                "title": "Firebolt SDK Version : <version> , Mode : <Mode> , Firmware : <Firmware> , Hash : <Hash> , AppId : <AppId",
                "fullFile": "",
                "file": "",
                "beforeHooks": [],
                "afterHooks": [],
                "tests": [],
                "suites": [
                    {
                        "uuid": "cef6...",
                        "title": "CORE",
                        "fullFile": "",
                        "file": "",
                        "beforeHooks": [],
                        "afterHooks": [],
                        "tests": [
                            {
                                "title": "",
                                "fullTitle": "",
                                "duration": 81,
                                "state": "passed",
                                "pass": true,
                                "fail": false,
                                "code": "{}",
                                "err": {
                                    "err": "No error found"
                                },
                                "uuid": "0913...",
                                "parentUUID": "cef6...",
                                "timedOut": false,
                                "speed": "fast",
                                "pending": false,
                                "context": "{}",
                                "isHook": false,
                                "skipped": false
                            },
                            "..."
                        ],
                        "suites": [],
                        "passes": [
                            "0913...",
                            "..."
                        ],
                        "failures": [
                            "1717...",
                            "..."
                        ],
                        "pending": [],
                        "skipped": [
                            "affe...",
                            "..."
                        ],
                        "duration": 96856,
                        "root": false,
                        "rootEmpty": false,
                        "_timeout": 0
                    }
                ],
                "passes": [],
                "failures": [],
                "pending": [],
                "skipped": [],
                "duration": 0,
                "root": false,
                "rootEmpty": false,
                "_timeout": 0
            }
        ]
    }


----------------------------------------------------------------------------------------------------------------------

### Invalid Intent and Response

<details>
    <summary> Empty JobId  </summary>
</details>
    
    {
        "action": "search",
        "data": {
            "query": {
                "task": "getTest",
                "params": {
                    "jobId": ""
                },
                "action": "NA",
                "appType": "firebolt"
            }
        },
        "context": {
            "source": "device"
        }
    }


<details>
    <summary> Response  </summary>
</details>

    Report not generated from firebolt
