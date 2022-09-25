import React from 'react'
import Dashboard from '../components/Dashboard'

export default props => {
  console.log({ props })
  return <Dashboard {...props} />
}

export async function getServerSideProps(context) {
  const path =
    process.env.NEXT_PUBLIC_ENV === 'develop'
      ? 'http://localhost:3000'
      : 'https://tec-abc-dashboard.vercel.app'
  const transactions = await fetch(`${path}/api/transactions`).then(res =>
    res.json()
  )
  const mintBurnPrices = await fetch(`${path}/api/mint_burn_prices`).then(res =>
    res.json()
  )
  return {
    props: {
      transactions: transactions
        ? transactions.data.get_result_by_result_id
        : null,
      mintBurnPrices: mintBurnPrices,
    },
  }
}
