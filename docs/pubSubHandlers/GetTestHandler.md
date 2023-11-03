# GetTestHandler 

Handler that fetch mochawesome report from FCA with the additional parameter as jobId is added to params field in the payload.By using in conjunction with asynchronous as "true" in runTest.This handler intent is identified with field as task and value as "getTest" alone with jobId as param in the payload.There are few optional parameters like action,appType.

* [Valid Intent and Response](#valid-intent-and-response)
* [Invalid Intent and Response](#invalid-intent-and-response)

## Valid Intent and Response

Sample Intent

	{
            "action": "search",
            "data": {
                "query": "{\"task\":\"getTest\",\"params\":{\"jobId\":\"85e5d9c7-420c-4272-96ca-3616ced55564\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Required Intent Fields : 
    - action: "search"
    - data: { query: "{"task":"getTest","params":{"jobId":"85e5d9c7-420c-4272-96ca-3616ced55564"}"appType":"firebolt"}"}
    - context: { "source": "device"}

- Optional Intent Fields :
    - data: { query: "{"action":"NA"}"}

## Invalid Intent and Response

- Scenario: If we are not able to generate report ,that is jobId is not passed and isReportGenerated is "false" 
- Sample error intent 
    
            {
            "action": "search",
            "data": {
                "query": "{\"task\":\"getTest\",\"params\":{\"jobId\":\"\"},\"action\":\"NA\",\"appType\":\"firebolt\"}"
            },
            "context": {
                "source": "device"
            }
        }

- Sample response

            Report not generated from firebolt
