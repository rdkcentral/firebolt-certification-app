# FCA: Reporting

TODO: add intro

## Table of Contents

- [Supported Ways of Retrieving Reports](#supported-ways-of-retrieving-reports)
- [Supported Report Parameters](#supported-report-parameters)

## Supported ways of retrieving reports

EXISTING CONTENTS(needs revision):
```
- From UI

  - After executing suite from the UI in FCA, the mocha json will upload to S3.
  - Download the `json report` from S3 and convert it to `html report`
    - `arn:aws:s3:::your-s3-Bucket-name`
  - Steps to convert into `html report`
    1.  Move the `json report` to root folder
    2.  Run the command `yarn marge filename.json -f report -o /destination_path`
    3.  Check the `html report` on the destination path.
```

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details

## Supported Report Parameters

EXISTING CONTENTS(needs revision):
```
- Schema: Schema validation response of each API’s. whether it passed/failed. Validation is done based on the Open RPC document
- Content: Behavioural validation can be done.
- Message: Defines the Schema of the API from the Open RPC document.
- Actual: The API response which is invoked by FCA on the device is stored in actual.
- Error: Based on the schema validation done by FCA, if the schema validation fails then reason of failure is stored in error.
```

### Background

TODO: add details

### Setup

TODO: add details

### Usage

TODO: add details
