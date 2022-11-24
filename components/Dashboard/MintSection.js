import React, { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import colors from 'utils/colors'
import Image from 'next/image'
import { useWalletAugmented } from 'lib/wallet'
import { formatUnits, parseUnits } from 'lib/web3-utils'
import {
  useTokenBalance,
  useGetNewMintPrice,
  useBondingCurvePrice,
} from 'lib/web3-contracts'
import { capitalizeFirstLetter, formatNumber } from 'utils'
import { collateral, bonded } from '../../config'
import Balance from 'components/SplitScreen/Balance'
import { useConvertInputs } from './useConvertInputs'
import ManageConversion from './ManageConversion'

const options = [collateral.symbol, bonded.symbol]

const Amount = ({
  token,
  amount,
  Balance,
  primary,
  secondary,
  disabled,
  onChange,
}) => {
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
          flex-direction: column;
          justify-content: center;
          background: ${secondary};
        `}
      >
        <input
          type="number"
          min="0"
          value={amount || ''}
          placeholder="000.000"
          onChange={onChange}
          disabled={!account || disabled}
          onFocus={event => event.target.select()}
          onWheel={e => e.target.blur()}
        />
        <div>
          <Balance />
        </div>
      </div>
    </AmountContainer>
  )
}

function MintSection() {
  const [select, setSelection] = useState('mint')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [startTx, setStartTx] = useState(false)
  const [token0, setToken0] = useState(null)
  const [token1, setToken1] = useState(null)
  const mainToken = bonded.symbol
  const collateralToken = collateral.symbol
  const { account } = useWalletAugmented()
  const toBonded = select === 'mint'

  const {
    amountSource,
    inputValueRecipient,
    inputValueSource,
    amountMinWithSlippage,
    amountMinWithSlippageFormatted,
    entryTributePct,
    exitTributePct,
    pricePerUnitReceived,
    amountRetained,
    resetInputs,
    handleManualInputChange,
  } = useConvertInputs(options[1], toBonded) // WXDAI

  const reservePercentage = toBonded ? (100 - entryTributePct) / 100 : 1
  const commonPercentage = toBonded
    ? entryTributePct / 100
    : exitTributePct / 100

  const chartValues = {
    a: toBonded
      ? collateralToken
      : `${100 - exitTributePct}% ${collateralToken}`,
    b: toBonded ? `${entryTributePct}%` : `${exitTributePct}%`,
    c: mainToken,
    d: toBonded ? `${100 - entryTributePct}%` : `100%`,
  }
  const amountToReserve = token0 && token0 * reservePercentage
  const amountToCommon = token0 && token0 * commonPercentage

  // console.log({ amountSource: formatUnits(amountSource), token0, token1 })
  const _newMintPrice = useGetNewMintPrice(token1, token0, toBonded)
  const { pricePerUnit: newBurnPrice } = useBondingCurvePrice(
    amountSource,
    false
  )
  const _newBurnPrice = formatUnits(newBurnPrice)

  const [collateralBalance, spendableCollateralBalance] = useTokenBalance(
    options[0]
  )
  const [tokenBalance, spendableTokenBalance] = useTokenBalance(options[1])

  const collateralErrorBalance = useMemo(
    () =>
      amountSource.gt(collateralBalance) &&
      !amountSource.eq(-1) &&
      !collateralBalance.eq(-1),
    [amountSource, collateralBalance, spendableCollateralBalance]
  )

  const tokenErrorBalance = useMemo(
    () =>
      amountSource.gt(tokenBalance) &&
      !amountSource.eq(-1) &&
      !tokenBalance.eq(-1),
    [amountSource, tokenBalance, spendableTokenBalance]
  )

  const amountInputError =
    (toBonded && collateralErrorBalance) || (!toBonded && tokenErrorBalance)

  // console.log('HERE', {
  //   amountSource,
  //   inputValueRecipient,
  //   inputValueSource,
  //   amountRetained,
  //   amountMinWithSlippage,
  //   amountMinWithSlippageFormatted,
  //   pricePerUnitReceived,
  //   bondingCurvePrice: formatUnits(bondingCurvePrice),
  //   bondingCurvePricePerUnit: 1 / formatUnits(bondingCurvePricePerUnit),
  //   entryTribute: formatUnits(entryTribute),
  //   exitTribute: formatUnits(exitTribute),
  //   newMintPrice,
  // })

  useEffect(() => {
    const formatNumber = val =>
      inputValueRecipient.replaceAll(',', '').toString()
    if (toBonded) {
      //Minting
      setToken1(formatNumber(inputValueRecipient))
    } else {
      //Burning
      setToken0(formatNumber(inputValueRecipient))
    }
  }, [amountMinWithSlippageFormatted])

  const checkNumberVal = val => {
    if (/^(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?$/.test(val)) return
    if (Number(val) < 0) {
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
          setToken0(null)
          setToken1(null)
          resetInputs()
        }}
      >
        <p>{type === 'mint' ? 'Mint' : 'Burn'}</p>
        <EntryText>
          {type === 'mint' ? 'Entry' : 'Exit'} Tribute{' '}
          {type === 'mint' ? entryTributePct : exitTributePct}%
        </EntryText>
      </SelectButton>
    )
  }

  const Inputs = [
    () => (
      <>
        <Amount
          token={collateralToken}
          primary="#393741"
          secondary="#00707A"
          amount={token0}
          onChange={e => {
            e.preventDefault()
            const val = e.target.value
            if (checkNumberVal(val)) return
            setToken0(val)
            handleManualInputChange(val, toBonded)
          }}
          disabled={!toBonded}
          Balance={() => (
            <Balance
              tokenBalance={collateralBalance}
              spendableBalance={spendableCollateralBalance}
              tokenAmountToConvert={amountSource}
              noShowError={select === 'burn'}
              insideInput
            />
          )}
        />
      </>
    ),
    () => (
      <>
        <Amount
          token={mainToken}
          primary="#0E684C"
          secondary="#137556"
          amount={token1}
          onChange={e => {
            e.preventDefault()
            const val = e.target.value
            if (checkNumberVal(val)) return
            setToken1(val)
            handleManualInputChange(val, toBonded)
          }}
          disabled={toBonded}
          Balance={() => (
            <Balance
              tokenBalance={tokenBalance}
              spendableBalance={spendableTokenBalance}
              tokenAmountToConvert={amountSource}
              noShowError={select === 'mint'}
              insideInput
            />
          )}
        />
      </>
    ),
  ]

  return (
    <>
      {account && startTx && (
        <Modal
          isOpen={startTx}
          onRequestClose={() => setStartTx(false)}
          style={modalStyle}
          contentLabel="Conversion Modal"
        >
          <ManageConversion
            toBonded={toBonded}
            fromAmount={amountSource}
            handleReturnHome={() => setStartTx(false)}
            minReturn={amountMinWithSlippage}
          />
        </Modal>
      )}
      <div
        css={`
          display: flex;
          flex-direction: row;
          gap: 30px;
          justify-content: center;
          margin: 48px 0 0 0;
        `}
      >
        <Left>
          <LeftBox>
            <MainButtons>
              <Selection type="mint" />
              <Selection type="burn" />
            </MainButtons>
            {toBonded
              ? Inputs.map(Input => {
                  return Input()
                })
              : Inputs.reverse().map(Input => {
                  return Input()
                })}
            <Button
              onClick={() => {
                if (!acceptedTerms) return alert('please accept the terms')
                if (!token0 || token0 <= 0 || !token1 || token1 < 0) return
                setStartTx(!startTx)
              }}
              disabled={!acceptedTerms || amountInputError}
              css={`
                background: ${select === 'mint' ? colors.mint : colors.red};
                cursor: ${acceptedTerms && !amountInputError
                  ? 'pointer'
                  : 'not-allowed'};
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
            <InputContainer onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <input type="checkbox" checked={acceptedTerms} />
              <p>
                {` By clicking on "${capitalizeFirstLetter(
                  select
                )}" you are accepting `}{' '}
                <a>these terms</a>
              </p>
            </InputContainer>
          </LeftBox>
          <LowContainer>
            <Buttons>
              <BigButton target="_blank" href="https://wrapeth.com/">
                Wrap xDAI
              </BigButton>
              <BigButton target="_blank" href="https://bridge.gnosischain.com/">
                Bridge DAI
              </BigButton>
            </Buttons>
            <a
              target="_blank"
              href="https://token-engineering-commons.gitbook.io/tec-handbook/how-to-purchase-usdtec"
              rel="noreferrer"
            >
              or learn how to purchase xDAI
            </a>
          </LowContainer>
        </Left>
        <Right>
          <Chart>
            {toBonded ? (
              <Image
                src="/images/flowchart_mint.png"
                width="461px"
                height="335px"
                placeholder="blur"
                blurDataURL="/images/tec.png"
              />
            ) : (
              <Image
                src="/images/flowchart_burn.png"
                width="461px"
                height="335px"
                placeholder="blur"
                blurDataURL="/images/tec.png"
              />
            )}
            <ChartSecondaryValues>
              <div>
                <p>{chartValues.a}</p>
                <p>{chartValues.b}</p>
              </div>
              <div>
                <p>{chartValues.c}</p>
                <p>{chartValues.d}</p>
              </div>
            </ChartSecondaryValues>
            <ChartMainValues>
              <PoolValue>
                <p>{formatNumber(token0 ? amountToCommon : 0)}</p>
                <p>WXDAI</p>
              </PoolValue>
              <PoolValue>
                <p>{formatNumber(token0 ? amountToReserve : 0)}</p>
                <p>WXDAI</p>
              </PoolValue>
            </ChartMainValues>
          </Chart>

          <NewPrice>
            <p>New {toBonded ? 'Mint' : 'Burn'} Price</p>
            <div />
            <p>
              $
              {parseFloat(
                token0 ? (toBonded ? _newMintPrice : _newBurnPrice) : 0
              )?.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </p>
          </NewPrice>
        </Right>
      </div>
    </>
  )
}

const modalStyle = {
  content: {
    width: '100vw',
    left: 0,
    top: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    backgroundColor: '#f9fafc',
  },
}

const Left = styled.div`
  display: flex;
  flex: 0.3;
  flex-direction: column;
`

const LeftBox = styled.div`
  max-width: 419px;
  background: #191919;
  border-radius: 11px;
  padding: 14px;
  align-items: center;
  justify-content: center;
`
const Right = styled.div`
  display: flex;
  position: relative;
  flex: 0.7;
  width: 677px;
  height: 442px;
  flex-direction: row;
  justify-content: center;
  background: #191919;
  border-radius: 11px;
  padding: 45px 0 0 0;
`
const Chart = styled.div`
  flex-direction: column;
  margin: -10px 0 0 40px;
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
  justify-content: center;
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
    justify-content: center;
    align-items: center;
    border-radius: 0px 10.466px 10.466px 0px;
    input {
      background: transparent;
      border: none;
      font-size: 34.2524px;
      color: white;
      width: 200px;
    }
    input:focus {
      outline: none;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input::placeholder {
      color: rgba(255, 255, 255, 0.5);
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
  input {
    text-align: center;
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

const InputContainer = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
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

const ChartMainValues = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: white;
  width: 511px;
  margin: -8px 0;
  padding: 0 46px 0 0;
`

const ChartSecondaryValues = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  justify-content: center;
  align-items: center;
  color: white;
  width: 100%;
  height: 235px;
  margin: -286px 0;
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
  div:first-child {
    height: 70%;
    margin: 0 0 0 -210px;
  }
  div:nth-child(2) {
    height: 70%;
    margin: 0 0 0 110px;
  }
  p {
    width: 77px;
    height: 27px;
    font-weight: 500;
    font-size: 13.4179px;
    line-height: 17px;
    color: #d2f67b;
    padding: 5px 0 0 0;
  }
  p:first-child {
    font-size: 10.4179px;
  }
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
    color: white !important;
  }
`

const LowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  align-items: center;
  a {
    color: white;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    margin-top: -16px;
    text-decoration: underline;
    cursor: pointer;
  }
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  margin: 20px 0;
`

const BigButton = styled.a`
  width: 129px;
  border: 1px solid white;
  border-radius: 8px;
  padding: 10px 25px;
  text-align: center;
  color: white !important;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`

export default MintSection
