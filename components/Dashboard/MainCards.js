import React from 'react'
import styled from 'styled-components'
import { collateral, bonded } from '../../config'
import { useBondingCurvePrice } from 'lib/web3-contracts'
import { useConvertInputs } from './useConvertInputs'
import { formatLocale } from 'utils'
import { formatUnits } from 'lib/web3-utils'

function MainCards() {
  const {
    reservePoolValue,
    bondTotalSupply,
    commonPoolBalance,
  } = useBondingCurvePrice()
  const mainToken = bonded.symbol
  const collateralToken = collateral.symbol
  const { pricePerUnitReceived } = useConvertInputs(bonded.symbol)

  const Card = ({ title, content, extraContent, icon, currency }) => {
    return (
      <CardContainer>
        <div>
          <Title>{title}</Title>
          <Content>
            {content}
            {'  '}
            <span style={{ color: 'white' }}>{currency}</span>
          </Content>
          {extraContent && <ExtraContent>${extraContent}</ExtraContent>}
        </div>

        <img
          src={icon}
          css={`
            width: 25px;
            height: 25px;
          `}
        />
      </CardContainer>
    )
  }
  // TODO: FETCH MARKET PRICE FROM EXTERNAL SOURCE price: 1 / pricePerUnitReceived,
  return (
    <div
      css={`
        display: flex;
        flex-direction: row;
        gap: 30px;
        justify-content: center;
      `}
    >
      <Card
        title="CIRCULATING SUPPLY"
        content={
          bondTotalSupply
            ? formatLocale(bondTotalSupply).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0
        }
        extraContent={
          bondTotalSupply
            ? (
                (1 / pricePerUnitReceived) *
                formatLocale(bondTotalSupply)
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0
        }
        icon="/icons/pool.svg"
        currency={mainToken}
      />
      <Card
        title="RESERVE"
        content={
          reservePoolValue
            ? formatLocale(reservePoolValue).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0
        }
        icon="/icons/reserve.svg"
        currency={collateralToken}
      />
      <Card
        title="COMMON POOL"
        content={
          commonPoolBalance
            ? formatLocale(commonPoolBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0
        }
        icon="/icons/supply.svg"
        currency={collateralToken}
      />
    </div>
  )
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: left;
  padding: 24px 32px;
  width: 346.03px;
  height: 164px;
  background: #000000;
  box-shadow: 0px 3.43456px 17.1728px rgba(135, 135, 135, 0.1);
  border-radius: 20.6073px;
  z-index: 1;
  margin: -60px 0 0 0;
`
const Title = styled.p`
  font-weight: 500;
  font-size: 17.1728px;
  line-height: 21px;
  color: #ffffff;
`

const Content = styled.p`
  font-weight: 500;
  font-size: 27.6615px;
  line-height: 35px;
  color: #d2f67b;
  margin: -2px 0 0 0;
`
const ExtraContent = styled.p`
  font-weight: 400;
  font-size: 24.4235px;
  line-height: 31px;
  color: #7ce0d6;
`

export default MainCards
