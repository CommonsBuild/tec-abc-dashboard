import React from 'react'
import axios from 'axios'
import Dashboard from '../components/Dashboard'

export default props => {
  console.log({ data: props })
  return <Dashboard {...props} />
}

export async function getServerSideProps() {
  const path =
    process.env.NEXT_PUBLIC_ENV === 'develop'
      ? 'http://localhost:3000'
      : 'https://tec-abc-dashboard.vercel.app'

  const mintBurnPrices = await fetch(`${path}/api/mint_burn_prices`).then(res =>
    res.json()
  )

  const _transactions = await axios({
    url: 'https://api.thegraph.com/subgraphs/name/mateodaza/tec-abc-subgraph',
    method: 'post',
    data: {
      query: `
        query AllOrders {
          sellOrders(skip: 0) {
            id
            hash
            timestamp
            supplyBalance
            reserveBalance
            price
            burnPrice
            reserveRatio
            sellAmount
            returnedAmount
            fee
            newPrice
          }
          buyOrders(skip: 0) {
            id
            hash
            timestamp
            supplyBalance
            reserveBalance
            price
            mintPrice
            reserveRatio
            purchaseAmount
            returnedAmount
            fee
            newPrice
          }
        }
        `,
    },
  }).then(result => {
    return result?.data
      ? [...result.data.data.buyOrders, ...result.data.data.sellOrders].sort(
          (a, b) => b.timestamp - a.timestamp
        )
      : []
  })

  return {
    props: {
      transactions: _transactions ? _transactions : null,
      mintBurnPrices: mintBurnPrices,
    },
  }
}
