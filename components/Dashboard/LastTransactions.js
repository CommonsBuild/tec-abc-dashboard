import React, { useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { MainTitle } from './Helpers'

function LastTransactions() {
  useEffect(() => {
    const getData = async () => {
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
      }
      const variables = {
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
      }
      const graphqlQuery = {
        operationName: 'GetResult',
        query: `query GetResult($query_id: Int!, $parameters: [Parameter!]) {
            get_result_v2(query_id: $query_id, parameters: $parameters) {
              job_id    
              result_id   
              error_id    
              __typename  
            }
          }`,
        variables,
      }
      try {
        // const response = await axios({
        //   url: endpoint,
        //   method: 'post',
        //   headers: headers,
        //   data: graphqlQuery,
        // })
        const response = await axios({
          method: 'post',
          url: endpoint,
          headers: headers,
          data: graphqlQuery,
          withCredentials: false,
        })
        console.log({ response })
      } catch (error) {
        console.log({ error })
      }
    }
    getData()
  }, [])

  return (
    <div>
      <BigTitle>
        <MainTitle value={'Last Transactions'} size="32px" />
      </BigTitle>
      <TableContainer>
        <table>
          <tbody>
            <tr>
              <th>Account</th>
              <th>Reserve</th>
              <th>Total Supply {`(TEC)`}</th>
              <th>Amount In</th>
              <th>Price</th>
              <th>Tribute</th>
              <th>Amount Out</th>
              <th>New Price</th>
            </tr>
            {[1, 2, 3, 4, 5, 6].map(i => {
              return (
                <tr>
                  <td>0x0000...0000</td>
                  <td>1000 wxDAI</td>
                  <td>1000</td>
                  <td>100000 wxDAI</td>
                  <td>1.00</td>
                  <td>100000</td>
                  <td>10000 TEC</td>
                  <td>1.38</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableContainer>
    </div>
  )
}

const BigTitle = styled.div`
  width: 1123px;
  height: 112px;
  background: #313131;
  border-radius: 11px;
  padding: 32px 27px;
`

const TableContainer = styled.div`
  width: 1123px;
  background: #313131;
  border-radius: 11px;
  color: white;
  margin: 16px 0 0 0;
  padding: 39px;

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }

  th {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #d2f67b;
    padding: 10px;
  }

  td {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
    padding: 24px 8px;
  }

  th,
  td {
    text-align: left;
    border-bottom: 1px solid white;
  }
`

export default LastTransactions
