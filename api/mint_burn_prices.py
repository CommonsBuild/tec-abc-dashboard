from pip._vendor import requests
from http.server import BaseHTTPRequestHandler
import json

def query_graph(query):
    payload = {
        "query": query
    }
    url = "https://api.thegraph.com/subgraphs/name/mateodaza/tec-abc-subgraph"
    header = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    } 

    res = requests.post(url, headers=header, data=json.dumps(payload))
    return res.json()

def get_monthly_mean(data, price_string):
    from pandas import json_normalize, to_datetime
    df = json_normalize(data)
    df['timestamp'] = to_datetime(df['timestamp'], unit='s', errors='coerce')
    print(df['timestamp'])
    df[price_string] = df[price_string].apply(lambda x: float(x)/1e6)
    monthly_avg = df.groupby(df['timestamp'].dt.to_period('M'))[price_string].mean()
    return json.loads(monthly_avg.to_json())

class handler(BaseHTTPRequestHandler):
  def do_GET(self):
    burn_query = "query { sellOrders(skip: 0) { id, timestamp, price, burnPrice } }"
    burn_response = query_graph(burn_query)

    mint_query = "query { buyOrders(skip: 0) { id, timestamp, price, mintPrice } }"
    mint_response = query_graph(mint_query)

    burn_data = burn_response["data"]["sellOrders"]
    mint_data = mint_response["data"]["buyOrders"]

    burn_monthly_avg = get_monthly_mean(burn_data, "burnPrice")
    mint_monthly_avg = get_monthly_mean(mint_data, "mintPrice")
    print(burn_monthly_avg)
    month_avg = {
        "burn": { **burn_monthly_avg, "2022-01": float(burn_data[0]["burnPrice"])/1e6},
        "mint": { **mint_monthly_avg, "2022-01": float(mint_data[0]["mintPrice"])/1e6},
    }
    month_avg_json = json.dumps(month_avg)

    self.send_response(200)
    self.send_header('Content-type','text/plain')
    self.end_headers()
    return self.wfile.write(month_avg_json.encode(encoding="utf_8"))
