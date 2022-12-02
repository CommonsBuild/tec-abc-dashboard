import React, { useEffect } from 'react'
import { bonded } from '../../config'
import { useConvertInputs } from './useConvertInputs'
import { useBondingCurvePrice } from 'lib/web3-contracts'
import { formatLocale } from 'utils'

function Item({ title, content }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        color: white;
        @media screen and (max-width: 1100px) {
          margin: 20px 0 0 0;
        }
      `}
    >
      <p>{title}</p>
      <p>{content}</p>
    </div>
  )
}

function TopContainer() {
  const { amountSource, entryTributePct, exitTributePct } = useConvertInputs(
    bonded.symbol
  ) // WXDAI

  const { pricePerUnit: mintPricePerUnit } = useBondingCurvePrice(
    amountSource,
    true
  ) // mint

  const { pricePerUnit: burnPricePerUnit } = useBondingCurvePrice(
    amountSource,
    false
  ) // burn

  const mintPrice = formatLocale(mintPricePerUnit)
    ? (1 / formatLocale(mintPricePerUnit)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 0
  const burnPrice = formatLocale(burnPricePerUnit)
    ? formatLocale(burnPricePerUnit).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 0

  return (
    <>
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 40px;
          align-items: center;
          div:nth-child(2) {
            display: flex;
            padding: 0 40px 0 0;
            border-right: 1.20548px solid #ffffff;
            height: 88px;
            justify-content: center;
          }
          div:last-child {
            border: none; /* remove border ? */
          }
        `}
      >
        <Item title="Mint Price" content={`$${mintPrice}`} />
        <Item title="Burn Price" content={`$${burnPrice}`} />
        <Item title="Entry Tribute" content={`${entryTributePct}%`} />
        <Item title="Exit Tribute" content={`${exitTributePct}%`} />
      </div>
    </>
  )
}

export default TopContainer
