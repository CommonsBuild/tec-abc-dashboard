import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useViewport } from 'use-viewport'

import bondedColor from '../../assets/token.svg'
import collateralColor from './xdai-color.svg'
import collateralWhite from './xdai-white.svg'

import { collateral, bonded } from '../../config'
import Image from 'next/image'

function getImage(color, symbol) {
  if (symbol === collateral.symbol) {
    return color ? collateralColor : collateralWhite
  }
  if (symbol === bonded.symbol) return bondedColor
}

function AmountInput({
  color = true,
  disabled = false,
  onChange,
  symbol,
  value,
}) {
  const viewport = useViewport()

  // Super ugly Next.js workaround to let us have differences between SSR & client
  const [isCompact, setIsCompact] = useState(false)
  const smallLayout = viewport.below(414)
  useEffect(() => {
    setTimeout(() => {
      setIsCompact(smallLayout)
    }, 0)
  }, [smallLayout])

  return (
    <label
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        height: 100%;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          font-size: 24px;
          color: ${color ? '#9096B6' : '#FFF'};
        `}
      >
        <img
          src={getImage(color, symbol)}
          alt=""
          css={`
            margin-right: 12px;
            height: 25px;
          `}
        />
        <span
          css={`
            display: flex;
            gap: 6px;
            position: relative;
            top: 1px;
            align-items: center;
            margin-left: -20px;
          `}
        >
          {symbol === 'TEC' ? (
            <Image src="/icons/tec_tiny.svg" width="32px" height="32px" />
          ) : (
            symbol === 'WXDAI' && (
              <Image
                src={`/icons/xdai_${color ? 'orange' : 'white'}_tiny.svg`}
                width="32px"
                height="32px"
              />
            )
          )}
          {symbol}
        </span>
      </div>
      <input
        type="text"
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder="0"
        css={`
          display: block;
          width: 100%;
          text-align: center;
          font-weight: 600;
          color: #fff;
          font-size: ${isCompact ? '36px' : '88px'};
          background: transparent;
          border: 0;
          outline: none;
          &::placeholder {
            color: #fff;
          }
        `}
      />
    </label>
  )
}

AmountInput.propTypes = {
  color: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  symbol: PropTypes.oneOf([collateral.symbol, bonded.symbol]).isRequired,
  value: PropTypes.string,
}

export default AmountInput
