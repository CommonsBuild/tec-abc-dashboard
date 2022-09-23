import React from 'react'
import Dashboard from '../components/Dashboard'

export default props => {
  return <Dashboard {...props} />
}

export async function getServerSideProps(context) {
  const path =
    process.env.NEXT_PUBLIC_ENV === 'develop'
      ? 'http://localhost:3000'
      : 'https://convert.tecommons.org'
  const transactions = await fetch(`${path}/api/transactions`).then(res =>
    res.json()
  )
  return {
    props: {
      transactions: transactions
        ? transactions.data.get_result_by_result_id
        : null,
    },
  }
}
