from pip._vendor import requests
from http.server import BaseHTTPRequestHandler
from pandas import json_normalize, to_datetime
import json

def get_result_id(query_id):
    url = "https://core-hsr.dune.com/v1/graphql"
    payload = json.dumps({
    "operationName": "GetResult",
    "variables": {
        "query_id": query_id,
        "parameters": [
        {
            "key": "1. Start Date",
            "type": "datetime",
            "value": "2022-01-01 00:00:00"
        },
        {
            "key": "2. End Date",
            "type": "datetime",
            "value": "2025-01-01 00:00:00"
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

    return json.loads(response.text)['data']['get_result_v2']['result_id']

def find_data_by_result(result_id):
    url = "https://core-hsr.dune.com/v1/graphql"
    payload = "{\"operationName\":\"FindResultDataByResult\",\"variables\":{\"result_id\":\""+result_id+"\",\"error_id\":\"00000000-0000-0000-0000-000000000000\"},\"query\":\"query FindResultDataByResult($result_id: uuid!, $error_id: uuid!) {\\n  query_results(where: {id: {_eq: $result_id}}) {\\n    id\\n    job_id\\n    runtime\\n    generated_at\\n    columns\\n    __typename\\n  }\\n  query_errors(where: {id: {_eq: $error_id}}) {\\n    id\\n    job_id\\n    runtime\\n    message\\n    metadata\\n    type\\n    generated_at\\n    __typename\\n  }\\n  get_result_by_result_id(args: {want_result_id: $result_id}) {\\n    data\\n    __typename\\n  }\\n}\\n\"}"
    headers = {
    'x-hasura-api-key': '',
    'Content-Type': 'text/plain'
    }
    return requests.request("POST", url, headers=headers, data=payload)

def get_monthly_mean(data):
    df = json_normalize(data)
    df['data.block_time'] = to_datetime(df['data.block_time'], errors='coerce')
    monthly_avg = df.groupby(df['data.block_time'].dt.month)['data.price_per_token'].mean()
    return json.loads(monthly_avg.to_json())


class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    burn_result_id = get_result_id(421552)
    burn_response = find_data_by_result(burn_result_id)

    mint_result_id = get_result_id(461108)
    mint_response = find_data_by_result(mint_result_id)

    burn_data = burn_response.json()["data"]["get_result_by_result_id"]
    mint_data = mint_response.json()["data"]["get_result_by_result_id"]

    burn_monthly_avg = get_monthly_mean(burn_data)
    mint_monthly_avg = get_monthly_mean(mint_data)

    month_avg = {
        "burn": burn_monthly_avg,
        "mint": mint_monthly_avg
    }
    month_avg_json = json.dumps(month_avg)

    self.send_response(200)
    self.send_header('Content-type','text/plain')
    self.end_headers()
    return self.wfile.write(month_avg_json.encode(encoding="utf_8"))
