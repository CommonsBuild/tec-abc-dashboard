import React, { useEffect } from 'react'
import { bonded } from '../../config'
import { useConvertInputs } from './useConvertInputs'

function Item({ title, content }) {
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        color: white;
      `}
    >
      <p>{title}</p>
      <p>{content}</p>
    </div>
  )
}

function TopContainer() {
  const {
    entryTributePct,
    exitTributePct,
    pricePerUnitReceived,
  } = useConvertInputs(bonded.symbol) // WXDAI

  const mintPrice = pricePerUnitReceived
    ? (1 / pricePerUnitReceived).toFixed(2)
    : 0
  const burnPrice = pricePerUnitReceived
    ? ((1 / pricePerUnitReceived) * (1 - exitTributePct / 100)).toFixed(2)
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
