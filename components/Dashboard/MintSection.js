import React, { useState } from 'react'
import styled from 'styled-components'
import colors from 'utils/colors'
import Image from 'next/image'
import { capitalizeFirstLetter } from 'utils'
import { collateral, bonded } from '../../config'

function MintSection() {
  const [select, setSelection] = useState('mint')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const mainToken = bonded.symbol
  const collateralToken = collateral.symbol
  const Amount = ({ token, amount, primary, secondary }) => {
    return (
      <AmountContainer>
        <div
          css={`
            flex: 0.4;
            background: ${primary};
          `}
        >
          <p>{token}</p>
        </div>
        <div
          css={`
            flex: 0.6;
            background: ${secondary};
          `}
        >
          <input type="number" value={amount} />
        </div>
      </AmountContainer>
    )
  }

  const Selection = ({ type }) => {
    let color = ''
    select === 'mint' && type === 'mint' && (color = colors.mint)
    select === 'burn' && type === 'burn' && (color = colors.red)
    return (
      <SelectButton
        style={{
          backgroundColor: color,
        }}
        onClick={() => {
          setSelection(type)
        }}
      >
        <p>{type === 'mint' ? 'Mint Price' : 'Burn Price'}</p>
        <EntryText>Entry Tribute 8%</EntryText>
      </SelectButton>
    )
  }

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
      <Left>
        <MainButtons>
          <Selection type="mint" />
          <Selection type="burn" />
        </MainButtons>
        <Amount
          token={collateralToken}
          primary="#393741"
          secondary="#00707A"
          amount={0}
        />
        <Amount
          token={mainToken}
          primary="#0E684C"
          secondary="#137556"
          amount={0}
        />
        <Button
          css={`
            background: ${select === 'mint' ? colors.mint : colors.red};
          `}
        >
          <p>{select === 'mint' ? 'Mint' : 'Burn'}</p>
          <p>
            {`Deposit ${collateralToken} and ${
              select === 'mint' ? 'Mint' : 'Burn'
            } ${mainToken}`}
          </p>
        </Button>
        <InputContainer>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
          />
          <p>
            {` By clicking on "${capitalizeFirstLetter(
              select
            )}" you are accepting `}{' '}
            <a>these terms</a>
          </p>
        </InputContainer>
      </Left>
      <Right>
        <Image src="/images/flowchart.svg" width="511px" height="320px" />
        <ChartValues>
          <PoolValue>
            <p>0.000</p>
            <p>WXDAI</p>
          </PoolValue>
          <PoolValue>
            <p>0.000</p>
            <p>WXDAI</p>
          </PoolValue>
        </ChartValues>
      </Right>
    </div>
  )
}

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.3;
  max-width: 419px;
  background: #191919;
  border-radius: 11px;
  padding: 14px;
`
const Right = styled.div`
  display: flex;
  flex: 0.7;
  max-width: 777px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #191919;
  border-radius: 11px;
`

const MainButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
`

const SelectButton = styled.div`
  background: #2a2828;
  border-radius: 10.466px;
  width: 189.34px;
  max-height: 100.85px;
  padding: 24px 15px;
  cursor: pointer;
  p {
    font-weight: 500;
    font-size: 22.835px;
    line-height: 29px;
    color: #ffffff;
    margin: 0 0 4px 0;
  }
`

const EntryText = styled.div`
  font-weight: 400;
  font-size: 11.4175px;
  line-height: 14px;
  color: #ffffff;
  padding: 4px 7px;
  display: inline-block;
  border: 0.951456px solid #ffffff;
  border-radius: 28.5437px;
`

const AmountContainer = styled.div`
  display: flex;
  width: 392px;
  height: 95.15px;
  background: #393741;
  border-radius: 10.466px;
  margin: 12px 0 0 0;
  div:first-child {
    border-radius: 10.466px 0px 0px 10.466px;
  }
  div:nth-child(2) {
    display: flex;
    justify-content: flex-start;
    border-radius: 0px 10.466px 10.466px 0px;
    input {
      background: transparent;
      border: none;
      font-size: 34.2524px;
      color: white;
      width: 200px;
      margin: 0 0 0 20px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    font-weight: 500;
    font-size: 34.2524px;
    line-height: 43px;
    color: #ffffff;
  }
`

const Button = styled.button`
  width: 100%;
  height: 65.65px;
  background: #0a3711;
  border-radius: 10.466px;
  margin: 12px 0;
  border: none;
  cursor: pointer;
  p {
    font-weight: 500;
    font-size: 22.835px;
    line-height: 29px;
    color: #ffffff;
  }
  p:nth-child(2) {
    margin: -14px 0 0 0;
    font-weight: 500;
    font-size: 10.6388px;
    line-height: 13px;
    text-align: center;
    color: #eeeeee;
  }
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  p {
    font-weight: 500;
    font-size: 10.6563px;
    line-height: 118%;
    text-align: center;
    color: #ffffff;
    padding: 14px 0 0 6px;
  }
  input[type='checkbox'] {
    display: block;
    outline: none;
    border-radius: 1.33204px;
    accent-color: #60d0da;
    box-sizing: border-box;
    cursor: pointer;
  }
  a {
    color: #60d0da !important;
    cursor: pointer;
    text-decoration: underline #60d0da !important;
  }
`

const ChartValues = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  width: 511px;
  margin: -20px 0;
  padding: 0 55px 0 60px;
`

const PoolValue = styled.div`
  display: flex;
  flex-direction: column;
  p:first-child {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: #d2f67b;
  }
  p:nth-child(2) {
    font-weight: 500;
    font-size: 13.4964px;
    line-height: 17px;
    color: #d8d8d8;
    margin: -14px 0 0 2px;
  }
`

export default MintSection
