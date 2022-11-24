import React, { useMemo } from 'react'
import { formatUnits } from 'lib/web3-utils'
import colors from 'utils/colors'
import { bigNum } from '../../lib/utils'

// TODO: Provide `digits` into formatUnits
function Balance({
  tokenAmountToConvert,
  tokenBalance,
  spendableBalance,
  insideInput,
  noShowError,
}) {
  const balanceError = useMemo(
    () =>
      !noShowError &&
      tokenAmountToConvert.gt(spendableBalance) &&
      !tokenAmountToConvert.eq(-1) &&
      !tokenBalance.eq(-1),
    [tokenAmountToConvert, tokenBalance, spendableBalance]
  )

  return !tokenBalance.eq(-1) ? (
    <div
      css={`
        display: flex;
        width: ${insideInput ? '178px' : 'auto'};
        flex-direction: ${insideInput ? 'row' : 'column'};
        text-align: center;
        font-family: 'BaiJamjuree', 'Calibre', sans-serif;
        color: ${balanceError
          ? insideInput
            ? colors.red
            : '#FF7163'
          : 'white'};
        font-weight: ${balanceError ? 'bold' : 'normal'};
        background: ${balanceError
          ? 'rgba(255, 255, 255, 0.7)'
          : 'transparent'};
        padding: 4px 8px;
        border: 1px solid
          ${insideInput
            ? balanceError
              ? colors.red
              : '#d2f67b'
            : 'transparent'};
        border-radius: 16px !important;
        font-size: ${insideInput ? '10px' : 'inherit'};
        gap: 4px;
      `}
    >
      {balanceError ? 'Insufficient balance' : 'Balance'}:{' '}
      {formatUnits(spendableBalance || 0, {
        truncateToDecimalPlace: 1,
        replaceZeroBy: '0',
      })}
      <br />
      <div
        style={{
          borderLeft: insideInput ? '1px solid white' : 'none',
          padding: '0 0 0 4px',
        }}
      >
        {!spendableBalance.eq(tokenBalance) &&
          `Locked: ${formatUnits(tokenBalance.sub(spendableBalance), {
            truncateToDecimalPlace: 1,
            replaceZeroBy: '0',
          })}`}
      </div>
    </div>
  ) : null
}

export default Balance
