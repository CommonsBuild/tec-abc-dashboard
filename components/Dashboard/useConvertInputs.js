import { useState, useEffect, useCallback, useMemo } from 'react'
import { bigNum } from 'lib/utils'
import { useBondingCurvePrice, useTokenDecimals } from 'lib/web3-contracts'
import { formatUnits, parseUnits } from 'lib/web3-utils'

import { bonded } from '../../config'

const PCT_BASE = bigNum(10).pow(18)

// Filters and parse the input value of a token amount.
// Returns a BN.js instance and the filtered value.
function parseInputValue(inputValue, decimals) {
  if (decimals === -1) {
    return null
  }

  inputValue = inputValue.trim()

  // amount is the parsed value (BN.js instance)
  const amount = parseUnits(inputValue, { digits: decimals })

  if (amount.lt(0)) {
    return null
  }

  return { amount, inputValue }
}

export function useConvertInputs(otherSymbol, toBonded = true) {
  //The values in "pretty" format for the interface
  const [inputValueRecipient, setInputValueRecipient] = useState('')
  const [inputValueSource, setInputValueSource] = useState('')
  const [
    amountMinWithSlippageFormatted,
    setAmountMinWithSlippageFormatted,
  ] = useState('')
  const [pricePerUnitReceived, setPricePerUnitReceived] = useState('')
  const [amountRetained, setAmountRetained] = useState('')
  // The values in "raw" (BigNum) format for contract interaction
  const [amountRecipient, setAmountRecipient] = useState(bigNum(0))
  const [amountSource, setAmountSource] = useState(bigNum(0))
  const [amountMinWithSlippage, setAmountMinWithSlippage] = useState(bigNum(0))
  const [editing, setEditing] = useState(null)
  const {
    loading: bondingPriceLoading,
    price: bondingCurvePrice,
    pricePerUnit: bondingCurvePricePerUnit,
    entryTribute,
    exitTribute,
  } = useBondingCurvePrice(amountSource, toBonded)
  const bondedDecimals = useTokenDecimals(bonded.symbol)
  const otherDecimals = useTokenDecimals(otherSymbol)

  // convertFromBonded is used as a toggle to execute a conversion to or from Bonded.
  const [convertFromBonded, setConvertFromBonded] = useState(false)

  const resetInputs = useCallback(() => {
    setInputValueSource('')
    setInputValueRecipient('')
    setAmountRecipient(bigNum(0))
    setAmountSource(bigNum(0))
    setAmountMinWithSlippage(bigNum(0))
    setAmountMinWithSlippageFormatted('')
    setPricePerUnitReceived('')
    setAmountRetained('')
  }, [])

  // Reset the inputs anytime the selected token changes
  useEffect(() => {
    resetInputs()
  }, [otherSymbol, resetInputs])

  // Calculate the Bonded amount from the other amount
  useEffect(() => {
    if (
      bondedDecimals === -1 ||
      otherDecimals === -1 ||
      convertFromBonded ||
      bondingPriceLoading ||
      editing === 'bonded'
    ) {
      return
    }

    const maxSlippagePct = 0.01 //slippage hardcoded at 1% for now, can be made changeable in the future
    const amount = bondingCurvePrice
    const amountRetained = toBonded
      ? amountSource.mul(entryTribute).div(PCT_BASE)
      : amount.mul(exitTribute).div(PCT_BASE.sub(exitTribute))
    const receivedWithSlippage = amount.mul(100 * (1 - maxSlippagePct)).div(100)
    const pricePerUnit = bondingCurvePricePerUnit

    setAmountRecipient(amount)
    setInputValueRecipient(
      formatUnits(amount, { digits: bondedDecimals, truncateToDecimalPlace: 8 })
    )
    setAmountRetained(
      formatUnits(amountRetained, {
        digits: bondedDecimals,
        truncateToDecimalPlace: 8,
        replaceZeroBy: 0,
      })
    )
    setPricePerUnitReceived(
      formatUnits(pricePerUnit, {
        digits: bondedDecimals,
        truncateToDecimalPlace: 8,
        replaceZeroBy: 0,
      })
    )
    setAmountMinWithSlippage(receivedWithSlippage)
    setAmountMinWithSlippageFormatted(
      formatUnits(receivedWithSlippage, {
        digits: bondedDecimals,
        truncateToDecimalPlace: 8,
        replaceZeroBy: 0,
      })
    )
  }, [
    amountSource,
    bondedDecimals,
    bondingCurvePrice,
    bondingCurvePricePerUnit,
    bondingPriceLoading,
    convertFromBonded,
    editing,
    entryTribute,
    exitTribute,
    otherDecimals,
    toBonded,
  ])

  // Alternate the comma-separated format, based on the fields focus state.
  const setEditModeOther = useCallback(
    editMode => {
      setEditing(editMode ? 'other' : null)
      setInputValueSource(
        formatUnits(amountSource, {
          digits: otherDecimals,
          commas: !editMode,
        })
      )
    },
    [amountSource, otherDecimals]
  )

  const setEditModeBonded = useCallback(
    editMode => {
      setEditing(editMode ? 'bonded' : null)
      setInputValueRecipient(
        formatUnits(amountRecipient, {
          digits: bondedDecimals,
          commas: !editMode,
        })
      )
    },
    [amountRecipient, bondedDecimals]
  )

  const handleOtherInputChange = useCallback(
    event => {
      setConvertFromBonded(false)

      if (otherDecimals === -1) {
        return
      }
      const parsed = parseInputValue(event.target.value, otherDecimals)
      if (parsed !== null) {
        setInputValueSource(parsed.inputValue)
        setAmountSource(parsed.amount)
      }
    },
    [otherDecimals]
  )

  const handleBondedInputChange = useCallback(
    event => {
      setConvertFromBonded(true)

      if (bondedDecimals === -1) {
        return
      }
      const parsed = parseInputValue(event.target.value, bondedDecimals)
      if (parsed !== null) {
        setInputValueRecipient(parsed.inputValue)
        setAmountRecipient(parsed.amount)
      }
    },
    [bondedDecimals]
  )

  const handleManualInputChange = useCallback(
    amount => {
      if (otherDecimals === -1) {
        return
      }
      const parsed = parseInputValue(amount, otherDecimals)
      if (parsed !== null) {
        setInputValueSource(parsed.inputValue)
        setAmountSource(parsed.amount)
      }
    },
    [otherDecimals]
  )

  const bindOtherInput = useMemo(
    () => ({
      onChange: handleOtherInputChange,
      onBlur: () => setEditModeOther(false),
      onFocus: () => setEditModeOther(true),
    }),
    [setEditModeOther, handleOtherInputChange]
  )

  const bindBondedInput = useMemo(
    () => ({
      onChange: handleBondedInputChange,
      onBlur: () => setEditModeBonded(false),
      onFocus: () => setEditModeBonded(true),
    }),
    [setEditModeBonded, handleBondedInputChange]
  )

  return {
    // The  "raw" parsed amounts
    amountSource,
    amountRecipient,
    amountMinWithSlippage,
    // Event handlers to bind the inputs
    bindOtherInput,
    bindBondedInput,
    bondingPriceLoading,
    handleManualInputChange,
    // The values to be used in the interface
    inputValueRecipient,
    inputValueSource,
    amountMinWithSlippageFormatted,
    amountRetained,
    entryTributePct:
      entryTribute
        .mul(10000)
        .div(PCT_BASE)
        .toNumber() / 100,
    exitTributePct:
      exitTribute
        .mul(10000)
        .div(PCT_BASE)
        .toNumber() / 100,
    pricePerUnitReceived,
    resetInputs,
  }
}
