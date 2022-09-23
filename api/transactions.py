import requests
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    url = "https://core-hsr.dune.com/v1/graphql"

    # first query

    payload = json.dumps({
      "operationName": "GetResult",
      "variables": {
        "query_id": 391372,
        "parameters": [
          {
            "key": "1. Start Date",
            "type": "datetime",
            "value": "2022-01-01 00:00:00"
          },
          {
            "key": "2. End Date",
            "type": "datetime",
            "value": "2023-01-01 00:00:00"
          }
        ]
      },
      "query": "query GetResult($query_id: Int!, $parameters: [Parameter!]) {\n  get_result_v2(query_id: $query_id, parameters: $parameters) {\n    job_id\n    result_id\n    error_id\n    __typename\n  }\n}\n"
    })
    headers = {
      'content-type': 'application/json',
      'x-hasura-api-key': ''
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    result_id = json.loads(response.text)['data']['get_result_v2']['result_id']

    # second query

    payload = "{\"operationName\":\"FindResultDataByResult\",\"variables\":{\"result_id\":\""+result_id+"\",\"error_id\":\"00000000-0000-0000-0000-000000000000\"},\"query\":\"query FindResultDataByResult($result_id: uuid!, $error_id: uuid!) {\\n  query_results(where: {id: {_eq: $result_id}}) {\\n    id\\n    job_id\\n    runtime\\n    generated_at\\n    columns\\n    __typename\\n  }\\n  query_errors(where: {id: {_eq: $error_id}}) {\\n    id\\n    job_id\\n    runtime\\n    message\\n    metadata\\n    type\\n    generated_at\\n    __typename\\n  }\\n  get_result_by_result_id(args: {want_result_id: $result_id}) {\\n    data\\n    __typename\\n  }\\n}\\n\"}"
    headers = {
      'x-hasura-api-key': '',
      'Content-Type': 'text/plain'
    }

    response_2 = requests.request("POST", url, headers=headers, data=payload)

    self.send_response(200)
    self.send_header('Content-type','text/plain')
    self.end_headers()
    return self.wfile.write(response_2.text.encode(encoding='utf_8'))
