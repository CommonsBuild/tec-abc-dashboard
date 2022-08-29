import React from 'react'
import { Container, Title } from './Helpers'

function BondingCurve() {
  const leftContent = () => {
    return (
      <div>
        <Title value="Bonding Curve" />
      </div>
    )
  }

  const rightContent = () => {
    return <div>right</div>
  }

  return <Container leftContent={leftContent()} rightContent={rightContent()} />
}

export default BondingCurve
