import React from 'react'
import styled from 'styled-components'
import NavBar from 'components/NavBar/NavBar'
import TopContainer from './TopContainer'
import MainCards from './MainCards'
import MintSection from './MintSection'
import BondingCurve from './BondingCurve'
import HistoricalPrice from './HistoricalPrice'
import LastTransactions from './LastTransactions'

function Dashboard() {
  return (
    <>
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
          opacity: 0.8;
          border-radius: 100px 100px 0px 0px;
          margin: 136px 0 0 0;
          padding: 0 117px;
          align-items: center;
        `}
      >
        <MainCards />
        <MintSection />
        <Separator />
        <BondingCurve />
        <Separator />
        <HistoricalPrice />
        <Separator />
        <LastTransactions />
      </div>
    </>
  )
}

const Separator = styled.div`
  border: 1px solid #b0ece6;
  margin: 44px 0;
  width: 100%;
  max-width: 824px;
`

export default Dashboard
