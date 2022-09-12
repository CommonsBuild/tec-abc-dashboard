import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import colors from 'utils/colors'
import Image from 'next/image'
import { useWalletAugmented } from 'lib/wallet'
import { useBondingCurvePrice, useTokenBalance } from 'lib/web3-contracts'
import { capitalizeFirstLetter, formatNumber, formatWEI } from 'utils'
import { collateral, bonded } from '../../config'
import ManageConversion from './ManageConversion'

const options = [collateral.symbol, bonded.symbol]

const Amount = ({ token, amount, primary, secondary, onChange }) => {
  const { account } = useWalletAugmented()
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
        <input
          type="number"
          min="0"
          value={amount}
          onChange={onChange}
          disabled={!account}
        />
      </div>
    </AmountContainer>
  )
}

function MintSection() {
  const [select, setSelection] = useState('mint')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [startTx, setStartTx] = useState(false)
  const [token0, setToken0] = useState(0)
  const [token1, setToken1] = useState(0)
  const mainToken = bonded.symbol
  const mainTokenPrice = 1.2
  const collateralToken = collateral.symbol
  const reservePercentage = 0.92
  const commonPercentage = 0.08
  const { account } = useWalletAugmented()
  const [token0Balance, spendable0Balance] = useTokenBalance(options[1]) // TEC
  const [token1Balance, spendable1Balance] = useTokenBalance(options[0]) // WXDAI

  const {
    loading: bondingPriceLoading,
    price: bondingCurvePrice,
    pricePerUnit: bondingCurvePricePerUnit,
    entryTribute,
    exitTribute,
  } = useBondingCurvePrice(token1, select === 'mint')
  console.log({
    bondingPriceLoading,
    bondingCurvePrice,
    bondingCurvePricePerUnit,
    entryTribute: formatWEI(entryTribute),
    exitTribute: formatWEI(exitTribute),
  })
  console.log({
    TEC: formatWEI(token0Balance),
    spendableTEC: formatWEI(spendable0Balance),
    wXDAI: formatWEI(token1Balance),
    spendableWXDAI: formatWEI(spendable1Balance),
  })

  const checkEmptyVal = val => {
    if (!val || Number(val) < 0) {
      setToken0(null)
      setToken1(null)
      return true
    }
    return false
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
    <>
      {account && startTx && (
        <FullScreen>
          <ManageConversion
            toBonded={select === 'mint'}
            fromAmount={'1'}
            handleReturnHome={() => setStartTx(false)}
            minReturn={'1'}
          />
        </FullScreen>
      )}
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
            amount={token0}
            onChange={e => {
              e.preventDefault()
              const val = e.target.value
              if (checkEmptyVal(val)) return
              setToken0(val)
              setToken1((val / mainTokenPrice).toFixed(1))
            }}
          />
          <Amount
            token={mainToken}
            primary="#0E684C"
            secondary="#137556"
            amount={token1}
            onChange={e => {
              e.preventDefault()
              const val = e.target.value
              if (checkEmptyVal(val)) return
              setToken1(val)
              setToken0((val * mainTokenPrice).toFixed(1))
            }}
          />
          <Button
            onClick={() => {
              setStartTx(!startTx)
            }}
            css={`
              background: ${select === 'mint' ? colors.mint : colors.red};
            `}
          >
            <p>{select === 'mint' ? 'Mint' : 'Burn'}</p>
            <p>
              {select === 'mint'
                ? `Deposit ${collateralToken} and mint ${mainToken}`
                : select === 'burn' &&
                  `Burn  ${mainToken} and get ${collateralToken} `}
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
          <Chart>
            <Image src="/images/flowchart.svg" width="511px" height="355px" />
            <ChartValues>
              <PoolValue>
                <p>{formatNumber(token0 ? token0 * commonPercentage : 0)}</p>
                <p>WXDAI</p>
              </PoolValue>
              <PoolValue>
                <p>{formatNumber(token0 ? token0 * reservePercentage : 0)}</p>
                <p>WXDAI</p>
              </PoolValue>
            </ChartValues>
          </Chart>

          <NewPrice>
            <p>New Mint Price</p>
            <div />
            <p>$0.00</p>
          </NewPrice>
        </Right>
      </div>
    </>
  )
}

const FullScreen = styled.div`
  position: absolute;
  z-index: 1000;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`

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
  position: relative;
  flex: 0.7;
  width: 677px;
  flex-direction: row;
  justify-content: center;
  background: #191919;
  border-radius: 11px;
  padding: 45px 0 0 0;
`
const Chart = styled.div`
  flex-direction: column;
  margin: 0 0 0 40px;
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
    padding: 0 0 0 6px;
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
  margin: -40px 0;
  padding: 0 19px;
`

const PoolValue = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 82px;
  align-items: center;
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
    margin: 0 0 0 2px;
  }
`

const NewPrice = styled.div`
  display: flex;
  flex-direction: column;
  width: 133px;
  position: absolute;
  right: 20px;
  div {
    border: 1.58537px solid #d2f67b;
  }
  p {
    font-weight: 500;
    font-size: 25.3659px;
    line-height: 32px;
    color: #d2f67b !important;
    margin: 0;
  }
  p:first-child {
    font-size: 19.0244px;
    color: #ffffff !important;
  }
`

export default MintSection
