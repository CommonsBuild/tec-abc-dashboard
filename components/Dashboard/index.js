import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import NavBar from 'components/NavBar/NavBar'
import TopContainer from './TopContainer'
import MainCards from './MainCards'
import MintSection from './MintSection'
import HistoricalPrice from './HistoricalPrice'
import LastTransactions from './LastTransactions'
import BondingCurve from './BondingCurve'

function Dashboard(props) {
  const [chartPriceVsBalance, setChartPriceVsBalance] = useState(null)

  useEffect(() => {
    const bondingCurveData = async () => {
      try {
        axios
          .post(
            'https://dev-commons-config-backend.herokuapp.com/augmented-bonding-curve',
            null,
            {
              params: {
                openingPrice: '1.00',
                commonsTribute: 0.6888,
                entryTribute: 0.02,
                exitTribute: 0.12,
                stepList: "[[1000000, 'wxDAI']]",
                initialBuy: 265000,
                ragequitAmount: 35795,
                zoomGraph: '0',
                includeMilestones: 1,
                virtualSupply: 1,
                virtualBalance: 1,
              },
            }
          )
          .then(function(response) {
            setChartPriceVsBalance(response?.data?.chartData)
          })
          .catch(function(error) {
            console.log({ error })
          })
      } catch (error) {
        console.log({ error })
      }
    }
    // Fetch info
    bondingCurveData()
  }, [])
  // console.log({ chartPriceVsBalance })
  return (
    <div>
      <NavBar />
      <TopContainer />
      <div
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 2874px;
          background: linear-gradient(
            324.02deg,
            #defb48 11.35%,
            #03b3ff 91.48%
          );
          border-radius: 100px 100px 0px 0px;
          margin: 136px 0 0 0;
          padding: 0 117px 117px;
          align-items: center;
        `}
      >
        <MainCards />
        <MintSection />
        <Separator />
        <BondingCurve chartData={chartPriceVsBalance} />
        <Separator />
        <HistoricalPrice chartData={chartPriceVsBalance} {...props} />
        <Separator />
        <LastTransactions {...props} />
      </div>
    </div>
  )
}

const Separator = styled.div`
  border: 1px solid #b0ece6;
  margin: 44px 0;
  width: 100%;
  max-width: 824px;
`

export default Dashboard
