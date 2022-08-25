import React from 'react'
import NavBar from 'components/NavBar/NavBar'
import TopContainer from './TopContainer'
import MainCards from './MainCards'
import MintSection from './MintSection'

function Dashboard() {
  return (
    <>
      <NavBar />
      <TopContainer />
      <div
        css={`
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
        `}
      >
        <MainCards />
        <MintSection />
      </div>
    </>
  )
}

export default Dashboard
