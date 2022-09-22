export default async function handler(_req, res) {
  const endpoint = 'https://core-hsr.dune.com/v1/graphql'
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    accept: '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'x-hasura-api-key': '',
    'Access-Control-Allow-Origin': '*',
    Referer: 'https://dune.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
  }
  const getResultQuery = {
    operationName: 'GetResult',
    query: `query GetResult($query_id: Int!, $parameters: [Parameter!]) {
              get_result_v2(query_id: $query_id, parameters: $parameters) {
                job_id    
                result_id   
                error_id    
                __typename  
              }
            }`,
    variables: {
      query_id: 391372,
      parameters: [
        {
          key: '1. Start Date',
          type: 'datetime',
          value: '2022-01-01 00:00:00',
        },
        {
          key: '2. End Date',
          type: 'datetime',
          value: '2023-01-01 00:00:00',
        },
      ],
    },
  }
  const getResultQueryOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(getResultQuery),
  }

  try {
    const response_1 = await fetch(endpoint, getResultQueryOptions)
    const data_1 = await response_1.json()
    const resultId = data_1.data.get_result_v2.result_id
    const findResultDataQuery = {
      operationName: 'FindResultDataByResult',
      query: `query FindResultDataByResult($result_id: uuid!, $error_id: uuid!) {
            query_results(where: { id: { _eq: $result_id}}) {
                id
                job_id
                runtime
                generated_at
                columns
                typename
            }
            query_errors(where: { id: { _eq: $error_id}}) {
                    id
                    job_id
                    runtime
                    message
                    metadata
                    type
                    generated_at
                    typename
                }
            get_result_by_result_id(args: { want_result_id: $result_id}) {
                data
                __typename
            }
        }`,
      variables: {
        result_id: resultId,
        error_id: '00000000-0000-0000-0000-000000000000',
      },
    }
    const findResultDataQueryOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(findResultDataQuery),
    }

    const response_2 = await fetch(endpoint, findResultDataQueryOptions)
    const data = await response_2.json()
    return res.status(200).json({ data, resultId })
  } catch (error) {
    console.log({ error })
    return res.status(400).json({ error })
  }
}
