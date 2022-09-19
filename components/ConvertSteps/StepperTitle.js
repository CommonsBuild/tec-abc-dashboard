import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'styled-components'
import {
  STEPPER_IN_PROGRESS,
  STEPPER_SUCCESS,
  STEPPER_ERROR,
} from './stepper-statuses'
import { formatUnits } from 'lib/web3-utils'
import { useTokenDecimals } from 'lib/web3-contracts'

import { collateral, bonded } from '../../config'

const smallCaps = css`
  font-size: 32px;
`

function StepperTitle({ fromAmount, convertedTotal, status, toBonded }) {
  const collateralDecimals = useTokenDecimals(collateral.symbol)
  const bondedDecimals = useTokenDecimals(bonded.symbol)

  const formattedFromAmount = formatUnits(fromAmount, {
    digits: toBonded ? collateralDecimals : bondedDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
  })

  const formattedTotal = formatUnits(convertedTotal, {
    digits: toBonded ? bondedDecimals : collateralDecimals,
    truncateToDecimalPlace: 8,
    commas: true,
  })

  if (status === STEPPER_IN_PROGRESS || status === STEPPER_ERROR) {
    return (
      <>
        Convert {formattedFromAmount}{' '}
        <span css={smallCaps}>
          {toBonded ? collateral.symbol : bonded.symbol}
        </span>{' '}
        to{' '}
        <span css={smallCaps}>
          {toBonded ? bonded.symbol : collateral.symbol}
        </span>
      </>
    )
  } else if (status === STEPPER_SUCCESS) {
    return (
      <>
        You successfully converted <br />
        {formattedFromAmount}{' '}
        <span css={smallCaps}>
          {toBonded ? collateral.symbol : bonded.symbol}
        </span>{' '}
        to {formattedTotal}{' '}
        <span css={smallCaps}>
          {toBonded ? bonded.symbol : collateral.symbol}
        </span>
      </>
    )
  }
}

StepperTitle.propTypes = {
  fromAmount: PropTypes.object,
  convertedTotal: PropTypes.object,
  toBonded: PropTypes.bool,
  status: PropTypes.oneOf([
    STEPPER_IN_PROGRESS,
    STEPPER_SUCCESS,
    STEPPER_ERROR,
  ]),
}

export default StepperTitle
