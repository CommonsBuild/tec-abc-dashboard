import React from 'react'
import styled from 'styled-components'

export function SplitContainer({ leftContent, rightContent }) {
  return (
    <Box>
      <Left>{leftContent}</Left>
      <Right>{rightContent}</Right>
    </Box>
  )
}

export function MainTitle({ value, size = '24px' }) {
  return (
    <div>
      <StyledTitle fontSize={size}>{value}</StyledTitle>
      <div
        css={`
          width: 76.5px;
          background: #d2f67b;
          border: 3px solid #d2f67b;
          margin: 6px 0 0 0;
        `}
      />
    </div>
  )
}

export function Display({ title, content }) {
  return (
    <DisplayContainer>
      <p>{title}</p>
      <p>{content}</p>
    </DisplayContainer>
  )
}

const StyledTitle = styled.p`
  text-transform: uppercase;
  font-weight: 500;
  font-size: ${props => props.fontSize};
  line-height: 30px;
  color: #d2f67b;
`

const Box = styled.div`
  display: flex;
  flex-direction: row;
  width: 1123px;
  height: 495px;
  justify-content: center;
`

const Left = styled.div`
  display: flex;
  justify-content: space-around;
  width: 30%;
  background: #313131;
  border-radius: 11px 0px 0px 11px;
  padding: 71px 39px;
`
const Right = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  background: #000000;
  border-radius: 0 11px 11px 0;
`
const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  p:first-child {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #d2f67b;
    margin: 0 0 -2px 0;
  }
  p:nth-child(2) {
    font-weight: 500;
    font-size: 36px;
    line-height: 45px;
    color: #ffffff;
    margin: 0 0 28px 0;
  }
`
