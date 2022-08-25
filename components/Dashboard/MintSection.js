import React from 'react'
import styled from 'styled-components'

function MintSection() {
  return (
    <div
      css={`
        display: flex;
        flex-direction: row;
        gap: 30px;
        justify-content: center;
        margin: 48px 0 0 0;
        height: 442px;
      `}
    >
      <Left></Left>
      <Right></Right>
    </div>
  )
}

const Left = styled.div`
  display: flex;
  flex: 0.3;
  background: white;
`
const Right = styled.div`
  display: flex;
  flex: 0.7;
  background: white;
`

export default MintSection
