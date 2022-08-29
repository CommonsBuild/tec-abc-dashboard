import React from 'react'
import styled from 'styled-components'

export function Container({ leftContent, rightContent }) {
  return (
    <Box>
      <Left>{leftContent}</Left>
      <Right>{rightContent}</Right>
    </Box>
  )
}

export function Title({ value }) {
  return (
    <div>
      <StyledTitle>{value}</StyledTitle>
      <div
        css={`
          width: 76.5px;
          background: #d2f67b;
          border: 3px solid #d2f67b;
          margin: -6px 0 0 0;
        `}
      />
    </div>
  )
}

export function Display({ title, content }) {
  return <div></div>
}

const StyledTitle = styled.p`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
  color: #d2f67b;
`

const Box = styled.div`
  display: flex;
  flex-direction: row;
  height: 495px;
  justify-content: center;
`

const Left = styled.div`
  display: flex;
  width: 365px;
  background: #313131;
  border-radius: 11px 0px 0px 11px;
  padding: 71px 39px;
`
const Right = styled.div`
  display: flex;
  width: 838px;
  background: #000000;
  border-radius: 0 11px 11px 0;
`
